import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { AVATAR_OPTIONS } from '../../constants/avatars';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MessageSquare, BookOpen, User, Edit, Trash2, 
  Zap, Shield, Crown, Coins, Star, checkCircle2,
  Play, Video, Feather, CheckCircle // 💡 确保图标齐全
} from 'lucide-react';

// --- 1. 核心：找回你的身份标签系统 ---
const UserBadges = ({ profile }: { profile: any }) => {
  if (!profile) return null;
  return (
    <div className="flex flex-wrap gap-1.5 ml-2 items-center">
      {/* 官方管理员 */}
      {(profile.is_admin || profile.is_super_admin) && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100 shadow-sm">
          <Shield className="h-3 w-3 fill-current" /> 官方管理
        </span>
      )}
      
      {/* 签约作者 */}
      {profile.is_contract_author && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 shadow-sm">
          <Feather className="h-3 w-3" /> 签约作者
        </span>
      )}

      {/* 尊贵会员 */}
      {profile.is_vip && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100 shadow-sm">
          <Crown className="h-3 w-3 fill-current" /> 尊贵会员
        </span>
      )}

      {/* 蓝V认证 */}
      {profile.is_blue_v && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-500 text-[10px] font-bold rounded-full border border-sky-100">
          <CheckCircle className="h-3 w-3" /> 认证专家
        </span>
      )}

      {/* 等级/修为展示 */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full border border-purple-100">
        <Zap className="h-3 w-3" /> Lv.{profile.user_level || 1}
      </span>
    </div>
  );
};

