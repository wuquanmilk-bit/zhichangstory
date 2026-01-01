import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, ThumbsUp, Eye, Calendar, Search, Plus, Loader2, CheckCircle, ExternalLink, Edit, Trash2, AlertCircle } from 'lucide-react';

export default function MyQuestionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalStats, setTotalStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    unansweredQuestions: 0,
    totalViews: 0,
    totalLikes: 0,
    totalAnswers: 0
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 获取当前用户的所有问题
  useEffect(() => {
    if (user) {
      fetchMyQuestions();
    } else {
      setLoading(false);
    }
  }, [user, filter]);

  const fetchMyQuestions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('开始获取问题，用户ID:', user.id);

      // 先获取所有问题
      const { data: allQuestionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (questionsError) {
        console.error('获取问题失败:', questionsError);
        throw questionsError;
      }

      console.log('获取到的所有问题数据:', allQuestionsData);

      // 手动过滤当前用户的问题
      const userQuestions = (allQuestionsData || []).filter(question => {
        if (!question.author) {
          console.log('问题没有author字段:', question.id, question.title);
          return false;
        }

        // 处理不同的author格式
        let authorId = '';
        
        if (typeof question.author === 'object' && question.author !== null) {
          authorId = question.author.id;
        } else if (typeof question.author === 'string') {
          try {
            const parsedAuthor = JSON.parse(question.author);
            authorId = parsedAuthor.id;
          } catch (e) {
            console.error('解析author字符串失败:', e, question.author);
            return false;
          }
        }
        
        return authorId === user.id;
      });

      console.log('过滤后的用户问题:', userQuestions);

      // 计算统计信息
      const stats = {
        totalQuestions: userQuestions.length,
        answeredQuestions: userQuestions.filter(q => q.answers_count > 0 || q.is_answered).length,
        unansweredQuestions: userQuestions.filter(q => !q.answers_count && !q.is_answered).length,
        totalViews: userQuestions.reduce((sum, q) => sum + (q.views || 0), 0),
        totalLikes: userQuestions.reduce((sum, q) => sum + (q.likes || 0), 0),
        totalAnswers: userQuestions.reduce((sum, q) => sum + (q.answers_count || 0), 0)
      };

      setTotalStats(stats);
      setQuestions(userQuestions);
    } catch (err: any) {
      console.error('获取问题失败:', err);
      setError('获取问题列表失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('确定要删除这个问题吗？删除后无法恢复。')) {
      return;
    }

    try {
      setDeletingId(questionId);
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      // 重新获取问题列表
      await fetchMyQuestions();
      alert('删除成功');
    } catch (err: any) {
      console.error('删除问题失败:', err);
      alert('删除失败，请重试');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredQuestions = questions.filter(question => {
    if (filter !== 'all') {
      if (filter === 'answered' && !question.answers_count && !question.is_answered) return false;
      if (filter === 'unanswered' && (question.answers_count > 0 || question.is_answered)) return false;
    }
    if (searchQuery && !question.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">加载问题列表中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我的提问</h1>
        <p className="text-gray-600 mb-6">管理您提出的所有问题</p>
        
        {/* 搜索和过滤 */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索我的提问..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {['all', 'answered', 'unanswered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === status 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status === 'all' ? '全部' : 
                   status === 'answered' ? '已解答' : '未解答'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchMyQuestions}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
            >
              刷新
            </button>
            <Link
              to="/ask-question"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition"
            >
              <Plus className="h-4 w-4" />
              提问
            </Link>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border">
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalStats.totalQuestions}</div>
          <div className="text-sm text-gray-600">问题总数</div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalStats.answeredQuestions}</div>
          <div className="text-sm text-gray-600">已解答</div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalStats.unansweredQuestions}</div>
          <div className="text-sm text-gray-600">未解答</div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalStats.totalViews.toLocaleString()}</div>
          <div className="text-sm text-gray-600">总浏览量</div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalStats.totalLikes}</div>
          <div className="text-sm text-gray-600">总获赞数</div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalStats.totalAnswers}</div>
          <div className="text-sm text-gray-600">总回答数</div>
        </div>
      </div>

      {/* 问题列表 */}
      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl border p-6 hover:shadow-sm transition">
              <div className="flex items-start justify-between">
                {/* 左边：问题信息 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {(question.answers_count > 0 || question.is_answered) ? (
                      <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        已解答
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                        未解答
                      </span>
                    )}
                    
                    <span className="text-sm text-gray-500">
                      {question.created_at ? new Date(question.created_at).toLocaleDateString('zh-CN') : '未知日期'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {question.title || '无标题问题'}
                  </h3>
                  
                  {question.content && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {question.content}
                    </p>
                  )}
                  
                  {/* 统计信息 */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {question.views || 0} 浏览
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {question.likes || 0} 点赞
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {question.answers_count || 0} 回答
                    </span>
                    {question.words && (
                      <span className="flex items-center gap-1">
                        {question.words} 字
                      </span>
                    )}
                  </div>
                  
                  {/* 标签 */}
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {question.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 右边：操作按钮 */}
                <div className="ml-4 flex flex-col gap-2 min-w-[120px]">
                  <Link
                    to={`/question/${question.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    查看
                  </Link>
                  
                  <Link
                    to={`/ask-question?edit=${question.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    <Edit className="h-3 w-3" />
                    编辑
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    disabled={deletingId === question.id}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm disabled:opacity-50"
                  >
                    {deletingId === question.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无提问</h3>
          <p className="text-gray-600 mb-6">您还没有提出任何问题</p>
          <Link
            to="/ask-question"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            开始提问
          </Link>
        </div>
      )}

      {/* 调试信息（开发时可移除） */}
      {questions.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">调试信息：</span>
          </div>
          <p>共找到 {questions.length} 个问题，当前过滤显示 {filteredQuestions.length} 个</p>
          <p>用户ID: {user?.id}</p>
        </div>
      )}
    </div>
  );
}