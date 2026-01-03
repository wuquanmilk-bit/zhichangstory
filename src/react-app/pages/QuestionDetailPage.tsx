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

// 骨架屏组件
const QuestionDetailSkeleton = memo(() => (
  <div className="max-w-4xl mx-auto px-4 py-8 font-['PingFang_SC']">
    <div className="mb-6">
      <div className="h-6 w-20 bg-stone-200 rounded-full animate-pulse" />
    </div>
    
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-stone-200" />
        <div className="space-y-2">
          <div className="w-24 h-4 bg-stone-200 rounded" />
          <div className="w-16 h-3 bg-stone-200 rounded" />
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="h-8 bg-stone-200 rounded w-4/5" />
        <div className="h-8 bg-stone-200 rounded w-3/4" />
      </div>
      
      <div className="space-y-3 mb-10">
        <div className="h-4 bg-stone-200 rounded" />
        <div className="h-4 bg-stone-200 rounded w-5/6" />
        <div className="h-4 bg-stone-200 rounded w-4/5" />
        <div className="h-4 bg-stone-200 rounded w-3/4" />
      </div>
      
      <div className="flex items-center space-x-6 pt-6 border-t border-stone-50">
        <div className="w-20 h-8 bg-stone-200 rounded-full" />
        <div className="w-20 h-8 bg-stone-200 rounded-full" />
      </div>
    </div>
    
    <div className="mb-12">
      <div className="h-36 bg-stone-200 rounded-2xl animate-pulse" />
    </div>
    
    <div className="space-y-6 pb-20">
      <div className="h-6 w-32 bg-stone-200 rounded mb-4" />
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-stone-50 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-stone-200" />
            <div className="space-y-2">
              <div className="w-20 h-3 bg-stone-200 rounded" />
              <div className="w-16 h-2 bg-stone-200 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-stone-200 rounded" />
            <div className="h-3 bg-stone-200 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  </div>
));

QuestionDetailSkeleton.displayName = 'QuestionDetailSkeleton';

