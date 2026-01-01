import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Eye, Loader2, Flame, TrendingUp, 
  ChevronRight, Sword, BookOpen, MessageSquare, 
  Crown, Zap, Award, Book, User, Star
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { AVATAR_OPTIONS } from '../../constants/avatars';

// 骨架屏组件
const QuestionCardSkeleton = memo(() => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
      <div className="space-y-2">
        <div className="w-24 h-3 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
        <div className="w-20 h-2 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-5 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full w-4/5" />
      <div className="h-5 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full w-3/4" />
    </div>
    <div className="flex items-center gap-4">
      <div className="w-12 h-3 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
      <div className="w-12 h-3 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full" />
    </div>
  </div>
));

QuestionCardSkeleton.displayName = 'QuestionCardSkeleton';

// 小说卡片骨架屏
const NovelCardSkeleton = memo(() => (
  <div className="bg-white/80 backdrop-blur-sm p-4 flex gap-4 rounded-xl border border-white/20 shadow-lg animate-pulse">
    <div className="w-20 h-28 flex-shrink-0 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg" />
    <div className="flex-1 space-y-2 py-1">
      <div className="h-6 bg-gradient-to-r from-stone-200 to-stone-300 rounded w-3/4" />
      <div className="space-y-1">
        <div className="h-3 bg-gradient-to-r from-stone-200 to-stone-300 rounded" />
        <div className="h-3 bg-gradient-to-r from-stone-200 to-stone-300 rounded w-5/6" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
        <div className="space-y-1">
          <div className="w-20 h-3 bg-gradient-to-r from-stone-200 to-stone-300 rounded" />
          <div className="w-16 h-2 bg-gradient-to-r from-stone-200 to-stone-300 rounded" />
        </div>
      </div>
    </div>
  </div>
));

NovelCardSkeleton.displayName = 'NovelCardSkeleton';

// 排行榜骨架屏
const RankItemSkeleton = memo(() => (
  <div className="flex items-center gap-4 animate-pulse p-3">
    <div className="w-12 h-12 bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl" />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full w-3/4" />
      <div className="h-3 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full w-1/2" />
    </div>
  </div>
));

RankItemSkeleton.displayName = 'RankItemSkeleton';

