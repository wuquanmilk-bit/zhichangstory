import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // 调整路径
import { useAuth } from '../../contexts/AuthContext'; // 调整路径
import { 
  Edit, Trash2, Calendar, Clock, 
  BookOpen, Eye, Loader2, FileText, Globe, Lock 
} from 'lucide-react';

function MyDrafts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 加载草稿
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadDrafts();
  }, [user]);

  const loadDrafts = async () => {
    try {
      setLoading(true);
      console.log('正在加载草稿，用户ID:', user?.id);
      
      const { data, error } = await supabase
        .from('novel_drafts')
        .select('*')
        .eq('author_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (error) {
        console.error('查询草稿失败:', error);
        throw error;
      }
      
      console.log('草稿数据:', data);
      setDrafts(data || []);
    } catch (err: any) {
      console.error('加载草稿失败:', err);
      setError('加载草稿失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (draftId: string) => {
    if (!confirm('确定要删除这个草稿吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('novel_drafts')
        .delete()
        .eq('id', draftId)
        .eq('author_id', user?.id);
        
      if (error) throw error;
      
      setDrafts(drafts.filter(draft => draft.id !== draftId));
      alert('草稿已删除');
    } catch (err: any) {
      console.error('删除草稿失败:', err);
      alert('删除失败: ' + err.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWordCount = (text: string) => {
    if (!text) return 0;
    return text.trim().length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">正在加载草稿...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 标题栏 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">我的草稿箱</h1>
            <Link
              to="/write"
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              新建小说
            </Link>
          </div>
          <p className="text-gray-600">在这里管理您的所有草稿，可以随时继续编辑或删除</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* 草稿统计 */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">草稿总数</p>
                <p className="text-3xl font-bold text-gray-900">{drafts.length}</p>
              </div>
              <FileText className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">总字数</p>
                <p className="text-3xl font-bold text-gray-900">
                  {drafts.reduce((total, draft) => total + getWordCount(draft.content), 0).toLocaleString()}
                </p>
              </div>
              <Edit className="h-10 w-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">最近更新</p>
                <p className="text-lg font-semibold text-gray-900">
                  {drafts.length > 0 ? formatDate(drafts[0].updated_at).split(' ')[0] : '无'}
                </p>
              </div>
              <Clock className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* 草稿列表 */}
        {drafts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
            <FileText className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">暂无草稿</h3>
            <p className="text-gray-500 mb-8">开始创作你的第一部小说吧！</p>
            <Link
              to="/write"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              开始创作
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {drafts.map((draft) => (
              <div 
                key={draft.id} 
                className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                      {draft.title || '无标题草稿'}
                    </h3>
                    {draft.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {draft.description}
                      </p>
                    )}
                  </div>
                  {draft.is_public ? (
                    <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <Globe className="h-4 w-4" />
                      公开
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <Lock className="h-4 w-4" />
                      私密
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      更新于 {formatDate(draft.updated_at)}
                    </span>
                    {draft.created_at !== draft.updated_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        创建于 {formatDate(draft.created_at).split(' ')[0]}
                      </span>
                    )}
                  </div>
                  <span>{getWordCount(draft.content)} 字</span>
                </div>

                {draft.category && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                      {draft.category === 'fantasy' ? '玄幻奇幻' :
                       draft.category === 'urban' ? '都市生活' :
                       draft.category === 'romance' ? '现代言情' :
                       draft.category === 'scifi' ? '科幻未来' : '历史军事'}
                    </span>
                  </div>
                )}

                {/* 标签 */}
                {draft.tags && draft.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {draft.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {draft.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                        +{draft.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-3">
                    {/* 正确的编辑链接 - 添加 draft 参数 */}
                    <Link
                      to={`/write?draft=${draft.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Edit className="h-4 w-4" />
                      继续编辑
                    </Link>
                    <button
                      onClick={() => deleteDraft(draft.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </button>
                  </div>
                  
                  {/* 如果是关联小说的草稿，显示查看链接 */}
                  {draft.novel_id && (
                    <Link
                      to={`/novel/${draft.novel_id}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                      查看已发布版本
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 如果没有草稿，显示提示 */}
        {drafts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">还没有保存任何草稿</p>
            <p className="text-sm text-gray-400 mb-8">草稿功能可以帮助您随时保存写作进度</p>
            <Link
              to="/write"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition"
            >
              <BookOpen className="h-5 w-5" />
              开始创作第一篇小说
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyDrafts;