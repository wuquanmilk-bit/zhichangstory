import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';  // 移除了 useNavigate
import { supabase } from '../../supabaseClient';
import { 
  MessageSquare, Heart, Eye, Calendar, Plus, Loader2, TrendingUp, 
  ChevronLeft, ChevronRight, Zap, Flame, Clock, Filter, Search, Crown, Award
} from 'lucide-react';
import { AVATAR_OPTIONS } from '../../constants/avatars';

// 骨架屏组件
const QuestionCardSkeleton = memo(() => (
  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-lg animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-stone-200 to-stone-300" />
      <div className="space-y-2">
        <div className="w-32 h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
        <div className="w-24 h-3 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
      </div>
    </div>
    <div className="space-y-3 mb-6">
      <div className="h-6 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full w-4/5" />
      <div className="h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full w-3/4" />
    </div>
    <div className="flex items-center gap-6">
      <div className="w-12 h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
      <div className="w-12 h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
      <div className="w-12 h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
      <div className="ml-auto w-20 h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
    </div>
  </div>
));

QuestionCardSkeleton.displayName = 'QuestionCardSkeleton';

// 问题卡片组件
const QuestionCard = memo(({ question, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const profile = question.profiles;
  const avatarUrl = useMemo(() => 
    AVATAR_OPTIONS.find(a => a.id === profile?.avatar_id)?.url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${question.user_id}&size=64`,
    [profile?.avatar_id, question.user_id]
  );

  const stats = useMemo(() => {
    try {
      return typeof question.stats === 'string' 
        ? JSON.parse(question.stats) 
        : (question.stats || { likes: 0, views: 0, comments: 0 });
    } catch (e) {
      return { likes: 0, views: 0, comments: 0 };
    }
  }, [question.stats]);

  // 获取标签颜色
  const getTagColor = (tag) => {
    const colors = {
      'React': 'bg-gradient-to-r from-cyan-500 to-blue-600',
      'JavaScript': 'bg-gradient-to-r from-yellow-500 to-amber-600',
      'TypeScript': 'bg-gradient-to-r from-blue-500 to-indigo-600',
      '前端': 'bg-gradient-to-r from-emerald-500 to-teal-600',
      '后端': 'bg-gradient-to-r from-red-500 to-rose-600',
      '职场': 'bg-gradient-to-r from-purple-500 to-fuchsia-600',
      '面试': 'bg-gradient-to-r from-orange-500 to-amber-600',
      '默认': 'bg-gradient-to-r from-stone-500 to-stone-700'
    };
    return colors[tag] || colors['默认'];
  };

  return (
    <div 
      className="relative group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* 装饰性背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/20 to-orange-50/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link 
        to={`/question/${question.id}`} 
        className="relative block bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
      >
        {/* 作者信息 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
            {!imageLoaded && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
            )}
            <img 
              src={avatarUrl} 
              className={`relative w-10 h-10 rounded-full border-2 border-white shadow-sm ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
              alt={profile?.username || "作者"}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-stone-900 text-sm bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
                {profile?.username || "佚名侠客"}
              </span>
              {profile?.is_contract_author && (
                <span className="px-2 py-0.5 text-[10px] bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-bold shadow-sm">
                  签约
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Award size={10} className="text-amber-500" />
              <span className="text-[10px] font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                修为 {profile?.exp || 0}
              </span>
            </div>
          </div>
        </div>

        {/* 问题标题 */}
        <h2 className="text-xl font-black mb-3 group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-orange-700 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {question.title}
        </h2>

        {/* 问题内容预览 */}
        <p className="text-gray-500 line-clamp-2 text-sm mb-6 leading-relaxed">
          {question.content}
        </p>

        {/* 标签 */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.slice(0, 3).map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getTagColor(tag)} shadow-sm`}
              >
                #{tag}
              </span>
            ))}
            {question.tags.length > 3 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold text-stone-500 bg-stone-100">
                +{question.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 统计数据 */}
        <div className="flex items-center gap-6 text-xs font-bold text-stone-500">
          <div className="flex items-center gap-1.5 group/stat">
            <div className="p-1.5 rounded-lg bg-blue-50 group-hover/stat:bg-blue-100 transition-colors">
              <Eye size={14} className="text-blue-500 group-hover/stat:scale-110 transition-transform" />
            </div>
            <span>{stats.views || 0}</span>
          </div>
          
          <div className="flex items-center gap-1.5 group/stat">
            <div className="p-1.5 rounded-lg bg-rose-50 group-hover/stat:bg-rose-100 transition-colors">
              <Heart size={14} className="text-rose-500 fill-current group-hover/stat:scale-110 transition-transform" />
            </div>
            <span className="text-rose-600">{stats.likes || 0}</span>
          </div>
          
          {stats.comments > 0 && (
            <div className="flex items-center gap-1.5 group/stat">
              <div className="p-1.5 rounded-lg bg-emerald-50 group-hover/stat:bg-emerald-100 transition-colors">
                <MessageSquare size={14} className="text-emerald-500 group-hover/stat:scale-110 transition-transform" />
              </div>
              <span>{stats.comments}</span>
            </div>
          )}
          
          <div className="ml-auto flex items-center gap-1.5 group/stat opacity-60">
            <Calendar size={14} />
            <span>{new Date(question.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </Link>
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';

// 分页组件
const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-full transition-all duration-200 ${
            currentPage === i
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
              : 'bg-white/80 text-stone-600 hover:bg-white hover:shadow'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  }, [currentPage, totalPages, onPageChange]);

  return (
    <div className="flex justify-center items-center gap-3 mt-12">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1}
        className="p-2 rounded-full border border-white/40 bg-white/80 hover:bg-white hover:shadow disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft size={20} className="text-stone-600" />
      </button>
      
      {renderPageNumbers}
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border border-white/40 bg-white/80 hover:bg-white hover:shadow disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronRight size={20} className="text-stone-600" />
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'hot' | 'recent'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const pageSize = 10;
  const abortControllerRef = useRef(null);

  // 获取问题数据
  const fetchQuestions = useCallback(async () => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      setLoading(true);
      
      // 构建查询
      let query = supabase
        .from('questions')
        .select('*, profiles(*)', { count: 'exact' });
      
      // 搜索查询
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }
      
      // 标签筛选
      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }
      
      // 排序
      if (filter === 'hot') {
        query = query.order('stats->likes', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // 分页
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (controller.signal.aborted) return;
      if (error) throw error;
      
      setQuestions(data || []);
      setTotalCount(count || 0);
      
      // 提取所有标签
      if (data && data.length > 0) {
        const allTags = new Set<string>();
        data.forEach(q => {
          if (q.tags && Array.isArray(q.tags)) {
            q.tags.forEach(tag => allTags.add(tag));
          }
        });
        setTags(Array.from(allTags));
      }
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('请求被取消');
        return;
      }
      console.error('获取谷子问题失败:', err.message);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [filter, currentPage, searchQuery, selectedTag]);

  // 获取问题数据
  useEffect(() => {
    fetchQuestions();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchQuestions]);

  // 处理搜索
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // 处理标签选择
  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1);
  }, [selectedTag]);

  // 处理分页变化
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/20 to-amber-50/10">
        {/* 背景装饰 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-12 font-['PingFang_SC']">
          {/* 头部骨架屏 */}
          <div className="flex justify-between items-center mb-10">
            <div className="h-10 w-48 bg-gradient-to-r from-stone-200 to-stone-300 rounded-xl animate-pulse" />
            <div className="h-12 w-32 bg-gradient-to-r from-stone-200 to-stone-300 rounded-xl animate-pulse" />
          </div>
          
          {/* 搜索框骨架屏 */}
          <div className="mb-8">
            <div className="h-12 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full animate-pulse" />
          </div>
          
          {/* 过滤器和标签骨架屏 */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-20 h-10 bg-gradient-to-r from-stone-200 to-stone-300 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="h-6 w-24 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full animate-pulse" />
          </div>
          
          {/* 标签骨架屏 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-16 h-8 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full animate-pulse" />
            ))}
          </div>
          
          {/* 问题列表骨架屏 */}
          <div className="grid gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <QuestionCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/20 to-amber-50/10">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 font-['PingFang_SC']">
        {/* 头部区域 */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent">
                谷子问答
              </h1>
              <p className="text-sm text-stone-500">武林高手的智慧碰撞</p>
            </div>
          </div>
          
          {/* 修改为 Link 组件 */}
          <Link
            to="/ask-question"
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Zap size={18} className="group-hover:rotate-12 transition-transform" />
            我要提问
          </Link>
        </div>

        {/* 搜索框 */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="搜索问题、标签或内容..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* 过滤器和排序 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-white/40">
            {[
              { key: 'all', label: '全部', icon: <Filter size={14} /> },
              { key: 'hot', label: '最热', icon: <Flame size={14} /> },
              { key: 'recent', label: '最新', icon: <Clock size={14} /> }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                  filter === item.key
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-stone-500">
            共 <span className="font-bold text-red-600">{totalCount}</span> 个问题
          </div>
        </div>

        {/* 热门标签 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <div className="flex items-center gap-2 text-sm text-stone-500 font-medium">
              <Filter size={16} />
              热门标签：
            </div>
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white/80 text-stone-600 hover:bg-white hover:shadow'
                }`}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag('')}
                className="px-3 py-1.5 text-sm text-stone-500 hover:text-red-600 transition-colors"
              >
                清除筛选
              </button>
            )}
          </div>
        )}

        {/* 问题列表 */}
        <div className="grid gap-6">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 shadow-sm">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 mb-4">
                <Search size={32} className="text-stone-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-700 mb-2">暂无问题</h3>
              <p className="text-stone-500 mb-6">暂时没有找到相关问题，去提问第一个问题吧！</p>
              {/* 修改为 Link 组件 */}
              <Link
                to="/ask-question"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Zap size={18} />
                我要提问
              </Link>
            </div>
          )}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* 底部CTA */}
        {questions.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-red-50 to-orange-50 px-8 py-6 rounded-3xl border border-red-100">
              <h3 className="text-lg font-bold text-stone-900 mb-2">有问题要问？</h3>
              <p className="text-stone-600 mb-4">快来分享你的疑问，让社区的高手们为你解答！</p>
              {/* 修改为 Link 组件 */}
              <Link
                to="/ask-question"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Zap size={18} />
                立即提问
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 添加淡入动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .question-card {
    animation: fadeInUp 0.4s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default memo(QuestionsPage);