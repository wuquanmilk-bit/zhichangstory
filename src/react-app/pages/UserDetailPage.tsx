import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { AVATAR_OPTIONS } from '../../constants/avatars';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MessageSquare, BookOpen, ThumbsUp, Eye, Calendar, User, 
  Edit, Loader2, RefreshCw, Trash2, Heart, Plus, Lock, X, 
  CheckCircle2, Award, Zap, ShieldCheck, Coins, Crown, BadgeCheck, UserCog, Shield,
  Video, Play 
} from 'lucide-react';

// 徽章组件
const UserBadges = ({ profile }: { profile: any }) => {
  if (!profile) return null;
  return (
    <div className="flex flex-wrap gap-1.5 ml-2">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200">
        基础会员
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-200">
        <Zap className="h-3 w-3" /> {profile.exp?.toLocaleString() || 0} 修为
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-full border border-yellow-200">
        <Coins className="h-3 w-3" /> {profile.coins?.toLocaleString() || 0} 金币
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
        <Zap className="h-3 w-3 fill-current" /> LV.{profile.user_level || Math.floor((profile.exp || 0) / 1000) + 1}
      </span>
      {profile.is_vip && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 text-[10px] font-bold rounded-full border border-amber-200">
          <Crown className="h-3 w-3 fill-current" /> VIP会员
        </span>
      )}
      {profile.is_contract_author && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-600 text-[10px] font-bold rounded-full border border-orange-200">
          <Award className="h-3 w-3" /> 签约作家
        </span>
      )}
    </div>
  );
};

type VideoItem = {
  id: string; title: string; thumbnail_url: string; video_url: string; user_id: string; status: string; created_at: string; views_count?: number; likes_count?: number;
};
type Novel = {
  id: string; title: string; description: string; content: string; cover: string; user_id?: string; author?: { id: string }; created_at: string; stats?: { views: number; likes: number; chapters: number; }; views?: number; likes?: number; reads?: number; is_public?: boolean; category?: string; tags?: string[];
};

