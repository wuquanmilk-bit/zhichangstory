import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import { supabase } from '../../supabaseClient';
import { AVATAR_OPTIONS } from '../../constants/avatars';
import { 
  ChevronLeft, MessageSquare, Eye, Heart, Loader2, Calendar, 
  Clock, User, Send, MoreVertical, Flag, Share2, Bookmark,
  TrendingUp, Award, Shield, Zap, AlertCircle
} from 'lucide-react';

const QuestionDetailSkeleton = memo(() => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="h-6 w-20 bg-stone-200 rounded-full animate-pulse mb-6" />
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 mb-8 animate-pulse">
      <div className="h-20 bg-stone-200 rounded w-full mb-4" />
      <div className="h-40 bg-stone-200 rounded w-full" />
    </div>
  </div>
));
QuestionDetailSkeleton.displayName = 'QuestionDetailSkeleton';

const AnswerItem = memo(({ answer, index }: any) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const ansProfile = answer.profiles;
  const ansAvatar = useMemo(() => 
    AVATAR_OPTIONS.find(a => a.id === ansProfile?.avatar_id)?.url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${answer.user_id}&size=64`,
    [ansProfile?.avatar_id, answer.user_id]
  );

  const displayDate = useMemo(() => {
    if (!answer.created_at) return '刚刚';
    const date = new Date(answer.created_at);
    if (isNaN(date.getTime()) || date.getFullYear() <= 1970) return '刚刚';
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }, [answer.created_at]);

  return (
    <div 
      className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-sm opacity-70" />
            {!imageLoaded && <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-200 animate-pulse" />}
            <img 
              src={ansAvatar} 
              className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
              alt={ansProfile?.username || "侠客"}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-xs md:text-sm font-black text-stone-900 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
                {ansProfile?.username || "侠客"}
              </div>
              {ansProfile?.is_contract_author && <div className="px-1.5 py-0.5 text-[10px] bg-blue-600 text-white rounded-full">签约</div>}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Award size={10} className="text-amber-500" />
              <span className="text-[9px] font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                修为 {ansProfile?.exp || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] md:text-xs text-stone-400">
          <Clock size={10} /> <span>{displayDate}</span>
        </div>
      </div>
      <p className="text-stone-600 pl-1 font-medium leading-relaxed whitespace-pre-wrap break-words w-full text-sm md:text-base">
        {answer.content}
      </p>
    </div>
  );
});
AnswerItem.displayName = 'AnswerItem';

function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); 

  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({ likes: 0, views: 0, comments: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchDetail = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      setLoading(true);
      const [questionPromise, answersPromise] = await Promise.all([
        supabase.from('questions').select('*, profiles(*)').eq('id', id).single(),
        supabase.from('answers').select('*, profiles(*)').eq('questionid', id).order('created_at', { ascending: true })
      ]);
      
      if (controller.signal.aborted) return;
      
      setQuestion(questionPromise.data);
      setAnswers(answersPromise.data || []);
      
      if (questionPromise.data) {
        const currentStats = typeof questionPromise.data.stats === 'string' 
          ? JSON.parse(questionPromise.data.stats) 
          : (questionPromise.data.stats || { likes: 0, views: 0 });
        
        const newStats = {
          likes: currentStats.likes || 0,
          views: (currentStats.views || 0) + 1,
          comments: answersPromise.data?.length || 0
        };
        setStats(newStats);
        await supabase.from('questions').update({ stats: { ...currentStats, views: newStats.views } }).eq('id', id);
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') console.error("数据加载失败:", e);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [id]);

  const checkUserLike = useCallback(async () => {
    if (!user || !id) return;
    const { data } = await supabase.from('likes').select('*').eq('question_id', id).eq('user_id', user.id).single();
    if (data) setIsLiked(true);
  }, [user, id]);

  const onLike = useCallback(async () => {
    if (!question || !user || !question.stats) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      const currentStats = { ...question.stats };
      const currentLikes = currentStats.likes || 0;
      let newLikes = isLiked ? Math.max(currentLikes - 1, 0) : currentLikes + 1;

      await supabase.from('questions').update({
        stats: { ...currentStats, likes: newLikes },
        updated_at: new Date().toISOString()
      }).eq('id', id);

      setIsLiked(!isLiked);
      setStats(prev => ({ ...prev, likes: newLikes }));
    } catch (err: any) { console.error('点赞失败:', err); }
  }, [question, user, id, isLiked, navigate, location.pathname]);

  const submitComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login', { state: { from: location.pathname } }); return; }
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('is_banned').eq('id', user.id).single();
      if (profile?.is_banned) { alert("您的账号已被封禁"); return; }

      await supabase.from('answers').insert([{
        questionid: id, user_id: user.id, content: comment.trim(), created_at: new Date().toISOString()
      }]);
      
      const { data: newAnswer } = await supabase.from('answers').select('*, profiles(*)').eq('questionid', id).order('created_at', { ascending: false }).limit(1).single();
      if (newAnswer) {
        setAnswers(prev => [newAnswer, ...prev]);
        setStats(prev => ({ ...prev, comments: prev.comments + 1 }));
      }
      setComment('');
    } catch (err) { alert('评论失败'); } finally { setIsSubmitting(false); }
  }, [comment, user, id, navigate, location.pathname]);

  useEffect(() => {
    fetchDetail();
    checkUserLike();
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, [fetchDetail, checkUserLike]);

  useEffect(() => {
    if (commentTextareaRef.current) {
      commentTextareaRef.current.style.height = 'auto';
      commentTextareaRef.current.style.height = `${Math.min(commentTextareaRef.current.scrollHeight, 200)}px`;
    }
  }, [comment]);

  if (loading && !question) return <QuestionDetailSkeleton />;
  if (!question) return <div className="p-10 text-center">问题不存在</div>;

  const author = question.profiles;
  const authorAvatar = AVATAR_OPTIONS.find(a => a.id === author?.avatar_id)?.url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${question.user_id}&size=64`;

  return (
    <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-8 font-['PingFang_SC']">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-1 text-stone-500 hover:text-red-600 transition-colors font-bold text-sm">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 返回
        </button>
        <div className="relative">
          <button onClick={() => setShowActions(!showActions)} className="p-2 hover:bg-stone-100 rounded-lg">
            <MoreVertical size={20} className="text-stone-400" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl border border-stone-200 z-10 w-32 overflow-hidden animate-fadeIn">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 w-full text-sm text-stone-600"><Share2 size={14}/> 分享</button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 w-full text-sm text-stone-600"><Bookmark size={14}/> 收藏</button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 w-full text-sm text-red-500 border-t border-stone-50"><Flag size={14}/> 举报</button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg border border-white/40 mb-6 md:mb-8 animate-fadeInUp">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-sm opacity-70" />
            <img src={authorAvatar} className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-lg" alt="avatar" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-stone-900 text-sm md:text-lg">{author?.username || "佚名侠客"}</h4>
              {author?.is_contract_author && <span className="px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full">签约</span>}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="text-amber-600 font-bold">修为 {author?.exp || 0}</span>
              <span className="text-stone-400">{new Date(question.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <h1 className="text-xl md:text-3xl font-black text-stone-900 mb-4 md:mb-6 leading-snug break-words whitespace-pre-wrap w-full">
          {question.title}
        </h1>
        
        <div className="text-stone-700 leading-relaxed mb-6 md:mb-10 text-base md:text-lg border-l-4 border-red-600 pl-4 md:pl-6 py-2 md:py-4 bg-gradient-to-r from-red-50/20 to-orange-50/20 rounded-r-xl whitespace-pre-wrap break-words font-medium w-full">
          {question.content}
        </div>

        {question.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.map((tag: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-stone-100 text-stone-600 rounded-md text-xs">#{tag}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-stone-100">
          <div className="flex items-center gap-3 md:gap-6 overflow-x-auto scrollbar-hide w-full">
            <button onClick={onLike} className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-bold transition-all text-xs md:text-sm ${isLiked ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
              <Heart size={16} className={isLiked ? 'fill-current' : ''} /> {stats.likes}
            </button>
            <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-xs md:text-sm">
              <MessageSquare size={16} /> {stats.comments}
            </div>
            <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold text-xs md:text-sm">
              <Eye size={16} /> {stats.views}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={submitComment} className="relative mb-8 md:mb-12">
        <textarea
          ref={commentTextareaRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={user ? "分享您的见解，为江湖增添智慧..." : "登录后参与讨论"}
          className="w-full min-h-[100px] p-4 md:p-6 bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 shadow-sm transition-all resize-none break-words whitespace-pre-wrap text-sm md:text-base"
          disabled={!user}
        />
        <div className="flex items-center justify-between mt-3 md:mt-4">
          <span className="text-xs text-stone-400">评论 {stats.comments} 条</span>
          <button 
            type="submit" 
            disabled={isSubmitting || !comment.trim()}
            className="flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all text-sm md:text-base"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            发表评论
          </button>
        </div>
      </form>

      <div id="answers-section" className="space-y-4 md:space-y-6 pb-20">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
          <h3 className="text-lg md:text-xl font-black text-stone-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-red-600" /> 江湖回响
          </h3>
        </div>
        {answers.length > 0 ? (
          answers.map((answer, index) => <AnswerItem key={answer.id} answer={answer} index={index} />)
        ) : (
          <div className="text-center py-12 bg-white/90 rounded-3xl border border-white/40">
            <MessageSquare size={32} className="text-stone-300 mx-auto mb-2" />
            <p className="text-stone-500 text-sm">暂无评论，快来抢沙发！</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(QuestionDetailPage);