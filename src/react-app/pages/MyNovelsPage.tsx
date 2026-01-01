import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { BookOpen, Grid, List, Eye, ThumbsUp, Calendar, Loader2, Plus } from 'lucide-react';

export default function NovelsPage() {
  const [novels, setNovels] = useState<any[]>([]);
  const [filteredNovels, setFilteredNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'popular' | 'recent'>('all');

  // 获取所有小说
  useEffect(() => {
    fetchNovels();
  }, []);

  const fetchNovels = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('novels')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 过滤掉未来日期的测试数据
      const currentYear = new Date().getFullYear();
      const realNovels = (data || []).filter(novel => {
        if (!novel.created_at) return true;
        
        try {
          const novelDate = new Date(novel.created_at);
          // 过滤掉未来日期的数据
          if (novelDate.getFullYear() > currentYear) {
            return false;
          }
          return true;
        } catch (e) {
          return true;
        }
      });

      setNovels(realNovels);
      setFilteredNovels(realNovels);
    } catch (err: any) {
      console.error('获取小说失败:', err);
      setError('获取小说列表失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理过滤
  useEffect(() => {
    let result = novels;

    // 排序过滤
    if (filter === 'recent') {
      result = [...result].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (filter === 'popular') {
      result = [...result].sort((a, b) =>
        (b.reads || 0) - (a.reads || 0) || (b.likes || 0) - (a.likes || 0)
      );
    }

    setFilteredNovels(result);
  }, [novels, filter]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">加载小说列表中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 头部 - 包含写小说按钮 */}
      <div className="flex justify-between items-start mb-8">
        <div className="border-l-4 border-purple-600 pl-4">
          <h1 className="text-3xl font-bold text-gray-900">职场story</h1>
          <p className="text-gray-600 mt-2">精彩故事，职场人生，从这里开始</p>
        </div>
        
        <Link
          to="/write/novel"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition"
        >
          <Plus className="h-4 w-4" />
          写小说
        </Link>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* 过滤选项 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="h-4 w-4" />
          共 {filteredNovels.length} 篇小说
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {['all', 'popular', 'recent'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type === 'all' ? '全部' :
                 type === 'popular' ? '热门' : '最新'}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {['grid', 'list'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as 'grid' | 'list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === mode
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-gray-200'
                }`}
              >
                {mode === 'grid' ? (
                  <Grid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 小说列表 */}
      {filteredNovels.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredNovels.map((novel) => (
            <div 
              key={novel.id} 
              className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition ${
                viewMode === 'list' ? 'flex items-center' : ''
              }`}
            >
              {/* 封面 */}
              <div className={`
                ${viewMode === 'grid' ? 'h-40' : 'h-24 w-20 flex-shrink-0'}
                bg-gradient-to-r from-blue-50 to-purple-50 relative overflow-hidden
              `}>
                {novel.cover ? (
                  <img
                    src={novel.cover}
                    alt={novel.title || '小说封面'}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* 内容 */}
              <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-4`}>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 text-base">
                  <Link to={`/novel/${novel.id}`} className="hover:text-blue-600">
                    {novel.title || '未命名小说'}
                  </Link>
                </h3>
                
                {/* 描述 - 只在列表模式显示 */}
                {viewMode === 'list' && novel.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                    {novel.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {novel.reads || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {novel.likes || 0}
                    </span>
                  </div>
                  {viewMode === 'grid' && novel.created_at && (
                    <span className="text-xs text-gray-500">
                      {new Date(novel.created_at).toLocaleDateString('zh-CN')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无小说</h3>
          <p className="text-gray-600 mb-6">还没有人创作小说，成为第一个创作者</p>
          <Link
            to="/write/novel"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            开始创作
          </Link>
        </div>
      )}

      {/* 统计信息 */}
      {novels.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">小说库统计</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{novels.length}</div>
              <div className="text-sm text-gray-600">小说总数</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {novels.reduce((sum, n) => sum + (n.reads || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">总阅读量</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {novels.reduce((sum, n) => sum + (n.likes || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">总获赞数</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {novels.reduce((sum, n) => sum + (n.chapters || 1), 0)}
              </div>
              <div className="text-sm text-gray-600">总章节数</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}