export default function UserDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: paramUserId } = useParams();
  
  const [profile, setProfile] = useState<any>(null);
  const [myQuestions, setMyQuestions] = useState<any[]>([]);
  const [myNovels, setMyNovels] = useState<Novel[]>([]);
  const [myVideos, setMyVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'novels' | 'videos'>('questions');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'question' | 'novel' | 'video', id: string} | null>(null);

  const isOwnProfile = !paramUserId || (user?.id && paramUserId === user.id);
  const targetUserId = isOwnProfile ? user?.id : paramUserId;

  const getStats = () => {
    if (loading) return { likes: 0, views: 0 };
    const qLikes = (myQuestions || []).reduce((s, q) => s + (Number(q.likes) || Number(q.stats?.likes) || 0), 0);
    const qViews = (myQuestions || []).reduce((s, q) => s + (Number(q.views) || Number(q.stats?.views) || 0), 0);
    const nLikes = (myNovels || []).reduce((s, n) => s + (Number(n.likes) || Number(n.stats?.likes) || 0), 0);
    const nViews = (myNovels || []).reduce((s, n) => s + (Number(n.views) || Number(n.stats?.views) || Number(n.reads) || 0), 0);
    const vLikes = (myVideos || []).reduce((s, v) => s + (Number(v.likes_count) || 0), 0);
    const vViews = (myVideos || []).reduce((s, v) => s + (Number(v.views_count) || 0), 0);
    return { likes: qLikes + nLikes + vLikes, views: qViews + nViews + vViews };
  };

  const fetchUserData = async () => {
    if (!targetUserId) { setLoading(false); return; }
    try {
      setLoading(true);
      setRefreshing(true);
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', targetUserId).single();
      setProfile(profileData || {});

      const { data: qData } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
      if (qData) {
        setMyQuestions(qData.filter(q => q.author_id === targetUserId || q.author?.id === targetUserId));
      }

      const { data: nData } = await supabase.from('novels').select('*').or(`author->>id.eq.${targetUserId},user_id.eq.${targetUserId}`).order('created_at', { ascending: false });
      setMyNovels(nData as Novel[] || []);

      const { data: vData } = await supabase.from('videos').select('*').eq('user_id', targetUserId).order('created_at', { ascending: false });
      setMyVideos(vData || []);
      
    } catch (err) { console.error('获取用户数据失败:', err); } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { if (targetUserId) fetchUserData(); }, [targetUserId, user?.id]);

  const handleDelete = async () => {
    if (!user?.id || !showDeleteConfirm) return;
    try {
      if (showDeleteConfirm.type === 'question') {
         await supabase.from('questions').delete().eq('id', showDeleteConfirm.id);
         setMyQuestions(prev => prev.filter(q => q.id !== showDeleteConfirm.id));
      } else if (showDeleteConfirm.type === 'novel') {
         await supabase.from('novels').delete().eq('id', showDeleteConfirm.id);
         setMyNovels(prev => prev.filter(n => n.id !== showDeleteConfirm.id));
      } else {
         await supabase.from('videos').delete().eq('id', showDeleteConfirm.id);
         setMyVideos(prev => prev.filter(v => v.id !== showDeleteConfirm.id));
      }
      alert('删除成功');
    } catch (err) { alert('删除失败'); } finally { setShowDeleteConfirm(null); }
  };

  if (loading && !refreshing) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-blue-600" /></div>;

  const stats = getStats();

  return (
    <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
      {/* 用户资料卡片 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="h-24 md:h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="px-4 md:px-8 pb-6 flex flex-col md:flex-row md:items-end gap-4 md:gap-6 -mt-10 md:-mt-12">
          <div className="h-20 w-20 md:h-32 md:w-32 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden relative group flex-shrink-0">
            <img 
              src={AVATAR_OPTIONS.find(a => a.id === profile?.avatar_id)?.url || AVATAR_OPTIONS[0].url} 
              className="h-full w-full object-cover" 
              alt="avatar"
            />
            <button onClick={fetchUserData} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <RefreshCw className={`text-white h-6 w-6 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">{profile?.username || (isOwnProfile ? '我的个人主页' : '用户主页')}</h1>
              <div className="overflow-x-auto pb-1 max-w-full scrollbar-hide"><UserBadges profile={profile} /></div>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-3 italic leading-relaxed">{profile?.bio || "这个作者很神秘..."}</p>
          </div>
          {isOwnProfile && (
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <Link to="/write/novel" className="justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 text-sm">
                 <BookOpen className="h-4 w-4" /> 创作
              </Link>
              <Link to="/ask-question" className="justify-center px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold flex items-center gap-2 text-sm">
                 <Plus className="h-4 w-4" /> 提问
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 统计卡片 - 手机端双列 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-red-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white">
          <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-500 fill-current mb-2" />
          <div className="text-xl md:text-2xl font-black">{stats.likes}</div>
          <div className="text-[10px] md:text-xs font-bold text-red-400 uppercase">累计获赞</div>
        </div>
        <div className="bg-blue-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white">
          <Eye className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mb-2" />
          <div className="text-xl md:text-2xl font-black">{stats.views}</div>
          <div className="text-[10px] md:text-xs font-bold text-blue-400 uppercase">阅读总量</div>
        </div>
        <div className="bg-purple-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white">
          <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-purple-500 mb-2" />
          <div className="text-xl md:text-2xl font-black">{myQuestions.length}</div>
          <div className="text-[10px] md:text-xs font-bold text-purple-400 uppercase">谷子提问</div>
        </div>
        <div className="bg-emerald-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white">
          <Video className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 mb-2" />
          <div className="text-xl md:text-2xl font-black">{myVideos.length}</div>
          <div className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase">视频作品</div>
        </div>
      </div>

      {/* 标签页切换 - 支持横向滚动 */}
      <div className="w-full overflow-x-auto pb-2 mb-4 md:mb-8 scrollbar-hide">
        <div className="flex items-center p-1 bg-gray-100 rounded-xl w-max md:w-fit">
          <button onClick={() => setActiveTab('questions')} className={`px-6 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-sm transition ${activeTab === 'questions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>提问</button>
          <button onClick={() => setActiveTab('novels')} className={`px-6 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-sm transition ${activeTab === 'novels' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>小说</button>
          <button onClick={() => setActiveTab('videos')} className={`px-6 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-sm transition ${activeTab === 'videos' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>视频</button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'questions' && (
          myQuestions.map(q => (
            <div key={q.id} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 flex justify-between items-start gap-4">
              <Link to={`/question/${q.id}`} className="font-bold text-base md:text-xl hover:text-blue-600 line-clamp-2">{q.title}</Link>
              {isOwnProfile && <button onClick={() => setShowDeleteConfirm({ type: 'question', id: q.id })} className="text-gray-400 hover:text-red-600 flex-shrink-0"><Trash2 className="h-5 w-5" /></button>}
            </div>
          ))
        )}

        {activeTab === 'novels' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {myNovels.map(novel => (
              <div key={novel.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                <Link to={`/novel/${novel.id}`} className="h-40 block bg-gray-100">{novel.cover && <img src={novel.cover} className="w-full h-full object-cover" />}</Link>
                <div className="p-4">
                  <h3 className="font-bold mb-3 truncate">{novel.title}</h3>
                  {isOwnProfile && <button onClick={() => setShowDeleteConfirm({ type: 'novel', id: novel.id })} className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm">删除</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {myVideos.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                <Link to={`/videos/${v.id}`} className="h-40 block relative bg-slate-900">
                  <img src={v.thumbnail_url} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center text-white"><Play /></div>
                </Link>
                <div className="p-4">
                  <h3 className="font-bold mb-3 truncate">{v.title}</h3>
                  {isOwnProfile && <button onClick={() => setShowDeleteConfirm({ type: 'video', id: v.id })} className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm">删除</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-center">确认删除？</h3>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold">取消</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}