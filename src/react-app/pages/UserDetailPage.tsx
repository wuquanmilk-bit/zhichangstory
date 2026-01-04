import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { AVATAR_OPTIONS } from '../../constants/avatars';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MessageSquare, BookOpen, ThumbsUp, Eye, Calendar, User, 
  Edit, Loader2, RefreshCw, Trash2, Heart, Plus, Lock, X, 
  CheckCircle2, Award, Zap, ShieldCheck, Coins, Crown, BadgeCheck, UserCog, Shield
} from 'lucide-react';

// --- 统一的标签渲染组件 ---
const UserBadges = ({ profile }: { profile: any }) => {
  if (!profile) return null;
  
  return (
    <div className="flex flex-wrap gap-1.5 ml-2">
      {/* 基础会员/等级 */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200">
        基础会员
      </span>
      
      {/* 经验值标签 - 新增 */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-200">
        <Zap className="h-3 w-3" /> {profile.exp?.toLocaleString() || 0} 修为
      </span>
      
      {/* 金币标签 - 新增 */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-full border border-yellow-200">
        <Coins className="h-3 w-3" /> {profile.coins?.toLocaleString() || 0} 金币
      </span>
      
      {/* 等级标签 */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
        <Zap className="h-3 w-3 fill-current" /> LV.{profile.user_level || Math.floor((profile.exp || 0) / 1000) + 1}
      </span>

      {/* --- 同步 SecretManager 的标签逻辑 --- */}
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
      {profile.is_blue_v && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 text-[10px] font-bold rounded-full border border-blue-200">
          <BadgeCheck className="h-3 w-3" /> 蓝V认证
        </span>
      )}
      {profile.is_verified && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 text-[10px] font-bold rounded-full border border-purple-200">
          <CheckCircle2 className="h-3 w-3" /> 实名认证
        </span>
      )}
      {profile.is_author && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 text-[10px] font-bold rounded-full border border-green-200">
          <UserCog className="h-3 w-3" /> 认证作者
        </span>
      )}
      {profile.is_moderator && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-200">
          <Shield className="h-3 w-3" /> 社区版主
        </span>
      )}
    </div>
  );
};

// 保留你原有类型定义
type Novel = {
  id: string;
  title: string;
  description: string;
  content: string;
  cover: string;
  user_id?: string;
  author?: { id: string }; 
  created_at: string;
  stats?: {
    views: number;
    likes: number;
    chapters: number;
  };
  views?: number;
  likes?: number;
  reads?: number;
  is_public?: boolean;
  category?: string;
  tags?: string[];
};

