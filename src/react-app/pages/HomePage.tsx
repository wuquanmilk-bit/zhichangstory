import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Eye, Loader2, Flame, TrendingUp, 
  ChevronRight, Sword, BookOpen, MessageSquare, 
  Crown, Zap, Award, Book, Star
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { AVATAR_OPTIONS } from '../../constants/avatars';

// 骨架屏组件 - 保持完整
const QuestionCardSkeleton = memo(() => (
  <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/20 shadow-lg animate-pulse">
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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className="relative group overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/20 to-orange-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {index < 3 && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg ${
            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600' :
            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
            'bg-gradient-to-br from-amber-700 to-orange-900'
          }`}>
            <Crown size={14} className="text-white" />
            <span className="absolute text-[10px] md:text-xs font-black text-white">
              {index + 1}
            </span>
          </div>
        </div>
      )}
      
      <Link 
        to={`/question/${question.id}`} 
        className="relative block bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
      >
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
            {isVisible ? (
              <>
                {!imageLoaded && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse" />
                )}
                <img 
                  src={question.realAvatar} 
                  className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                  alt={question.realName}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
            )}
          </div>
          <div>
            <p className="text-xs md:text-sm font-black text-stone-900 truncate max-w-[120px] bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
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
        
        <h4 className="font-bold text-base md:text-xl mb-3 md:mb-4 line-clamp-2 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-orange-700 transition-all duration-300">
          {question.title}
        </h4>
        
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-stone-100">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-1.5 group/stat">
              <div className="p-1 md:p-1.5 rounded-lg bg-rose-50 group-hover/stat:bg-rose-100 transition-colors">
                <Heart size={12} className="text-rose-500 group-hover/stat:scale-110 transition-transform" />
              </div>
              <span className="text-xs md:text-sm font-black text-stone-700">{question.likes}</span>
            </div>
            
            <div className="flex items-center gap-1.5 group/stat">
              <div className="p-1 md:p-1.5 rounded-lg bg-blue-50 group-hover/stat:bg-blue-100 transition-colors">
                <Eye size={12} className="text-blue-500 group-hover/stat:scale-110 transition-transform" />
              </div>
              <span className="text-xs md:text-sm font-black text-stone-700">{question.views}</span>
            </div>
            
            {question.comments > 0 && (
              <div className="flex items-center gap-1.5 group/stat">
                <div className="p-1 md:p-1.5 rounded-lg bg-emerald-50 group-hover/stat:bg-emerald-100 transition-colors">
                  <MessageSquare size={12} className="text-emerald-500 group-hover/stat:scale-110 transition-transform" />
                </div>
                <span className="text-xs md:text-sm font-black text-stone-700">{question.comments}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-stone-400 group-hover:text-red-500 transition-colors">
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
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-yellow-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link 
        to={`/novel/${novel.id}`}
        className="relative block bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
      >
        <div className="flex gap-3 md:gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-24 md:w-20 md:h-28 rounded-lg overflow-hidden shadow-md">
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
                  <Book className="w-6 h-6 md:w-8 md:h-8 text-stone-300" />
                </div>
              )}
            </div>
            {index < 3 && (
              <div className={`absolute -top-1.5 -left-1.5 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg ${
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                'bg-gradient-to-br from-amber-700 to-orange-800'
              }`}>
                <span className="text-[10px] md:text-xs font-black text-white">
                  {index + 1}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm md:text-base mb-1 md:mb-2 line-clamp-1 text-stone-900 group-hover:text-amber-700 transition-colors">
                {novel.title}
              </h4>
              <p className="text-[10px] md:text-xs text-stone-500 line-clamp-2 italic font-serif">
                {profile.bio || "这位大侠很懒，没有写下任何签名..."}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full blur-sm opacity-50" />
                  <img 
                    src={userAvatar}
                    className="relative w-5 h-5 md:w-6 md:h-6 rounded-full border border-white"
                    alt={profile.username}
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-stone-700 truncate max-w-[60px] md:max-w-[80px]">
                    {profile.username || "名不经传"}
                  </p>
                  <div className="flex items-center gap-1">
                    <Award size={8} className="text-amber-500" />
                    <span className="text-[9px] md:text-[10px] font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      修为 {profile.exp || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Heart size={10} className="text-rose-500" />
                <span className="text-[10px] md:text-xs font-bold text-stone-700">{stats.likes || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});
NovelCard.displayName = 'NovelCard';

// ！！！优化后的风云榜单项（RankItem）！！！
const RankItem = memo(({ question, index }) => {
  const rankColors = [
    'from-yellow-400 via-amber-500 to-orange-600',
    'from-gray-300 via-gray-400 to-gray-500',
    'from-amber-700 via-orange-800 to-amber-900',
    'from-blue-500 to-indigo-600',
    'from-stone-500 to-stone-600'
  ];
  const bgGradient = index < 5 ? rankColors[index] : rankColors[4];

  return (
    <div className="relative group">
      <Link 
        to={`/question/${question.id}`} 
        className="relative flex gap-3 md:gap-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
      >
        {/* 左侧：排名色块（手机端优化） */}
        <div className={`relative w-14 h-18 md:w-16 md:h-20 flex-shrink-0 rounded-lg bg-gradient-to-br ${bgGradient} shadow-md flex flex-col items-center justify-center text-white overflow-hidden`}>
           <div className="absolute inset-0 bg-white/10 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 10%)', backgroundSize: '8px 8px' }}></div>
           <span className="text-[10px] opacity-80 uppercase tracking-wider font-bold">TOP</span>
           <span className="text-2xl md:text-3xl font-black leading-none drop-shadow-md">
              {index + 1}
           </span>
           {index < 3 && (
            <div className="absolute top-0.5 right-0.5">
              <Crown size={10} className="text-white/80" />
            </div>
           )}
        </div>
        
        {/* 右侧：信息 */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h4 className="font-bold text-stone-900 line-clamp-2 text-sm leading-tight group-hover:text-red-700 transition-colors mb-1.5">
              {question.title}
            </h4>
            
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-stone-300 to-stone-400 overflow-hidden">
                <img 
                  src={question.realAvatar} 
                  className="w-full h-full object-cover"
                  alt={question.realName}
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] text-stone-500 truncate max-w-[80px]">
                {question.realName}
              </span>
              <span className="text-[10px] font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Lv.{Math.floor(question.realExp / 1000) + 1}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-stone-100/50">
             <div className="flex items-center gap-2 text-[10px] text-stone-400 font-medium">
                <div className="flex items-center gap-0.5">
                  <Heart size={10} className={index < 3 ? "text-rose-500" : ""} />
                  <span>{question.likes}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <MessageSquare size={10} />
                  <span>{question.comments}</span>
                </div>
             </div>
             <div className="text-[10px] font-bold text-stone-300 group-hover:text-red-500 transition-colors flex items-center">
               查看 <ChevronRight size={8} />
             </div>
          </div>
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

  const fetchHomeData = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      setLoading(true);
      
      const [questionsPromise, novelsPromise] = await Promise.allSettled([
        supabase.from('questions').select('*').order('created_at', { ascending: false }).limit(8),
        supabase.from('novels').select('*').eq('is_public', true).order('created_at', { ascending: false }).limit(6)
      ]);

      if (controller.signal.aborted) return;

      if (questionsPromise.status === 'fulfilled' && !questionsPromise.value.error) {
        const qData = questionsPromise.value.data;
        const userIds = Array.from(new Set(qData?.map(q => q.user_id) || [])).filter(id => id && id.length > 20);
        
        const { data: pData, error: pError } = await supabase.from('profiles').select('id, username, avatar_id, exp').in('id', userIds);
        
        if (!pError && pData) {
          const questions = qData?.map(q => {
            const p = pData?.find(profile => profile.id === q.user_id);
            const s = typeof q.stats === 'string' ? JSON.parse(q.stats) : (q.stats || {});
            return {
              ...q,
              realName: p?.username || "佚名侠客",
              realAvatar: AVATAR_OPTIONS.find(a => a.id === p?.avatar_id)?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${q.user_id}&size=64`,
              realExp: p?.exp || 0,
              likes: s.likes || 0, views: s.views || 0, comments: s.comments || 0
            };
          }) || [];
          setPopularQuestions(questions);
        }
      }

      if (novelsPromise.status === 'fulfilled' && !novelsPromise.value.error) {
        const nData = novelsPromise.value.data;
        if (nData && nData.length > 0) {
          const novelUserIds = nData.map(n => n.user_id).filter(Boolean);
          const { data: novelProfiles, error: novelProfileError } = await supabase.from('profiles').select('id, username, avatar_id, exp, bio').in('id', novelUserIds);
          
          if (!novelProfileError && novelProfiles) {
            const novels = nData.map(novel => ({
              ...novel, real_profile: novelProfiles.find(p => p.id === novel.user_id) || null
            }));
            setPopularNovels(novels);
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('首页加载失败:', err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, [fetchHomeData]);

  const sortedQuestions = React.useMemo(() => {
    return [...popularQuestions].sort((a, b) => b.likes - a.likes);
  }, [popularQuestions]);

  if (loading && popularQuestions.length === 0 && popularNovels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/20 to-amber-50/10">
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12 text-center">
             <div className="h-12 w-64 bg-stone-200 rounded-full animate-pulse mx-auto mb-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <QuestionCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/20 to-amber-50/10 pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-12 font-['PingFang_SC']">
        {/* 英雄区域 */}
        <div className="mb-8 md:mb-12 text-center">
          <div className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2 md:mb-4">
            <Sword className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">谷子江湖</h1>
            <Book className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
          </div>
          <p className="text-sm md:text-lg text-stone-600 max-w-2xl mx-auto px-4">
            武林高手的智慧聚集地，切磋武艺，交流心得
          </p>
        </div>

        {/* 1. 热门问答 */}
        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-center mb-4 md:mb-6 px-1">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
                <Flame className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-black text-stone-800">热门问答</h2>
                <p className="hidden md:block text-sm text-stone-500">最新最热的问题讨论</p>
              </div>
            </div>
            <Link to="/questions" className="text-xs md:text-sm font-bold text-stone-500 flex items-center gap-1">
              全部 <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {popularQuestions.slice(0, 4).map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} />
            ))}
          </div>
        </div>

        {/* 2. 风云榜单 - 手机端优化为 Grid */}
        <div className="mb-8 md:mb-12">
           <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-1">
            <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-lg md:text-2xl font-black text-stone-800">风云榜单</h2>
          </div>

          {/* 榜单容器 */}
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/50 shadow-xl">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {sortedQuestions.slice(0, 6).map((q, i) => (
                  <RankItem key={q.id} question={q} index={i} />
                ))}
             </div>
             
             {sortedQuestions.length > 0 && (
               <div className="mt-4 md:mt-6 text-center">
                  <Link 
                    to="/questions" 
                    className="inline-flex w-full md:w-auto justify-center items-center gap-2 px-6 py-3 bg-white text-stone-700 rounded-xl font-bold shadow-sm hover:shadow-md transition-all text-sm"
                  >
                    查看完整榜单
                  </Link>
               </div>
             )}
          </div>
        </div>

        {/* 3. 谷子小说 */}
        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-center mb-4 md:mb-6 px-1">
             <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-black text-stone-800">谷子小说</h2>
            </div>
            <Link to="/novels" className="text-xs md:text-sm font-bold text-stone-500 flex items-center gap-1">
              全部 <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
             {popularNovels.slice(0, 6).map((n, i) => (
               <NovelCard key={n.id} novel={n} index={i} />
             ))}
          </div>
        </div>
        
        {/* 底部 CTA */}
        <div className="mt-8 md:mt-12 text-center pb-8">
            <Link 
              to="/ask-question" 
              className="block md:inline-flex w-full md:w-auto items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Zap size={20} />
              <span className="text-lg">立即加入讨论</span>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(HomePage);