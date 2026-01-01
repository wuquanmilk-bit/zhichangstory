import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, BookOpen, MessageSquare, Loader2, Hash, Eye, ThumbsUp, Calendar, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    novels: any[];
    questions: any[];
  }>({ novels: [], questions: [] });
  const [activeTab, setActiveTab] = useState<'all' | 'novels' | 'questions'>('all');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults({ novels: [], questions: [] });
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const searchLower = searchTerm.toLowerCase();
      
      // 搜索小说
      const { data: novelsData } = await supabase
        .from('novels')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      const filteredNovels = (novelsData || []).filter(novel => 
        (novel.title?.toLowerCase().includes(searchLower) ||
         novel.description?.toLowerCase().includes(searchLower) ||
         novel.content?.toLowerCase().includes(searchLower) ||
         (novel.tags && Array.isArray(novel.tags) && 
          novel.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
        ) && novel.is_public === true
      );

      // 搜索问题
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      const filteredQuestions = (questionsData || []).filter(question =>
        question.title?.toLowerCase().includes(searchLower) ||
        question.content?.toLowerCase().includes(searchLower) ||
        (question.tags && Array.isArray(question.tags) &&
         question.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
      );

      setResults({
        novels: filteredNovels,
        questions: filteredQuestions
      });
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults({ novels: [], questions: [] });
    setHasSearched(false);
  };

  const getFilteredResults = () => {
    if (activeTab === 'novels') {
      return { novels: results.novels, questions: [] };
    } else if (activeTab === 'questions') {
      return { novels: [], questions: results.questions };
    }
    return results;
  };

  const filteredResults = getFilteredResults();
  const totalResults = results.novels.length + results.questions.length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* 搜索框 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">搜索</h1>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="搜索小说、问题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-md transition"
          >
            搜索
          </button>
        </form>

        {/* 搜索状态 */}
        {hasSearched && query && (
          <div className="mb-6">
            <p className="text-gray-600">
              搜索 "<span className="font-semibold text-gray-900">{query}</span>" 的结果
            </p>
            <p className="text-sm text-gray-500 mt-1">
              找到 {totalResults} 个结果
            </p>
          </div>
        )}
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">搜索中...</p>
        </div>
      )}

      {/* 搜索结果 */}
      {hasSearched && !loading && (
        <>
          {/* 标签页 */}
          {totalResults > 0 && (
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
              {['all', 'novels', 'questions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === tab 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'all' ? `全部 (${totalResults})` : 
                   tab === 'novels' ? `小说 (${results.novels.length})` : 
                   `问答 (${results.questions.length})`}
                </button>
              ))}
            </div>
          )}

          {/* 无结果 */}
          {totalResults === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到相关内容</h3>
              <p className="text-gray-600 mb-6">尝试使用其他关键词搜索</p>
            </div>
          )}

          {/* 小说结果 */}
          {activeTab !== 'questions' && filteredResults.novels.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                小说 ({filteredResults.novels.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.novels.map((novel) => (
                  <div key={novel.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition">
                    <div className="h-40 bg-gradient-to-r from-blue-100 to-purple-100 relative">
                      {novel.cover ? (
                        <img
                          src={novel.cover}
                          alt={novel.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        <Link to={`/novel/${novel.id}`} className="hover:text-blue-600">
                          {novel.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {novel.description || '暂无简介'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {novel.reads || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {novel.likes || 0}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {novel.created_at ? new Date(novel.created_at).toLocaleDateString('zh-CN') : '未知'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 问题结果 */}
          {activeTab !== 'novels' && filteredResults.questions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                问答 ({filteredResults.questions.length})
              </h2>
              <div className="space-y-4">
                {filteredResults.questions.map((question) => (
                  <div key={question.id} className="bg-white rounded-xl border p-6 hover:shadow-sm transition">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <Link to={`/question/${question.id}`} className="hover:text-blue-600">
                        {question.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {question.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {question.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {question.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {question.answers_count || 0} 个回答
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {question.created_at ? new Date(question.created_at).toLocaleDateString('zh-CN') : '未知'}
                      </span>
                    </div>
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {question.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                          >
                            <Hash className="inline h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 热门搜索建议 */}
      {!hasSearched && (
        <div className="bg-white rounded-xl border p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">热门搜索</h3>
          <div className="flex flex-wrap gap-3">
            {['职场', 'React', '面试', 'TypeScript', '前端', '程序员', '工作', '技术', '成长'].map((tag) => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}