// 答案项组件
const AnswerItem = memo(({ answer, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const ansProfile = answer.profiles;
  const ansAvatar = useMemo(() => 
    AVATAR_OPTIONS.find(a => a.id === ansProfile?.avatar_id)?.url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${answer.user_id}&size=64`,
    [ansProfile?.avatar_id, answer.user_id]
  );

  return (
    <div 
      className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-sm hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-sm opacity-70" />
            {!imageLoaded && (
              <div className="w-10 h-10 rounded-full bg-stone-200 animate-pulse" />
            )}
            <img 
              src={ansAvatar} 
              className={`relative w-10 h-10 rounded-full border-2 border-white shadow-sm ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
              alt={ansProfile?.username || "侠客"}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-black text-stone-900 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
                {ansProfile?.username || "侠客"}
              </div>
              {ansProfile?.is_contract_author && (
                <div className="px-2 py-0.5 text-[10px] bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold shadow-sm">
                  签约
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Award size={10} className="text-amber-500" />
              <span className="text-[9px] font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                修为 {ansProfile?.exp || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-400">
          <Clock size={12} />
          <span>{new Date(answer.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
      {/* 回答内容 - 强制换行，不撑破容器 */}
      <p className="text-stone-600 pl-1 font-medium leading-relaxed whitespace-pre-wrap break-words w-full">
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

  // 获取详情数据
  const fetchDetail = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      setLoading(true);
      
      const [questionPromise, answersPromise] = await Promise.all([
        supabase.from('questions').select('*, profiles(*)').eq('id', id).single(),
        supabase.from('answers').select('*, profiles(*)').eq('questionid', id).order('created_at', { ascending: true })
      ]);
      
      if (controller.signal.aborted) return;
      if (questionPromise.error) throw questionPromise.error;
      if (answersPromise.error) throw answersPromise.error;
      
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
        
        await supabase
          .from('questions')
          .update({ 
            stats: { 
              ...currentStats, 
              views: newStats.views 
            } 
          })
          .eq('id', id);
      }
      
    } catch (e) {
      if (e.name !== 'AbortError') console.error("数据加载失败:", e);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [id]);

  // 检查点赞
  const checkUserLike = useCallback(async () => {
    if (!user || !id) return;
    const { data } = await supabase.from('likes').select('*').eq('question_id', id).eq('user_id', user.id).single();
    if (data) setIsLiked(true);
  }, [user, id]);

  // 点赞处理
const onLike = useCallback(async () => {
  if (!question || !user || !question.stats) {
    navigate('/login', { state: { from: location.pathname } });
    return;
  }
  
  try {
    // 1. 获取当前问题的原始stats（保留阅读量、回答数等其他字段）
    const currentStats = { ...question.stats };
    const currentLikes = currentStats.likes || 0; // 处理点赞数为undefined的情况
    let newLikes = currentLikes;

    // 2. 点赞/取消点赞逻辑
    if (isLiked) {
      // 取消点赞：点赞数-1（确保不小于0）
      newLikes = Math.max(currentLikes - 1, 0);
    } else {
      // 点赞：点赞数+1
      newLikes = currentLikes + 1;
    }

    // 3. 调用Supabase更新questions表的stats字段
    const { error: updateError } = await supabase
      .from('questions') // 操作正确的问题表
      .update({
        stats: { ...currentStats, likes: newLikes }, // 只更新点赞数，保留其他统计
        updated_at: new Date().toISOString() // 可选：更新修改时间
      })
      .eq('id', id); // 按问题ID定位记录

    if (updateError) throw updateError;

    // 4. 前端状态同步（无成功提示框）
    setIsLiked(!isLiked);
    setStats(prev => ({ ...prev, likes: newLikes }));
    setQuestion(prev => prev ? { ...prev, stats: { ...currentStats, likes: newLikes } } : null);
    
  } catch (err: any) {
    console.error('点赞操作失败:', err);
    alert(`点赞操作失败：${err.message || '请稍后重试'}`);
  }
}, [question, user, id, isLiked, navigate, location.pathname]);

  // 提交评论 (核心修改：添加封禁检查)
  const submitComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // --- 关键插入：封禁校验 ---
      const { data: profile } = await supabase.from('profiles').select('is_banned, user_status').eq('id', user.id).single();
      if (profile?.is_banned || profile?.user_status === 'banned') {
        alert("您的账号已被封禁，无法发表评论。");
        setIsSubmitting(false);
        return;
      }
      // ------------------------

      const { error } = await supabase.from('answers').insert([{
        questionid: id,
        user_id: user.id,
        content: comment.trim(),
        created_at: new Date().toISOString()
      }]);
      
      if (error) throw error;
      
      const { data: newAnswer } = await supabase
        .from('answers')
        .select('*, profiles(*)')
        .eq('questionid', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (newAnswer) {
        setAnswers(prev => [newAnswer, ...prev]);
        setStats(prev => ({ ...prev, comments: prev.comments + 1 }));
      }
      
      setComment('');
      
      setTimeout(() => {
        const commentSection = document.getElementById('answers-section');
        if (commentSection) {
          commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
    } catch (err) {
      console.error('发表评论失败:', err);
      alert('评论失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  }, [comment, user, id, navigate, location.pathname]);

  const handleInputFocus = useCallback(() => {
    if (!user) navigate('/login', { state: { from: location.pathname } });
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    fetchDetail();
    checkUserLike();
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, [fetchDetail, checkUserLike]);

  useEffect(() => {
    const textarea = commentTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [comment]);

  if (loading && !question) return <QuestionDetailSkeleton />;

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-stone-700 mb-2">问题不存在</h2>
          <button onClick={() => navigate('/questions')} className="px-6 py-3 bg-red-600 text-white rounded-xl">
            返回列表
          </button>
        </div>
      </div>
    );
  }

  const author = question.profiles;
  const authorAvatar = AVATAR_OPTIONS.find(a => a.id === author?.avatar_id)?.url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${question.user_id}&size=64`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-['PingFang_SC']">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-stone-400 hover:text-red-600 transition-colors font-bold">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 返回
        </button>
        <div className="relative">
          <button onClick={() => setShowActions(!showActions)} className="p-2 hover:bg-stone-100 rounded-lg">
            <MoreVertical size={20} className="text-stone-400" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl border border-stone-200 z-10 w-32">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 w-full text-sm"><Share2 size={16}/> 分享</button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 w-full text-sm"><Bookmark size={16}/> 收藏</button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 w-full text-sm text-red-500"><Flag size={16}/> 举报</button>
            </div>
          )}
        </div>
      </div>

      {/* 问题主体卡片 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/40 mb-8 animate-fadeInUp">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-sm opacity-70" />
            <img src={authorAvatar} className="relative w-12 h-12 rounded-full border-2 border-white shadow-lg" alt="avatar" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-stone-900 text-lg">{author?.username || "佚名侠客"}</h4>
              {author?.is_contract_author && <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full">签约</span>}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="text-amber-600 font-bold">修为 {author?.exp || 0}</span>
              <span className="text-stone-400">{new Date(question.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-stone-900 mb-6 leading-tight break-words whitespace-pre-wrap w-full">
          {question.title}
        </h1>
        {/* 问题内容 - 强制换行 */}
        <div className="text-stone-700 leading-relaxed mb-10 text-lg border-l-4 border-red-600 pl-6 py-4 bg-gradient-to-r from-red-50/20 to-orange-50/20 rounded-r-xl whitespace-pre-wrap break-words font-medium w-full">
          {question.content}
        </div>

        {question.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.map((tag: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-stone-100">
          <div className="flex items-center space-x-6">
            <button onClick={onLike} className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold transition-all ${isLiked ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
              <Heart size={18} className={isLiked ? 'fill-current' : ''} /> {stats.likes}
            </button>
            <div className="flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 rounded-full font-bold">
              <MessageSquare size={18} /> {stats.comments}
            </div>
            <div className="flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold">
              <Eye size={18} /> {stats.views}
            </div>
          </div>
        </div>
      </div>

      {/* 评论区 - 输入框强制换行，限制最大高度 */}
      <form onSubmit={submitComment} className="relative mb-12">
        <textarea
          ref={commentTextareaRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={user ? "分享您的见解，为江湖增添智慧..." : "登录后参与讨论"}
          className="w-full min-h-[120px] max-h-[300px] overflow-y-auto p-6 bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 shadow-sm transition-all resize-none break-words whitespace-pre-wrap"
          disabled={!user}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-stone-400">评论 {stats.comments} 条</span>
          <button 
            type="submit" 
            disabled={isSubmitting || !comment.trim()}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            发表评论
          </button>
        </div>
      </form>

      {/* 回答列表 */}
      <div id="answers-section" className="space-y-6 pb-20">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
          <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-red-600" /> 江湖回响
          </h3>
        </div>
        {answers.length > 0 ? (
          answers.map((answer, index) => <AnswerItem key={answer.id} answer={answer} index={index} />)
        ) : (
          <div className="text-center py-12 bg-white/90 rounded-3xl border border-white/40">
            <MessageSquare size={32} className="text-stone-300 mx-auto mb-2" />
            <p className="text-stone-500">暂无评论，快来抢沙发！</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(QuestionDetailPage);