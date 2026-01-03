import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Loader2, Clock, AlertCircle, BookOpen, Type, Hash, Globe, Lock, 
  ImageIcon, Save, Send 
} from 'lucide-react';

function WritePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const draftId = searchParams.get('draft');
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("fantasy");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveCount, setAutoSaveCount] = useState(0);
  const [savingDraft, setSavingDraft] = useState(false);
  const [originalNovelData, setOriginalNovelData] = useState<any>(null);

  const categories = [
    { id: "fantasy", name: "玄幻奇幻", icon: "⚔️", color: "from-purple-500 to-pink-500" },
    { id: "urban", name: "都市生活", icon: "🏙️", color: "from-blue-500 to-cyan-500" },
    { id: "romance", name: "现代言情", icon: "❤️", color: "from-red-500 to-pink-500" },
    { id: "scifi", name: "科幻未来", icon: "🚀", color: "from-indigo-500 to-blue-500" },
    { id: "historical", name: "历史军事", icon: "🏰", color: "from-amber-500 to-orange-500" },
  ];

  // 生成UUID的函数
  const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // 添加默认封面图片函数
  const getDefaultCoverImage = () => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop&auto=format',
    ];
    
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
  };

  // 先定义 saveDraft 函数（解决初始化顺序错误）
  const saveDraft = useCallback(async (isAuto = false) => {
    if (!user?.id) {
      if (!isAuto) alert('请先登录');
      return null;
    }

    // 封禁检测逻辑
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_banned')
      .eq('id', user.id)
      .single();
    
    if (profile?.is_banned) {
      if (isAuto) {
        console.warn('用户已被封禁，自动保存跳过');
        return null;
      } else {
        alert('您的账号已被封禁，无法在“谷子小说”保存草稿。');
        throw new Error('Account banned');
      }
    }

    if (!title.trim() && !content.trim()) {
      if (!isAuto) alert('请填写标题或内容');
      return null;
    }

    setSavingDraft(true);
    try {
      // 准备草稿数据
      const draftData = {
        title: title.trim() || '无标题草稿',
        content: content.trim(),
        description: description.trim(),
        category: category,
        tags: tags,
        author_id: user.id,
        novel_id: editId || null,
        updated_at: new Date().toISOString()
      };

      let data;
      if (currentDraftId) {
        // 更新现有草稿
        const { data: updateData, error: updateError } = await supabase
          .from('novel_drafts')
          .update(draftData)
          .eq('id', currentDraftId)
          .eq('author_id', user.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        data = updateData;
      } else {
        // 创建新草稿
        const { data: insertData, error: insertError } = await supabase
          .from('novel_drafts')
          .insert({
            ...draftData,
            id: generateId(),
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        data = insertData;
        setCurrentDraftId(data.id);
      }

      setLastSaved(new Date());

      if (isAuto) {
        setAutoSaveCount(prev => prev + 1);
      } else {
        alert('草稿保存成功！');
      }
      
      return data.id;
    } catch (err: any) {
      console.error('保存草稿失败:', err);
      if (!isAuto && err.message !== 'Account banned') {
        alert('保存草稿失败: ' + (err.message || '未知错误'));
      }
      return null;
    } finally {
      setSavingDraft(false);
    }
  }, [title, content, description, category, tags, user?.id, currentDraftId, editId]);

  // 自动保存效果（后使用 saveDraft，解决顺序问题）
  useEffect(() => {
    let autoSaveTimer: NodeJS.Timeout;
    
    const autoSave = async () => {
      if ((title.trim() || content.trim()) && user?.id) {
        try {
          await saveDraft(true);
        } catch (error) {
          console.error('自动保存失败:', error);
        }
      }
    };

    if (title.trim() || content.trim()) {
      autoSaveTimer = setTimeout(autoSave, 30000);
    }

    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [title, content, user?.id, saveDraft]);

  // 页面离开提示
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title.trim() || content.trim()) {
        e.preventDefault();
        e.returnValue = '您有未保存的更改，确定要离开吗？';
        return '您有未保存的更改，确定要离开吗？';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [title, content]);

  // 加载小说/草稿的逻辑
  useEffect(() => {
    if (!user) return;
    
    const loadContent = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 1. 优先加载已发布的小说（编辑模式）
        if (editId) {
          const { data: novelData, error: novelError } = await supabase
            .from('novels')
            .select('*')
            .eq('id', editId)
            .or(`author->>id.eq.${user.id},user_id.eq.${user.id},author_id.eq.${user.id}`)
            .single();
          
          if (novelError) {
            throw new Error(`加载小说失败：${novelError.message}`);
          }
          
          if (!novelData) {
            throw new Error('未找到该小说，或您没有编辑权限');
          }
          
          setOriginalNovelData(novelData);
          setTitle(novelData.title || '');
          setContent(novelData.content || '');
          setDescription(novelData.description || '');
          setCategory(novelData.category || 'fantasy');
          setTags(Array.isArray(novelData.tags) ? novelData.tags : []);
          setIsPublic(novelData.is_public !== false);
          setIsEditMode(true);
          
          console.log('成功加载已发布小说:', novelData);
          
          // 尝试加载关联的草稿
          const { data: draftData, error: draftError } = await supabase
            .from('novel_drafts')
            .select('*')
            .eq('novel_id', editId)
            .eq('author_id', user.id)
            .single();
          
          if (!draftError && draftData) {
            setCurrentDraftId(draftData.id);
          }
          return;
        }
        
        // 2. 加载草稿
        if (draftId) {
          const { data: draftData, error: draftError } = await supabase
            .from('novel_drafts')
            .select('*')
            .eq('id', draftId)
            .eq('author_id', user.id)
            .single();
          
          if (draftError) {
            throw new Error(`加载草稿失败：${draftError.message}`);
          }
          
          if (!draftData) {
            throw new Error('未找到该草稿');
          }
          
          setTitle(draftData.title || '');
          setContent(draftData.content || '');
          setDescription(draftData.description || '');
          setCategory(draftData.category || 'fantasy');
          setTags(Array.isArray(draftData.tags) ? draftData.tags : []);
          setCurrentDraftId(draftData.id);
          
          // 如果草稿关联了小说，加载小说的公开状态
          if (draftData.novel_id) {
            const { data: novelData, error: novelError } = await supabase
              .from('novels')
              .select('is_public')
              .eq('id', draftData.novel_id)
              .eq('author->>id', user.id)
              .single();

            if (!novelError && novelData) {
              setIsPublic(novelData.is_public !== false);
            }
          }
          console.log('加载草稿成功:', draftData);
        }
      } catch (err: any) {
        console.error('加载内容失败:', err);
        setError('加载失败：' + err.message);
        alert('加载失败：' + err.message);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [editId, draftId, user, navigate]);

  // 提交/更新小说逻辑
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('请先登录');
      navigate('/login');
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 封禁检测逻辑
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_banned')
        .eq('id', user.id)
        .single();

      if (profile?.is_banned) {
        throw new Error('您的账号已被封禁，无法在“谷子小说”发布作品。');
      }

      // 1. 先保存草稿
      let finalDraftId = currentDraftId;
      if (!finalDraftId) {
        const savedDraftId = await saveDraft(false); 
        if (!savedDraftId) {
          throw new Error('保存草稿失败，无法继续发布');
        }
        finalDraftId = savedDraftId;
      }

      // 2. 准备更新数据
      const updateData = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        category: category,
        tags: tags,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
        cover: originalNovelData?.cover || getDefaultCoverImage(),
        author: originalNovelData?.author || { id: user.id },
        user_id: originalNovelData?.user_id || user.id,
        created_at: originalNovelData?.created_at || new Date().toISOString(),
        stats: originalNovelData?.stats || { views: 0, likes: 0, chapters: 1 }
      };

      let publishedNovelId;
      
      if (isEditMode && editId) {
        // 更新已发布小说
        const { data: updatedNovel, error: updateError } = await supabase
          .from('novels')
          .update(updateData)
          .eq('id', editId)
          .or(`author->>id.eq.${user.id},user_id.eq.${user.id},author_id.eq.${user.id}`)
          .select()
          .single();
        
        if (updateError) {
          throw new Error(`更新小说失败：${updateError.message}`);
        }
        
        publishedNovelId = updatedNovel.id;
        console.log('成功更新小说:', updatedNovel);
      } else {
        // 发布新小说
        const novelData = {
          ...updateData,
          id: generateId(),
          created_at: new Date().toISOString()
        };

        const { data: insertData, error: insertError } = await supabase
          .from('novels')
          .insert(novelData)
          .select()
          .single();
        
        if (insertError) throw insertError;
        publishedNovelId = insertData.id;
      }

      // 更新草稿关联的小说ID
      if (finalDraftId) {
        await supabase
          .from('novel_drafts')
          .update({ novel_id: publishedNovelId })
          .eq('id', finalDraftId)
          .eq('author_id', user.id);
      }

      alert(isEditMode ? '小说更新成功！' : '小说发布成功！');
      navigate(`/novel/${publishedNovelId}`);
    } catch (err: any) { 
      console.error('操作失败:', err);
      if (err.message) {
         setError(err.message);
         if (!error) alert(err.message); 
      }
    } finally {
      setLoading(false);
    }
  };

  // 手动保存草稿
  const handleSaveDraft = async () => {
    if (!user?.id) {
      alert('请先登录');
      navigate('/login');
      return;
    }

    await saveDraft(false);
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (loading && (editId || draftId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 全局样式：解决长文本不换行问题（直接内嵌，无需额外CSS文件） */}
      <style>
        {`
          /* 通用长文本换行样式 */
          .break-word {
            word-break: break-word !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
            word-wrap: break-word !important; /* 兼容旧浏览器 */
          }
          /* 防止输入框/文本区域横向溢出 */
          .no-overflow {
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
          /* 响应式适配，确保移动端不被拉长 */
          @media (max-width: 768px) {
            .container {
              padding: 0 2px !important;
            }
            .form-input, .form-textarea {
              font-size: 14px !important;
              padding: 8px 12px !important;
            }
          }
        `}
      </style>

      <div className="container mx-auto px-4 py-8 max-w-6xl no-overflow">
        {/* 保存状态提示 */}
        {autoSaveCount > 0 && (
          <div className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg shadow-md z-50 break-word no-overflow">
            <Clock className="h-4 w-4" />
            <span className="text-sm">已自动保存 {autoSaveCount} 次</span>
          </div>
        )}

        {lastSaved && (
          <div className="fixed top-4 left-4 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg shadow-md z-50 break-word no-overflow">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              最后保存: {lastSaved.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

        <div className="mb-8 break-word no-overflow">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 break-word">
            {isEditMode ? '编辑已发布小说' : draftId ? '编辑草稿' : '创作小说'}
          </h1>
          <p className="text-gray-600 break-word">
            {isEditMode ? '修改你的小说内容，更新后将实时生效' : 
             draftId ? '编辑你的草稿，完成后可发布' : 
             '开启你的创作之旅，写出属于你的精彩故事'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 break-word no-overflow">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 no-overflow">
          {/* 基本信息 */}
          <div className="bg-white rounded-2xl shadow-sm border p-8 break-word no-overflow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center break-word">
              <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
              基本信息
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3 break-word">小说标题</label>
                {/* 标题输入框：添加换行和防溢出样式 */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入吸引人的小说标题"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg break-word no-overflow form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3 break-word">作品简介</label>
                {/* 简介文本域：添加换行和防溢出样式 */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="简要介绍你的小说，吸引读者阅读..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none break-word no-overflow form-textarea"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-4 break-word">选择分类</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 no-overflow">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${category === cat.id ? `border-blue-500 bg-gradient-to-br bg-opacity-10 ${cat.color}` : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <span className="text-3xl mb-2">{cat.icon}</span>
                      <span className="font-medium break-word">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 标签 */}
              <div className="break-word no-overflow">
                <label className="block text-lg font-medium text-gray-900 mb-3 break-word">
                  添加标签
                  <span className="text-sm text-gray-500 ml-2">（最多5个标签，便于分类）</span>
                </label>
                
                <div className="flex gap-2 mb-4 no-overflow">
                  <div className="flex-1 relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="输入标签，按Enter添加"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 break-word no-overflow form-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    disabled={tags.length >= 5 || !currentTag.trim()}
                  >
                    添加
                  </button>
                </div>

                {/* 已选标签 */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 no-overflow">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full break-word"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-400 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 热门标签建议 */}
                <div className="break-word no-overflow">
                  <p className="text-sm text-gray-600 mb-2 break-word">热门标签：</p>
                  <div className="flex flex-wrap gap-2 no-overflow">
                    {['玄幻', '都市', '言情', '科幻', '历史', '谷子', '职场', '穿越'].map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => !tags.includes(tag) && tags.length < 5 && setTags([...tags, tag])}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                        disabled={tags.includes(tag) || tags.length >= 5}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 内容编辑：核心防换行拉长区域 */}
          <div className="bg-white rounded-2xl shadow-sm border p-8 break-word no-overflow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center break-word">
              <Type className="h-6 w-6 mr-3 text-green-600" />
              章节内容
            </h2>

            <div className="break-word no-overflow">
              <div className="flex items-center justify-between mb-4 break-word no-overflow">
                <label className="block text-lg font-medium text-gray-900 break-word">章节内容</label>
                <div className="flex items-center text-sm text-gray-500 break-word">
                  支持 Markdown 格式
                </div>
              </div>
              {/* 核心：内容文本域添加强制换行和防横向溢出样式 */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始你的写作...（建议字数2000-5000字）"
                rows={20}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-serif text-gray-800 leading-relaxed break-word no-overflow form-textarea"
                required
              />
              <div className="flex justify-between items-center mt-2 break-word no-overflow">
                <p className="text-sm text-gray-500 break-word">建议章节字数在 2000-5000 字之间</p>
                <span className="text-sm text-gray-500 break-word">{content.length} 字</span>
              </div>
            </div>
          </div>

          {/* 发布设置 */}
          <div className="bg-white rounded-2xl shadow-sm border p-8 break-word no-overflow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 break-word">
              {isEditMode ? '更新设置' : '发布设置'}
            </h2>

            <div className="space-y-8 break-word no-overflow">
              {/* 可见性设置 */}
              <div className="break-word no-overflow">
                <label className="block text-lg font-medium text-gray-900 mb-4 break-word">可见性设置</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-overflow">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`flex items-center p-6 rounded-xl border-2 transition-all ${isPublic ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
                  >
                    <Globe className="h-8 w-8 mr-4 text-gray-600" />
                    <div className="text-left break-word">
                      <div className="font-semibold text-lg break-word">公开</div>
                      <div className="text-gray-600 break-word">所有人可见，可被搜索和推荐</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`flex items-center p-6 rounded-xl border-2 transition-all ${!isPublic ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
                  >
                    <Lock className="h-8 w-8 mr-4 text-gray-600" />
                    <div className="text-left break-word">
                      <div className="font-semibold text-lg break-word">私密</div>
                      <div className="text-gray-600 break-word">仅自己可见，适合存稿</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 封面设置 */}
              <div className="break-word no-overflow">
                <label className="block text-lg font-medium text-gray-900 mb-4 flex items-center break-word">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  封面图片
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 break-word no-overflow">
                  {isEditMode && originalNovelData?.cover ? (
                    <>
                      <div className="flex items-center justify-center mb-6 no-overflow">
                        <div className="relative w-32 h-48 rounded-lg overflow-hidden">
                          <img 
                            src={originalNovelData.cover} 
                            alt={originalNovelData.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2 break-word">当前封面（编辑模式下不可修改）</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center mb-6 no-overflow">
                        <div className="relative w-32 h-48 rounded-lg overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2 break-word">系统将自动为您的作品分配精美封面</p>
                      <p className="text-sm text-gray-500 break-word">每篇小说都会有一个独特的系统配图</p>
                    </>
                  )}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg break-word no-overflow">
                    <p className="text-sm text-blue-700 break-word">
                      <span className="font-medium break-word">提示：</span> 
                      {isEditMode ? '已发布小说的封面暂不支持修改' : '封面图片从精选图库中自动分配'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 提示信息 */}
          {(!title.trim() || !content.trim()) && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-lg break-word no-overflow">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm break-word">
                标题和内容不能为空，建议先保存草稿
              </span>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between pt-8 border-t break-word no-overflow flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap break-word no-overflow">
              <Link
                to="/my/drafts"
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition break-word"
              >
                <Save className="h-4 w-4" /> 我的草稿箱
              </Link>
              <Link
                to="/novels"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition break-word"
              >
                返回书架
              </Link>
            </div>
            
            <div className="flex gap-4 break-word no-overflow">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft || loading || (!title.trim() && !content.trim())}
                className="flex items-center px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed break-word"
              >
                {savingDraft ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                {savingDraft ? '保存中...' : '保存草稿'}
              </button>
              <button
                type="submit"
                disabled={loading || savingDraft || (!title.trim() || !content.trim())}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed break-word"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                {isEditMode ? '更新小说' : '发布作品'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WritePage;