export default function UserDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: paramUserId } = useParams();
  
  const [profile, setProfile] = useState<any>(null);
  const [myQuestions, setMyQuestions] = useState<any[]>([]);
  const [myNovels, setMyNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'novels'>('questions');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'question' | 'novel', id: string} | null>(null);
  const [novelError, setNovelError] = useState<string | null>(null);
  const [novelLoading, setNovelLoading] = useState(false);

  const isOwnProfile = !paramUserId || (user?.id && paramUserId === user.id);
  const targetUserId = isOwnProfile ? user?.id : paramUserId;

  // 修复后的统计函数
  const getStats = () => {
    if (novelLoading || loading) {
      return { likes: 0, views: 0 };
    }

    const qLikes = (myQuestions || []).reduce((s, q) => s + (Number(q.likes) || Number(q.stats?.likes) || 0), 0);
    const qViews = (myQuestions || []).reduce((s, q) => s + (Number(q.views) || Number(q.stats?.views) || 0), 0);
    
    const nLikes = (myNovels || []).reduce((s, n) => {
      const likeCount = Number(n.likes) || Number(n.stats?.likes) || 0;
      return s + likeCount;
    }, 0);
    
    const nViews = (myNovels || []).reduce((s, n) => {
      const viewCount = Number(n.views) || Number(n.stats?.views) || Number(n.reads) || 0;
      return s + viewCount;
    }, 0);

    return { likes: qLikes + nLikes, views: qViews + nViews };
  };

  useEffect(() => {
    getStats();
  }, [myNovels, myQuestions, novelLoading, loading]);

  const fetchUserData = async () => {
    if (!targetUserId) { 
      setLoading(false); 
      return; 
    }
    
    try {
      setLoading(true);
      setRefreshing(true);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();
      
      if (profileError) {
        setProfile({});
      } else {
        setProfile(profileData || {});
      }

      const { data: qData, error: qError } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (qError) {
        setMyQuestions([]);
      } else {
        const userQuestions = (qData || []).filter(q => {
          if (q.author_id && q.author_id === targetUserId) return true;
          if (q.author && typeof q.author === 'object' && q.author.id === targetUserId) return true;
          if (q.author && typeof q.author === 'string') {
            try {
              const authorObj = JSON.parse(q.author);
              return authorObj.id === targetUserId;
            } catch (e) {
              return false;
            }
          }
          return false;
        });
        setMyQuestions(userQuestions);
      }

      await fetchNovelsByUserId(targetUserId);
      
    } catch (err) {
      console.error('获取用户数据失败:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchNovelsByUserId = async (userId: string) => {
    setNovelLoading(true);
    setNovelError(null);
    try {
      const { data, error } = await supabase
        .from('novels')
        .select('*')
        .or(`author->>id.eq.${userId},user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyNovels(data as Novel[]);
    } catch (error: any) {
      setNovelError(error.message || '获取小说失败');
    } finally {
      setNovelLoading(false);
    }
  };

  useEffect(() => { 
    if (targetUserId) {
      fetchUserData(); 
    }
  }, [targetUserId, user?.id]);

  const handleDeleteQuestion = async () => {
    if (!user?.id || !showDeleteConfirm || showDeleteConfirm.type !== 'question') {
      setShowDeleteConfirm(null);
      return;
    }
    
    const questionId = showDeleteConfirm.id;
    try {
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);
        
      if (deleteError) throw deleteError;
      setMyQuestions(prev => prev.filter(q => q.id !== questionId));
      alert('删除成功');
    } catch (err: any) { 
      alert('删除失败: ' + err.message);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteNovel = async () => {
    if (!user?.id || !showDeleteConfirm || showDeleteConfirm.type !== 'novel') {
      setShowDeleteConfirm(null);
      return;
    }
    
    const novelId = showDeleteConfirm.id;
    try {
      const { error: deleteError } = await supabase
        .from('novels')
        .delete()
        .eq('id', novelId);
        
      if (deleteError) throw deleteError;
      setMyNovels(prev => prev.filter(n => n.id !== novelId));
      alert('删除成功');
    } catch (err: any) { 
      alert('删除失败: ' + err.message);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 用户资料卡片 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="px-8 pb-8 flex flex-col md:flex-row md:items-end gap-6 -mt-12">
          <div className="h-32 w-32 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden relative group">
            <img 
              src={AVATAR_OPTIONS.find(a => a.id === profile?.avatar_id)?.url || AVATAR_OPTIONS[0].url} 
              className="h-full w-full object-cover" 
              alt="avatar"
            />
            <button 
              onClick={fetchUserData} 
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <RefreshCw className={`text-white h-6 w-6 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex-1 mb-2">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-3xl font-black text-gray-900">
                {profile?.username || (isOwnProfile ? '我的个人主页' : '用户主页')}
              </h1>
              
              {/* --- 使用新的标签渲染组件 --- */}
              <UserBadges profile={profile} />
              
            </div>
            <p className="text-gray-600 text-sm font-medium mt-2 mb-3 max-w-2xl italic leading-relaxed">
              {profile?.bio || (isOwnProfile ? "完善你的个人简介，让大家更了解你..." : "这个作者很神秘，还没有写下个人简介...")}
            </p>
            <p className="text-gray-400 font-medium text-[10px] flex items-center gap-1 uppercase tracking-widest">
              ID: {targetUserId?.substring(0, 8)} • {profile?.email}
            </p>
          </div>
          {isOwnProfile && (
            <div className="flex gap-3 mb-2">
              <Link to="/write/novel" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> 开始创作
              </Link>
              <Link to="/ask-question" className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:border-blue-100 hover:text-blue-600 transition flex items-center gap-2">
                <Plus className="h-4 w-4" /> 提个问题
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-50 p-6 rounded-3xl border border-white">
          <Heart className="h-5 w-5 text-red-500 fill-current mb-2" />
          <div className="text-2xl font-black">{stats.likes}</div>
          <div className="text-xs font-bold text-red-400 uppercase">累计获赞</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl border border-white">
          <Eye className="h-5 w-5 text-blue-500 mb-2" />
          <div className="text-2xl font-black">{stats.views}</div>
          <div className="text-xs font-bold text-blue-400 uppercase">阅读总量</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-3xl border border-white">
          <MessageSquare className="h-5 w-5 text-purple-500 mb-2" />
          <div className="text-2xl font-black">{myQuestions.length}</div>
          <div className="text-xs font-bold text-purple-400 uppercase">谷子提问</div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl border border-white">
          <BookOpen className="h-5 w-5 text-emerald-500 mb-2" />
          <div className="text-2xl font-black">{myNovels.length}</div>
          <div className="text-xs font-bold text-emerald-400 uppercase">小说作品</div>
        </div>
      </div>

      {/* 标签页切换 */}
      <div className="flex items-center p-1 bg-gray-100 rounded-2xl w-fit mb-8">
        <button onClick={() => setActiveTab('questions')} className={`px-8 py-2.5 rounded-xl font-bold transition ${activeTab === 'questions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
          {isOwnProfile ? '我的提问' : 'TA 的提问'}
        </button>
        <button onClick={() => setActiveTab('novels')} className={`px-8 py-2.5 rounded-xl font-bold transition ${activeTab === 'novels' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
          {isOwnProfile ? '我的小说' : 'TA 的小说'}
        </button>
      </div>

      {/* 内容区域 */}
      <div className="space-y-4">
        {activeTab === 'questions' ? (
          myQuestions.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-500">暂无提问</h3>
            </div>
          ) : (
            myQuestions.map(q => (
              <div key={q.id} className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600">
                      <Link to={`/question/${q.id}`}>{q.title}</Link>
                    </h3>
                  </div>
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <button onClick={() => setShowDeleteConfirm({ type: 'question', id: q.id })} className="p-2 text-gray-400 hover:text-red-600 rounded-lg">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myNovels.map((novel) => (
              <div key={novel.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition relative">
                <Link to={`/novel/${novel.id}`} className="h-44 bg-gray-100">
                  {novel.cover && <img src={novel.cover} className="w-full h-full object-cover" />}
                </Link>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{novel.title}</h3>
                  <div className="flex gap-2 mt-4">
                    {isOwnProfile && (
                      <button onClick={() => setShowDeleteConfirm({ type: 'novel', id: novel.id })} className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl font-bold">
                        删除
                      </button>
                    )}
                  </div>
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
            <h3 className="text-xl font-bold mb-4">确认删除？</h3>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold">取消</button>
              <button onClick={showDeleteConfirm.type === 'question' ? handleDeleteQuestion : handleDeleteNovel} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}