// 问题卡片组件
const QuestionCard = memo(({ question, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  // 图片懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // 获取标签颜色
  const getTagColor = (tag) => {
    const colors = {
      'React': 'from-cyan-500 to-blue-600',
      'JavaScript': 'from-yellow-500 to-amber-600',
      'TypeScript': 'from-blue-500 to-indigo-600',
      '前端': 'from-emerald-500 to-teal-600',
      '后端': 'from-red-500 to-rose-600',
      '职场': 'from-purple-500 to-fuchsia-600',
      '面试': 'from-orange-500 to-amber-600',
      '默认': 'from-stone-500 to-stone-700'
    };
    return colors[tag] || colors['默认'];
  };

  return (
    <div 
      ref={ref}
      className="relative group overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/20 to-orange-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* 排名徽章 - 前三名显示 */}
      {index < 3 && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${
            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600' :
            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
            'bg-gradient-to-br from-amber-700 to-orange-900'
          }`}>
            <Crown size={16} className="text-white" />
            <span className="absolute text-xs font-black text-white">
              {index + 1}
            </span>
          </div>
        </div>
      )}
      
      <Link 
        to={`/question/${question.id}`} 
        className="relative block bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
      >
        {/* 顶部作者信息 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
            {isVisible ? (
              <>
                {!imageLoaded && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse" />
                )}
                <img 
                  src={question.realAvatar} 
                  className={`relative w-10 h-10 rounded-full border-2 border-white shadow-sm ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                  alt={question.realName}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
            )}
          </div>
          <div>
            <p className="text-sm font-black text-stone-900 truncate max-w-[140px] bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
              {question.realName}
            </p>
            <div className="flex items-center gap-1">
              <Award size={10} className="text-amber-500" />
              <p className="text-[10px] font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                修为 {question.realExp.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* 问题标题 */}
        <h4 className="font-bold text-xl mb-4 line-clamp-2 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-orange-700 transition-all duration-300">
          {question.title}
        </h4>
        
        
        {/* 数据统计 */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 group/stat">
              <div className="p-1.5 rounded-lg bg-rose-50 group-hover/stat:bg-rose-100 transition-colors">
                <Heart size={14} className="text-rose-500 group-hover/stat:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-black text-stone-700">{question.likes}</span>
            </div>
            
            <div className="flex items-center gap-1.5 group/stat">
              <div className="p-1.5 rounded-lg bg-blue-50 group-hover/stat:bg-blue-100 transition-colors">
                <Eye size={14} className="text-blue-500 group-hover/stat:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-black text-stone-700">{question.views}</span>
            </div>
            
            {question.comments > 0 && (
              <div className="flex items-center gap-1.5 group/stat">
                <div className="p-1.5 rounded-lg bg-emerald-50 group-hover/stat:bg-emerald-100 transition-colors">
                  <MessageSquare size={14} className="text-emerald-500 group-hover/stat:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-black text-stone-700">{question.comments}</span>
              </div>
            )}
          </div>
          
          {/* 查看按钮 */}
          <div className="flex items-center gap-1 text-xs font-bold text-stone-400 group-hover:text-red-500 transition-colors">
            查看详情
            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard';

// 小说卡片组件
const NovelCard = memo(({ novel, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const stats = novel.stats || {};
  const profile = novel.real_profile || {};
  const userAvatar = AVATAR_OPTIONS.find(a => a.id === profile.avatar_id)?.url || 
                   `https://api.dicebear.com/7.x/avataaars/svg?seed=${novel.user_id}&size=64`;

  return (
    <div className="relative group overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-yellow-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link 
        to={`/novel/${novel.id}`}
        className="relative block bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
      >
        <div className="flex gap-4">
          {/* 小说封面 */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-28 rounded-lg overflow-hidden shadow-md">
              {novel.cover ? (
                <>
                  {!imageLoaded && (
                    <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse" />
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
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                  <Book className="w-8 h-8 text-stone-300" />
                </div>
              )}
            </div>
            {/* 角标 */}
            {index < 3 && (
              <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                'bg-gradient-to-br from-amber-700 to-orange-800'
              }`}>
                <span className="text-xs font-black text-white">
                  {index + 1}
                </span>
              </div>
            )}
          </div>
          
          {/* 小说信息 */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base mb-2 line-clamp-1 text-stone-900 group-hover:text-amber-700 transition-colors">
              {novel.title}
            </h4>
            
            <p className="text-xs text-stone-500 mb-3 line-clamp-2 italic font-serif">
              {profile.bio || "这位大侠很懒，没有写下任何签名..."}
            </p>
            
            {/* 作者信息 */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full blur-sm opacity-50" />
                  <img 
                    src={userAvatar}
                    className="relative w-8 h-8 rounded-full border border-white"
                    alt={profile.username}
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-700 truncate max-w-[80px]">
                    {profile.username || "名不经传"}
                  </p>
                  <div className="flex items-center gap-1">
                    <Award size={8} className="text-amber-500" />
                    <span className="text-[10px] font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      修为 {profile.exp || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 点赞数 */}
              <div className="flex items-center gap-1">
                <Heart size={12} className="text-rose-500" />
                <span className="text-xs font-bold text-stone-700">{stats.likes || 0}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
    </div>
  );
});

NovelCard.displayName = 'NovelCard';

// 排行榜项目组件
const RankItem = memo(({ question, index }) => {
  const rankColors = [
    'from-yellow-400 via-amber-500 to-orange-600',
    'from-gray-300 via-gray-400 to-gray-500',
    'from-amber-700 via-orange-800 to-amber-900',
    'from-stone-500 via-stone-600 to-stone-700',
    'from-stone-400 via-stone-500 to-stone-600'
  ];
  
  return (
    <div className="relative group">
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <Link 
        to={`/question/${question.id}`} 
        className="relative flex items-center gap-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-300 group-hover:scale-[1.02]"
      >
        {/* 排名序号 */}
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rankColors[index]} shadow-lg flex items-center justify-center`}>
            <span className="text-lg font-black text-white drop-shadow-sm">
              {index < 9 ? '0' + (index + 1) : index + 1}
            </span>
          </div>
          {index < 3 && (
            <div className="absolute -top-1 -right-1">
              <Crown size={12} className={
                index === 0 ? 'text-yellow-300' :
                index === 1 ? 'text-gray-300' :
                'text-amber-700'
              } />
            </div>
          )}
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-stone-900 line-clamp-1 group-hover:text-red-700 transition-colors text-base">
            {question.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-stone-300 to-stone-400 overflow-hidden">
                <img 
                  src={question.realAvatar} 
                  className="w-full h-full object-cover"
                  alt={question.realName}
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-medium text-stone-600">
                {question.realName}
              </span>
            </div>
            <span className="text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              修为 {question.realExp}
            </span>
          </div>
        </div>
        
        {/* 点赞数 */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-sm rounded-full" />
            <div className="relative p-2 rounded-full bg-rose-50">
              <Heart size={16} className="text-rose-500 fill-rose-500" />
            </div>
          </div>
          <span className="text-lg font-black text-stone-900">{question.likes}</span>
        </div>
      </Link>
    </div>
  );
});

RankItem.displayName = 'RankItem';

function HomePage() {
  const [popularQuestions, setPopularQuestions] = useState([]);
  const [popularNovels, setPopularNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);

  // 获取首页数据
  const fetchHomeData = useCallback(async () => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      setLoading(true);
      
      // 并行获取问题和小说的数据
      const [questionsPromise, novelsPromise] = await Promise.allSettled([
        // 获取问题数据
        supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8),
        
        // 获取小说数据
        supabase
          .from('novels')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(6)
      ]);

      if (controller.signal.aborted) return;

      // 处理问题数据
      if (questionsPromise.status === 'fulfilled' && !questionsPromise.value.error) {
        const qData = questionsPromise.value.data;
        const userIds = Array.from(new Set(qData?.map(q => q.user_id) || []))
          .filter(id => id && id.length > 20);
        
        const { data: pData, error: pError } = await supabase
          .from('profiles')
          .select('id, username, avatar_id, exp')
          .in('id', userIds);
        
        if (controller.signal.aborted) return;
        
        if (!pError && pData) {
          const questions = qData?.map(q => {
            const p = pData?.find(profile => profile.id === q.user_id);
            const s = typeof q.stats === 'string' ? JSON.parse(q.stats) : (q.stats || {});
            return {
              ...q,
              realName: p?.username || "佚名侠客",
              realAvatar: AVATAR_OPTIONS.find(a => a.id === p?.avatar_id)?.url || 
                         `https://api.dicebear.com/7.x/avataaars/svg?seed=${q.user_id}&size=64`,
              realExp: p?.exp || 0,
              likes: s.likes || 0,
              views: s.views || 0,
              comments: s.comments || 0
            };
          }) || [];
          
          setPopularQuestions(questions);
        }
      }

      // 处理小说数据
      if (novelsPromise.status === 'fulfilled' && !novelsPromise.value.error) {
        const nData = novelsPromise.value.data;
        
        if (nData && nData.length > 0) {
          const novelUserIds = nData.map(n => n.user_id).filter(Boolean);
          const { data: novelProfiles, error: novelProfileError } = await supabase
            .from('profiles')
            .select('id, username, avatar_id, exp, bio')
            .in('id', novelUserIds);
          
          if (!novelProfileError && novelProfiles) {
            const novels = nData.map(novel => ({
              ...novel,
              real_profile: novelProfiles.find(p => p.id === novel.user_id) || null
            }));
            
            setPopularNovels(novels);
          }
        }
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('请求被取消');
        return;
      }
      console.error('首页加载失败:', err);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchHomeData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchHomeData]);

  // 按热度排序
  const sortedQuestions = React.useMemo(() => {
    return [...popularQuestions].sort((a, b) => b.likes - a.likes);
  }, [popularQuestions]);

  // 按点赞数排序小说
  const sortedNovels = React.useMemo(() => {
    return [...popularNovels].sort((a, b) => {
      const aLikes = a.stats?.likes || 0;
      const bLikes = b.stats?.likes || 0;
      return bLikes - aLikes;
    });
  }, [popularNovels]);

  if (loading && popularQuestions.length === 0 && popularNovels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/20 to-amber-50/10">
        {/* 装饰性背景元素 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 font-['PingFang_SC']">
          {/* 英雄区域骨架屏 */}
          <div className="mb-12 text-center">
            <div className="h-12 w-64 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full animate-pulse mx-auto mb-4" />
            <div className="h-4 w-96 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full animate-pulse mx-auto" />
          </div>
          
          {/* 江湖问答骨架屏 - 移到上面 */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-8">
              <div className="h-10 w-48 bg-gradient-to-r from-stone-200 to-stone-300 rounded-xl animate-pulse" />
              <div className="h-6 w-20 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <QuestionCardSkeleton key={i} />
              ))}
            </div>
          </div>
          
          {/* 武侠小说骨架屏 - 移到下面 */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-8">
              <div className="h-10 w-48 bg-gradient-to-r from-stone-200 to-stone-300 rounded-xl animate-pulse" />
              <div className="h-6 w-20 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <NovelCardSkeleton key={i} />
              ))}
            </div>
          </div>
          
          {/* 风云榜单骨架屏 */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-xl">
            <div className="h-10 w-48 bg-gradient-to-r from-stone-200 to-stone-300 rounded-xl mb-8 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <RankItemSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/20 to-amber-50/10">
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-amber-200/10 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 font-['PingFang_SC']">
        {/* 英雄区域 */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
            <Sword size={32} className="text-red-500" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">谷子江湖</h1>
            <Book size={32} className="text-orange-500" />
          </div>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            武林高手的智慧聚集地，切磋武艺，交流心得，共同成长
          </p>
        </div>

        {/* 江湖问答 - 移到上面 */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
                <Flame size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent">
                  热门问答
                </h2>
                <p className="text-sm text-stone-500">最新最热的问题讨论</p>
              </div>
            </div>
            <Link 
              to="/questions" 
              className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300"
            >
              <span className="text-sm font-bold text-stone-600 group-hover:text-red-600 transition-colors">
                全部问答
              </span>
              <ChevronRight size={16} className="text-stone-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {popularQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularQuestions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <MessageSquare className="w-12 h-12 mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500 mb-4">暂无问答内容</p>
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

        {/* 武侠小说专区 - 移到下面 */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg">
                <Book size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
                  武侠小说
                </h2>
                <p className="text-sm text-stone-500">江湖侠客的笔墨江湖</p>
              </div>
            </div>
            <Link 
              to="/novels" 
              className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300"
            >
              <span className="text-sm font-bold text-stone-600 group-hover:text-amber-600 transition-colors">
                全部小说
              </span>
              <ChevronRight size={16} className="text-stone-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {popularNovels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularNovels.slice(0, 6).map((novel, index) => (
                <NovelCard
                  key={novel.id}
                  novel={novel}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <Book className="w-12 h-12 mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500 mb-4">暂无小说作品</p>
              <Link 
                to="/novels/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <BookOpen size={18} />
                开始创作
              </Link>
            </div>
          )}
        </div>

        {/* 风云榜单 */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
                风云榜单
              </h2>
              <p className="text-sm text-stone-500">按人气排行的热门问题</p>
            </div>
          </div>
          
          {sortedQuestions.length > 0 ? (
            <div className="space-y-2">
              {sortedQuestions.slice(0, 5).map((question, index) => (
                <RankItem
                  key={question.id}
                  question={question}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-12 h-12 mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500">暂无排行榜数据</p>
            </div>
          )}
          
          {/* 底部CTA */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-500">想要参与讨论？快来提问吧！</p>
              <Link 
                to="/ask-question" 
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Zap size={18} className="group-hover:rotate-12 transition-transform" />
                我要提问
              </Link>
            </div>
          </div>
        </div>

        {/* 特色功能展示 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500">
                <Award size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">热心解答</h3>
            </div>
            <p className="text-sm text-stone-600 mb-4">
              各路高手在线解答，获得最专业的建议和指导
            </p>
            <div className="h-1 w-full bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full" />
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500">
                <MessageSquare size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">武侠创作</h3>
            </div>
            <p className="text-sm text-stone-600 mb-4">
              在笔墨江湖中挥洒你的武侠梦，创作属于自己的江湖故事
            </p>
            <div className="h-1 w-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full" />
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <BookOpen size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">知识积累</h3>
            </div>
            <p className="text-sm text-stone-600 mb-4">
              沉淀优质问答内容，构建完整的知识体系
            </p>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(HomePage);