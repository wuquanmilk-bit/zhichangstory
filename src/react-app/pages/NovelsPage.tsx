import React, { useState, useEffect, useCallback, useRef, memo, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from "../../contexts/AuthContext";
import { AVATAR_OPTIONS } from '../../constants/avatars'; 
import { 
  Heart, Sword, ChevronLeft, ChevronRight, 
  User, Award, Zap, BookOpen, Flame, Loader2
} from 'lucide-react';

const SYSTEM_TAG_CONFIG: Record<string, { label: string, theme: string }> = {
  'contracted': { label: '签约作家', theme: 'bg-red-700 text-white shadow-sm' },
  'expert': { label: '提问达人', theme: 'bg-emerald-600 text-white shadow-sm' },
  'editor': { label: '官方编辑', theme: 'bg-indigo-700 text-white shadow-sm' },
};

type SortOption = 'created_at' | 'likes' | 'exp';

// 获取缓存
const getCache = (sortBy: string, page: number): { data: any[], count: number } | null => {
  try {
    const cache = localStorage.getItem('novels_cache');
    if (!cache) return null;
    
    const parsed = JSON.parse(cache);
    const now = Date.now();
    
    // 5分钟缓存
    if (now - parsed.timestamp > 5 * 60 * 1000 || 
        parsed.sortBy !== sortBy || 
        parsed.page !== page) {
      return null;
    }
    
    return { data: parsed.data, count: parsed.count };
  } catch (err) {
    return null;
  }
};

// 设置缓存
const setCache = (sortBy: string, page: number, data: any[], count: number) => {
  try {
    localStorage.setItem('novels_cache', JSON.stringify({
      timestamp: Date.now(),
      data,
      count,
      sortBy,
      page
    }));
  } catch (err) {
    console.error('缓存设置失败:', err);
  }
};

// 骨架屏组件
const SkeletonCard = memo(() => (
  <div className="bg-white border border-stone-200 p-4 flex gap-5 rounded-sm animate-pulse">
    <div className="w-28 h-40 flex-shrink-0 bg-stone-200" />
    <div className="flex-1 flex flex-col justify-between overflow-hidden py-1">
      <div>
        <div className="h-6 bg-stone-200 rounded mb-3 w-3/4" />
        <div className="flex gap-2 my-2">
          <div className="w-16 h-4 bg-stone-200 rounded" />
          <div className="w-20 h-4 bg-stone-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-stone-200 rounded" />
          <div className="h-3 bg-stone-200 rounded w-5/6" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-stone-200" />
          <div className="space-y-1">
            <div className="w-16 h-3 bg-stone-200 rounded" />
            <div className="w-12 h-2 bg-stone-200 rounded" />
          </div>
        </div>
        <div className="w-8 h-4 bg-stone-200 rounded" />
      </div>
    </div>
  </div>
));
SkeletonCard.displayName = 'SkeletonCard';

// 排序按钮组件
const SortButtons = memo(({ 
  sortBy, 
  setSortBy, 
  setCurrentPage 
}: { 
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  setCurrentPage: (page: number) => void;
}) => {
  const sortOptions = [
    { id: 'created_at' as SortOption, label: '新书快讯', icon: <Zap size={14} /> },
    { id: 'likes' as SortOption, label: '江湖人气', icon: <Flame size={14} /> },
    { id: 'exp' as SortOption, label: '宗师修为', icon: <Award size={14} /> },
  ];

  return (
    <div className="flex gap-8 items-center text-sm">
      {sortOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => {
            setSortBy(option.id);
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 font-black transition-colors duration-200 ${
            sortBy === option.id 
              ? 'text-red-700 scale-105' 
              : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          {option.icon}
          {option.label}
          {sortBy === option.id && (
            <div className="w-1.5 h-1.5 bg-red-700 rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
});
SortButtons.displayName = 'SortButtons';

// 分页组件
const Pagination = memo(({ 
  currentPage, 
  totalPages, 
  setCurrentPage 
}: { 
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) => {
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
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 rounded-lg border transition-all duration-200 ${
            currentPage === i
              ? 'bg-red-700 text-white border-red-800 shadow-lg scale-105'
              : 'bg-white border-stone-200 hover:border-red-600 hover:shadow'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  }, [currentPage, totalPages, setCurrentPage]);

  return (
    <div className="flex justify-center items-center gap-2 mt-12 font-black">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="w-10 h-10 border border-stone-200 rounded-lg hover:border-red-600 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
      >
        <ChevronLeft size={20} />
      </button>
      
      {renderPageNumbers}
      
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="w-10 h-10 border border-stone-200 rounded-lg hover:border-red-600 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
});
Pagination.displayName = 'Pagination';

// 小说卡片组件
const NovelCard = memo(({ 
  novel, 
  onClick 
}: { 
  novel: any; 
  onClick: (id: string) => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const profile = novel.real_profile;
  const stats = novel.stats || {};
  const userAvatar = AVATAR_OPTIONS.find(a => a.id === profile?.avatar_id)?.url;
  const roleTags = useMemo(() => 
    profile?.role_tag ? profile.role_tag.split(',').filter(Boolean) : [], 
    [profile?.role_tag]
  );

  return (
    <div 
      onClick={() => onClick(novel.id)}
      className="group relative bg-white border border-stone-200 p-4 flex gap-5 hover:shadow-lg hover:border-red-600 rounded-sm cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      {/* 封面图片 - 懒加载优化 */}
      <div className="w-28 h-40 flex-shrink-0 relative">
        <div className="absolute inset-0 bg-black/10 translate-x-1 translate-y-1" />
        <div className="relative w-full h-full bg-stone-100 overflow-hidden shadow-sm border-l-4 border-stone-900">
          {novel.cover ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-stone-200 animate-pulse" />
              )}
              <img 
                src={novel.cover} 
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                alt={novel.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-200">
              <BookOpen size={40} />
            </div>
          )}
        </div>
      </div>
      
      {/* 小说信息 */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden py-1">
        <div>
          <h3 className="text-xl font-bold text-stone-900 truncate group-hover:text-red-700 transition-colors">
            {novel.title}
          </h3>
          <div className="flex items-center gap-2 my-2 flex-wrap">
            {roleTags.map(t => {
              const conf = SYSTEM_TAG_CONFIG[t.trim()];
              return conf && (
                <span 
                  key={t} 
                  className={`text-[9px] px-1.5 py-0.5 rounded-sm font-black ${conf.theme}`}
                >
                  {conf.label}
                </span>
              );
            })}
            <span className="text-[11px] text-red-800 font-bold px-2 bg-red-50 rounded">
              {novel.category || '武侠'}
            </span>
          </div>
          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed overflow-hidden font-serif italic mb-3 min-h-[2.5rem]">
            {profile?.bio || "这位大侠很懒，没有写下任何签名..."}
          </p>
        </div>
        
        {/* 作者信息 */}
        <div className="flex items-center justify-between border-t border-stone-50 pt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  className="w-full h-full object-cover"
                  alt={profile?.username || "作者"}
                  loading="lazy"
                />
              ) : (
                <User size={14} className="m-auto text-stone-300" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-stone-800 truncate max-w-[70px]">
                {profile?.username || "名不经传"}
              </span>
              <span className="text-[9px] font-bold text-orange-600">
                修为 {profile?.exp || 0}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-rose-500">
            <Heart size={14} className="fill-current" />
            <span className="text-xs font-black">{stats.likes || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
NovelCard.displayName = 'NovelCard';

// 主组件
function NovelsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('created_at');
  const [preloadedData, setPreloadedData] = useState<{ [key: number]: any[] }>({});
  
  const pageSize = 12;
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollPositionRef = useRef(0);
  const totalPages = Math.ceil(totalCount / pageSize);

  // 预加载下一页
  const preloadNextPage = useCallback(async (nextPage: number) => {
    if (preloadedData[nextPage] || nextPage > totalPages) return;
    
    try {
      const from = (nextPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error } = await supabase
        .from('novels')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (!error && data) {
        setPreloadedData(prev => ({
          ...prev,
          [nextPage]: data
        }));
      }
    } catch (err) {
      console.error('预加载失败:', err);
    }
  }, [preloadedData, totalPages, pageSize]);

  // 获取小说数据
  const fetchNovels = useCallback(async () => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setLoading(true);
    scrollPositionRef.current = window.scrollY;
    
    try {
      // 检查缓存
      const cache = getCache(sortBy, currentPage);
      if (cache && !isInitialLoad) {
        setNovels(cache.data);
        setTotalCount(cache.count);
        setLoading(false);
        setIsInitialLoad(false);
        
        // 滚动到之前的位置
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
        return;
      }
      
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      // 获取小说基本信息
      let query = supabase
        .from('novels')
        .select('*', { count: 'exact' })
        .eq('is_public', true)
        .range(from, to);

      if (sortBy === 'created_at') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'likes') {
        query = query.order('stats->likes', { ascending: false })
                     .order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: novelsData, error: novelError, count } = await query;
      
      if (controller.signal.aborted) return;
      
      if (novelError) throw novelError;

      if (novelsData && novelsData.length > 0) {
        const userIds = novelsData.map(n => n.user_id).filter(Boolean);
        
        // 批量获取用户信息
        const { data: profilesData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, avatar_id, role_tag, exp, bio')
          .in('id', userIds);

        if (profileError) console.error("Profile加载失败", profileError);

        let combinedData = novelsData.map(novel => ({
          ...novel,
          real_profile: profilesData?.find(p => p.id === novel.user_id) || null
        }));

        // 客户端排序
        if (sortBy === 'exp') {
          combinedData = combinedData.sort((a, b) => 
            (b.real_profile?.exp || 0) - (a.real_profile?.exp || 0)
          );
        }

        setNovels(combinedData);
        setTotalCount(count || 0);
        
        // 设置缓存
        if (combinedData.length > 0) {
          setCache(sortBy, currentPage, combinedData, count || 0);
        }
      } else {
        setNovels([]);
        setTotalCount(0);
      }
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('请求被取消');
        return;
      }
      console.error('谷子小说加载失败:', err);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  }, [currentPage, sortBy, pageSize, isInitialLoad]);

  // 监听页码和排序变化
  useEffect(() => {
    fetchNovels();
    
    // 预加载下一页
    if (currentPage < totalPages) {
      preloadNextPage(currentPage + 1);
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage, sortBy, fetchNovels, preloadNextPage, totalPages]);

  // 处理小说点击
  const handleNovelClick = useCallback((novelId: string) => {
    if (!user) {
      navigate('/login', { state: { from: `/novel/${novelId}` } });
    } else {
      navigate(`/novel/${novelId}`);
    }
  }, [user, navigate]);

  // 处理分页变化
  const handlePageChange = useCallback((page: number) => {
    // 检查是否有预加载数据
    if (preloadedData[page]) {
      setNovels(preloadedData[page]);
      setCurrentPage(page);
      
      // 触发完整数据获取
      setTimeout(() => fetchNovels(), 100);
    } else {
      setCurrentPage(page);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [preloadedData, fetchNovels]);

  // 初始加载动画
  if (isInitialLoad && loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] flex flex-col items-center justify-center font-serif">
        <Sword className="text-red-700 mb-4 animate-bounce" size={48} />
        <span className="text-stone-400 tracking-[0.3em] font-bold animate-pulse">
          正在翻开谷子江湖藏经阁...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-24 font-sans">
      {/* Hero 头部 */}
      <div className="bg-[#1a1a1a] pt-16 pb-20 px-6 relative overflow-hidden text-center border-b-4 border-red-800">
        <h1 className="relative z-10 text-5xl sm:text-6xl font-black font-serif text-white tracking-[0.5em] italic">
          谷子江湖
        </h1>
        <p className="relative z-10 mt-4 text-red-600 font-bold tracking-[0.2em] uppercase text-sm">
          笔墨乾坤 · 刀光剑影
        </p>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {/* 排序和统计 */}
        <div className="mb-8 flex items-center justify-between bg-white border border-stone-200 px-6 py-4 shadow-sm rounded-sm">
          <SortButtons 
            sortBy={sortBy} 
            setSortBy={setSortBy} 
            setCurrentPage={setCurrentPage}
          />
          <div className="hidden sm:block text-stone-400 text-xs font-serif italic">
            共觅得 {totalCount} 部绝世秘籍
          </div>
        </div>

        {/* 小说列表 */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
          loading ? 'opacity-50' : 'opacity-100'
        }`}>
          {loading && isInitialLoad ? (
            // 骨架屏
            Array.from({ length: pageSize }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : novels.length > 0 ? (
            novels.map((novel) => (
              <NovelCard
                key={novel.id}
                novel={novel}
                onClick={handleNovelClick}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <BookOpen className="mx-auto text-stone-300 mb-4" size={48} />
              <p className="text-stone-500">暂无小说，快去创作吧！</p>
            </div>
          )}
        </div>

        {/* 分页 */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={handlePageChange}
        />

        {/* 加载指示器 */}
        {loading && !isInitialLoad && (
          <div className="flex justify-center items-center mt-8">
            <Loader2 className="h-8 w-8 animate-spin text-red-700" />
            <span className="ml-3 text-stone-500">加载中...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 使用 React.memo 优化
export default memo(NovelsPage);