export default function UserDetailPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  
  // 状态定义
  const [profile, setProfile] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [novels, setNovels] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]); // 💡 视频数据
  const [loading, setLoading] = useState(true);
  
  // Tab 定义
  const [activeTab, setActiveTab] = useState<'questions' | 'novels' | 'videos'>('questions');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'question' | 'novel' | 'video', id: string } | null>(null);

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // 1. 获取用户信息
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', id).single();
      setProfile(profileData);

      // 2. 获取数据 (问答、小说、视频)
      const { data: qData } = await supabase.from('questions').select('*').eq('user_id', id).order('created_at', { ascending: false });
      const { data: nData } = await supabase.from('novels').select('*').eq('author_id', id).order('created_at', { ascending: false });
      const { data: vData } = await supabase.from('videos').select('*').eq('user_id', id).order('created_at', { ascending: false });

      setQuestions(qData || []);
      setNovels(nData || []);
      setVideos(vData || []);

    } catch (error) {
      console.error('数据加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 统一删除逻辑 ---
  const handleConfirmDelete = async () => {
    if (!showDeleteConfirm) return;
    const { type, id: targetId } = showDeleteConfirm;

    try {
      // 映射表名
      const table = type === 'question' ? 'questions' : type === 'novel' ? 'novels' : 'videos';
      
      const { error } = await supabase.from(table).delete().eq('id', targetId);
      if (error) throw error;

      // 更新前端状态
      if (type === 'question') setQuestions(prev => prev.filter(q => q.id !== targetId));
      if (type === 'novel') setNovels(prev => prev.filter(n => n.id !== targetId));
      if (type === 'video') setVideos(prev => prev.filter(v => v.id !== targetId));
      
      setShowDeleteConfirm(null);
    } catch (err: any) {
      alert("删除失败: " + err.message);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400">正在读取用户档案...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12">
      {/* --- 顶部个人资料卡片 (恢复金币/修为显示) --- */}
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 mb-8 mt-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl -z-10 opacity-60"></div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* 头像区域 */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl">
              <div className="w-full h-full rounded-[28px] bg-white overflow-hidden border-4 border-white">
                <img 
                  src={AVATAR_OPTIONS.find(a => a.id === profile?.avatar_id)?.url || AVATAR_OPTIONS[0].url} 
                  className="w-full h-full object-cover" 
                  alt="avatar"
                />
              </div>
            </div>
            {/* 恢复：等级标签 */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full border-2 border-white whitespace-nowrap shadow-md">
              Lv.{profile?.user_level || 1}
            </div>
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
              <h1 className="text-3xl font-black text-gray-900">
                {profile?.username || profile?.full_name || '未名用户'}
              </h1>
              {/* 恢复：身份勋章组件 */}
              <UserBadges profile={profile} />
            </div>
            
            <p className="text-gray-500 font-medium mb-6 text-sm leading-relaxed max-w-2xl">
              {profile?.bio || '这家伙很神秘，什么都没写...'}
            </p>
            
            {/* 恢复：数据统计栏 (金币、修为、作品) */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-5 py-3 bg-amber-50 rounded-2xl border border-amber-100 min-w-[100px]">
                <span className="text-amber-600/70 text-[10px] font-bold uppercase block mb-1 flex items-center gap-1">
                  <Coins className="h-3 w-3" /> 金币
                </span>
                <span className="font-black text-amber-900 text-xl">{profile?.coins?.toLocaleString() || 0}</span>
              </div>

              <div className="px-5 py-3 bg-purple-50 rounded-2xl border border-purple-100 min-w-[100px]">
                <span className="text-purple-600/70 text-[10px] font-bold uppercase block mb-1 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> 修为
                </span>
                <span className="font-black text-purple-900 text-xl">{profile?.exp?.toLocaleString() || 0}</span>
              </div>

              <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100 min-w-[100px]">
                <span className="text-gray-400 text-[10px] font-bold uppercase block mb-1 flex items-center gap-1">
                  <Star className="h-3 w-3" /> 创作
                </span>
                <span className="font-black text-gray-900 text-xl">
                  {questions.length + novels.length + videos.length}
                </span>
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <Link to="/settings" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">
              <Edit className="h-4 w-4" /> 资料设置
            </Link>
          )}
        </div>
      </div>

      {/* --- Tab 导航 (增加视频) --- */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'questions', label: '问答', icon: MessageSquare },
          { id: 'novels', label: '谷子小说', icon: BookOpen },
          { id: 'videos', label: '视频', icon: Video }
        ].map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border ${
              activeTab === tab.id 
                ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
                : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- 内容列表区 --- */}
      <div className="min-h-[400px]">
        
        {/* 1. 视频列表 */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
            {videos.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-400">暂无视频作品</div>
            ) : (
              videos.map(video => (
                <div key={video.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 group shadow-sm hover:shadow-lg transition-all">
                  <div className="relative aspect-video bg-black">
                    <video src={video.video_url} className="w-full h-full object-cover opacity-80" />
                    <Link to={`/video/${video.id}`} className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                        <Play className="w-8 h-8 fill-current" />
                      </div>
                    </Link>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-3">{video.title}</h3>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{new Date(video.created_at).toLocaleDateString()}</span>
                      {isOwnProfile && (
                        <button 
                          onClick={() => setShowDeleteConfirm({ type: 'video', id: video.id })}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" /> 删除
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. 小说列表 */}
        {activeTab === 'novels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
            {novels.map(novel => (
              <div key={novel.id} className="bg-white rounded-3xl p-4 border border-gray-100 flex gap-4 hover:shadow-md transition-all">
                <div className="w-20 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {novel.cover && <img src={novel.cover} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <Link to={`/novel/${novel.id}`} className="font-bold text-gray-900 line-clamp-1 hover:text-blue-600 text-lg">
                      {novel.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{novel.description}</p>
                  </div>
                  {isOwnProfile && (
                    <button 
                      onClick={() => setShowDeleteConfirm({ type: 'novel', id: novel.id })}
                      className="self-end text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> 删除
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. 问答列表 */}
        {activeTab === 'questions' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {questions.map(q => (
              <div key={q.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    Q
                  </div>
                  <Link to={`/question/${q.id}`} className="font-bold text-gray-900 hover:text-indigo-600">
                    {q.title}
                  </Link>
                </div>
                {isOwnProfile && (
                  <button onClick={() => setShowDeleteConfirm({ type: 'question', id: q.id })} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- 删除确认弹窗 --- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black mb-2 text-gray-900 text-center">确认删除？</h3>
            <p className="text-gray-500 text-center text-sm mb-8">此操作不可撤销，确认要删除吗？</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)} 
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmDelete} 
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}