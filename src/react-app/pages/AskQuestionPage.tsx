import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Hash, AlertCircle, Loader2, XCircle, Save, Clock, Smartphone } from 'lucide-react';

// 创建优化标签组件
const TagItem = memo(({ tag, onRemove, disabled }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full">
    <span>#{tag}</span>
    <button
      type="button"
      onClick={() => onRemove(tag)}
      className="text-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
      disabled={disabled}
      aria-label={`移除标签 ${tag}`}
    >
      ×
    </button>
  </div>
));

TagItem.displayName = 'TagItem';

// 热门标签组件
const PopularTags = memo(({ tags, onAddTag, disabled }) => (
  <div className="flex flex-wrap gap-2">
    {['React', 'JavaScript', 'TypeScript', '职场', '面试', '技术', 'Vue', 'Node.js', '前端', '后端'].map((tag) => (
      <button
        type="button"
        key={tag}
        onClick={() => onAddTag(tag)}
        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        disabled={disabled || tags.includes(tag) || tags.length >= 5}
        aria-label={`添加标签 ${tag}`}
      >
        #{tag}
      </button>
    ))}
  </div>
));

PopularTags.displayName = 'PopularTags';

// 加载遮罩层
const LoadingOverlay = memo(({ message = '正在处理，请稍候...' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center min-w-[200px] transform scale-100 animate-popIn">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
      <p className="text-gray-700 font-medium text-center">{message}</p>
      <p className="text-sm text-gray-500 mt-2 text-center">这可能需要几秒钟</p>
    </div>
  </div>
));

LoadingOverlay.displayName = 'LoadingOverlay';

// 主组件
function AskQuestionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const isSubmitting = useRef(false);
  const formRef = useRef(null);
  const autoSaveTimer = useRef(null);
  const titleInputRef = useRef(null);
  const performanceStartTime = useRef(0);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [questionId, setQuestionId] = useState('');
  const [success, setSuccess] = useState(false);
  const [showMobileTips, setShowMobileTips] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // 检查是否为移动设备
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setShowMobileTips(isMobile);
    
    // 自动聚焦标题输入框
    if (titleInputRef.current && !editId) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [editId]);

  // 监听内容变化更新字符数
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  // 自动保存草稿
  useEffect(() => {
    if (!isEditMode && (title || content) && !loading) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      
      autoSaveTimer.current = setTimeout(() => {
        const draft = { title, content, tags };
        localStorage.setItem('question_draft', JSON.stringify(draft));
        setDraftSaved(true);
        
        // 3秒后隐藏保存提示
        setTimeout(() => setDraftSaved(false), 3000);
      }, 3000);
    }
    
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [title, content, tags, isEditMode, loading]);

  // 加载草稿
  useEffect(() => {
    if (!isEditMode && !loading) {
      const draft = localStorage.getItem('question_draft');
      if (draft) {
        try {
          const { title: draftTitle, content: draftContent, tags: draftTags } = JSON.parse(draft);
          if (draftTitle || draftContent) {
            if (window.confirm('检测到有未保存的草稿，是否恢复？')) {
              setTitle(draftTitle || '');
              setContent(draftContent || '');
              setTags(draftTags || []);
              localStorage.removeItem('question_draft');
            }
          }
        } catch (err) {
          console.error('加载草稿失败:', err);
        }
      }
    }
  }, [isEditMode, loading]);

  // 加载编辑的问题
  useEffect(() => {
    if (editId && user) {
      loadQuestion(editId);
    }
  }, [editId, user]);

  // 生成UUID
  const generateId = useCallback(() => {
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }, []);

  // 加载问题
  const loadQuestion = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setQuestionId(data.id);
        setTitle(data.title || '');
        setContent(data.content || '');
        setTags(data.tags || []);
        setIsEditMode(true);
      }
    } catch (err) {
      console.error('加载问题失败:', err);
      setError(`加载问题失败: ${err.message || '请检查网络连接'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // 性能监控
  const measurePerformance = useCallback(async (operation, fn) => {
    const start = performance.now();
    performanceStartTime.current = start;
    
    try {
      const result = await fn();
      const end = performance.now();
      console.log(`🚀 ${operation} 耗时: ${Math.round(end - start)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`❌ ${operation} 失败，耗时: ${Math.round(end - start)}ms`, error);
      throw error;
    }
  }, []);

  // 处理表单提交
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isSubmitting.current) return;
    
    if (!user) {
      alert('请先登录');
      navigate('/login');
      return;
    }
    
    if (!title.trim()) {
      setError('请填写问题标题');
      titleInputRef.current?.focus();
      return;
    }
    
    if (!content.trim() || content.length < 10) {
      setError('请详细描述您的问题（至少10个字符）');
      return;
    }
    
    isSubmitting.current = true;
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // -----------------------------------------------------
      // 核心修改：在此处插入封禁检测逻辑
      // -----------------------------------------------------
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_banned')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        // 如果查不到profile可能是网络问题，暂时允许或根据需要报错
        console.error('检查用户状态失败', profileError);
      }

      if (profile?.is_banned) {
        throw new Error('您的账号已被封禁，无法在“谷子小说”发布或编辑问题。');
      }
      // -----------------------------------------------------

      let result;
      
      if (isEditMode && questionId) {
        console.log('📝 编辑模式，问题ID:', questionId);
        
        const updateData = {
          title: title.trim(),
          content: content.trim(),
          tags: tags,
          updated_at: new Date().toISOString(),
        };
        
        result = await measurePerformance('更新问题', () =>
          supabase
            .from('questions')
            .update(updateData)
            .eq('id', questionId)
            .eq('user_id', user.id)
        );
          
      } else {
        console.log('🆕 新建模式');
        
        const newQuestionId = generateId();
        const questionData = {
          id: newQuestionId,
          title: title.trim(),
          content: content.trim(),
          user_id: user.id,
          author: { 
            id: user.id, 
            email: user.email,
            username: user.user_metadata?.username || user.email?.split('@')[0],
            name: user.user_metadata?.full_name || user.user_metadata?.username || user.email?.split('@')[0]
          },
          stats: { 
            likes: 0, 
            views: 0, 
            comments: 0,
            answers: 0
          },
          tags: tags,
          created_at: new Date().toISOString(),
        };
        
        result = await measurePerformance('创建问题', () =>
          supabase
            .from('questions')
            .insert([questionData])
        );
      }

      if (result.error) throw result.error;
      
      setSuccess(true);
      
      // 清除草稿
      localStorage.removeItem('question_draft');
      
      // 使用更优雅的成功提示
      setTimeout(() => {
        alert(`✅ ${isEditMode ? '问题更新成功！' : '问题提交成功！'}`);
        
        // 重置表单
        if (!isEditMode) {
          setTitle('');
          setContent('');
          setTags([]);
        }
        
        // 延迟跳转
        setTimeout(() => {
          navigate('/my-questions');
        }, 300);
      }, 100);
      
    } catch (error) {
      console.error('❌ 保存问题失败详情:', error);
      
      let errorMessage = '保存失败';
      
      if (error.message?.includes('network')) {
        errorMessage = '网络连接失败，请检查网络后重试';
      } else if (error.code === '23505') {
        errorMessage = '问题已存在，请修改标题';
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      if (error.code) {
        errorMessage += ` (错误代码: ${error.code})`;
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
      setTimeout(() => {
        isSubmitting.current = false;
      }, 1000);
    }
  }, [title, content, tags, isEditMode, questionId, user, navigate, generateId, measurePerformance]);

  // 添加标签
  const addTag = useCallback(() => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags(prev => [...prev, trimmedTag]);
      setCurrentTag('');
    }
  }, [currentTag, tags]);

  // 移除标签
  const removeTag = useCallback((tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  // 添加热门标签
  const addPopularTag = useCallback((tag) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags(prev => [...prev, tag]);
    }
  }, [tags]);

  // 处理标签输入按键
  const handleTagKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      addTag();
    }
  }, [currentTag, addTag]);

  // 清除草稿
  const clearDraft = useCallback(() => {
    if (window.confirm('确定要清除草稿吗？')) {
      localStorage.removeItem('question_draft');
      setTitle('');
      setContent('');
      setTags([]);
      setDraftSaved(false);
    }
  }, []);

  // 使用 useMemo 缓存热门标签
  const popularTags = useMemo(() => (
    ['React', 'JavaScript', 'TypeScript', '职场', '面试', '技术']
  ), []);

  // 计算问题质量评分
  const questionQuality = useMemo(() => {
    let score = 0;
    if (title.length >= 10) score += 30;
    if (content.length >= 50) score += 40;
    if (tags.length >= 1) score += 15;
    if (tags.length >= 3) score += 15;
    return Math.min(score, 100);
  }, [title, content, tags.length]);

  if (loading && isEditMode && !editId) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* 移动端提示 */}
      {showMobileTips && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3 animate-slideDown">
          <Smartphone className="h-5 w-5 text-purple-600 flex-shrink-0" />
          <p className="text-sm text-purple-700">💡 提示：在手机上可以横屏获得更好的编辑体验</p>
        </div>
      )}
      
      {/* 草稿保存提示 */}
      {draftSaved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between animate-slideDown">
          <div className="flex items-center gap-2">
            <Save className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">草稿已自动保存</span>
          </div>
          <button
            onClick={clearDraft}
            className="text-xs text-green-600 hover:text-green-800 underline"
          >
            清除草稿
          </button>
        </div>
      )}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? '编辑问题' : '提问'}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">分享您的问题，获得社区的帮助</p>
      </div>

      {/* 问题质量指示器 */}
      {!isEditMode && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                questionQuality >= 60 ? 'bg-green-500' : 
                questionQuality >= 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="font-medium text-gray-800">问题质量评分</span>
            </div>
            <span className="font-bold text-lg">{questionQuality}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                questionQuality >= 60 ? 'bg-green-500' : 
                questionQuality >= 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${questionQuality}%` }}
            />
          </div>
          <div className="mt-3 text-xs text-gray-600 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className={`flex items-center gap-1 ${title.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>标题清晰</span>
            </div>
            <div className={`flex items-center gap-1 ${content.length >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>描述详细</span>
            </div>
            <div className={`flex items-center gap-1 ${tags.length >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>添加标签</span>
            </div>
            <div className={`flex items-center gap-1 ${tags.length >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>标签丰富</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 animate-shake">
          <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">提交失败</p>
            <p className="text-sm mt-1 break-words">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-2 text-sm underline hover:text-red-800 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* 标题输入 */}
        <div className="bg-white rounded-xl border p-4 sm:p-6 transition-all duration-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:shadow-sm">
          <label className="block text-lg font-medium text-gray-900 mb-3">
            问题标题
            <span className="text-sm font-normal text-gray-500 ml-2">(清晰的问题更容易获得回答)</span>
          </label>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请简要描述您的问题，如：React组件如何实现数据绑定？"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all placeholder:text-gray-400"
            required
            disabled={loading}
            maxLength={200}
          />
          <div className="mt-2 text-right">
            <span className={`text-xs ${title.length > 150 ? 'text-red-500' : 'text-gray-500'}`}>
              {title.length}/200
            </span>
          </div>
        </div>

        {/* 内容输入 */}
        <div className="bg-white rounded-xl border p-4 sm:p-6 transition-all duration-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-lg font-medium text-gray-900">
              问题详情
            </label>
            <div className="text-sm text-gray-500">
              <span className={charCount < 10 ? 'text-red-500' : 'text-green-600'}>
                {charCount}
              </span>
              <span className="text-gray-400">/</span>
              <span>2000</span>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请详细描述您的问题背景、遇到的困难、尝试过的解决方案等。清晰的描述有助于获得更准确的回答。"
            rows={8}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y transition-all placeholder:text-gray-400 text-base"
            required
            disabled={loading}
            maxLength={2000}
          />
          <div className="mt-3 text-sm text-gray-600">
            <p>💡 提示：可以使用以下格式让问题更清晰</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><span className="font-medium">问题背景：</span>描述遇到的问题场景</li>
              <li><span className="font-medium">预期结果：</span>你希望达到的效果</li>
              <li><span className="font-medium">已尝试方案：</span>你已经尝试过的方法</li>
            </ul>
          </div>
        </div>

        {/* 标签输入 */}
        <div className="bg-white rounded-xl border p-4 sm:p-6 transition-all duration-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:shadow-sm">
          <label className="block text-lg font-medium text-gray-900 mb-3">
            添加标签
            <span className="text-sm text-gray-500 ml-2">（最多5个标签，帮助分类）</span>
          </label>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex-1 relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="输入标签，按Enter添加"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all placeholder:text-gray-400"
                disabled={loading || tags.length >= 5}
                maxLength={20}
              />
            </div>
            <button
              type="button"
              onClick={addTag}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 font-medium"
              disabled={loading || tags.length >= 5 || !currentTag.trim()}
            >
              添加
            </button>
          </div>

          {tags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">已选标签 ({tags.length}/5):</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagItem
                    key={tag}
                    tag={tag}
                    onRemove={removeTag}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600 mb-2">热门标签 (点击添加):</p>
            <PopularTags
              tags={tags}
              onAddTag={addPopularTag}
              disabled={loading}
            />
          </div>
        </div>

        {/* 提示卡片 */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1 text-lg">提问小贴士</h4>
              <ul className="text-sm text-blue-700 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>在提问前，先搜索是否已有类似问题，避免重复</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>详细描述问题背景和您尝试过的解决方案</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>使用明确的标签有助于获得更准确的回答</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>如果包含代码，请使用代码块格式，方便他人阅读</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between pt-4 sm:pt-6 border-t">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {draftSaved ? '草稿已保存' : '自动保存草稿中...'}
            </span>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/questions"
              className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              onClick={(e) => loading && e.preventDefault()}
            >
              返回列表
            </Link>
            
            {isEditMode && (
              <button
                type="button"
                onClick={() => navigate('/my-questions')}
                className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 active:scale-95"
                disabled={loading}
              >
                取消
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-[48px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isEditMode ? '更新中...' : '提交中...'}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>{isEditMode ? '更新问题' : '发布问题'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 键盘快捷键提示 */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>💡 快捷键提示: Enter添加标签 • Ctrl+Enter提交表单</p>
      </div>

      {/* 加载遮罩层 */}
      {loading && <LoadingOverlay />}
    </div>
  );
}

// 使用 React.memo 包装组件
export default memo(AskQuestionPage);