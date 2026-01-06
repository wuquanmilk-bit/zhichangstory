import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../supabaseClient"; 
import { useAuth } from "../../contexts/AuthContext";
import { 
  Shield, Search, Trash2, Video, Play, 
  RefreshCw, ExternalLink, Home, AlertCircle, Eye, ThumbsUp
} from 'lucide-react';

export default function VideoControlCenter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 管理员邮箱白名单（与 UserMenu 一致）
  const ADMIN_EMAIL = "115382613@qq.com";

  useEffect(() => {
    const checkAdmin = async () => {
      // 1. 检查是否登录
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        // 2. 从数据库获取最新权限状态
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin, email')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // 3. 权限判定：邮箱匹配 或 is_admin 字段为 true
        if (profile?.email === ADMIN_EMAIL || profile?.is_admin === true) {
          setIsAuthorized(true);
          fetchVideos();
        } else {
          console.error("权限拒绝: 非管理员尝试访问后台");
          alert("检测到非法访问，您的账号无权进入视频控制中心。");
          navigate('/');
        }
      } catch (err) {
        console.error("认证过程出错:", err);
        navigate('/');
      }
    };

    checkAdmin();
  }, [user, navigate]);

  // 获取视频列表
  const fetchVideos = async () => {
    setLoading(true);
    // 联表查询：获取视频信息及对应的作者昵称
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        profiles:user_id (
          nickname,
          username
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("加载视频失败:", error);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  // 删除视频
  const deleteVideo = async (id: string) => {
    const confirmed = window.confirm('☢️ 危险操作：确定要从服务器永久删除该视频吗？此操作无法撤销。');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // 刷新列表
      setVideos(videos.filter(v => v.id !== id));
      alert("资源已成功抹除。");
    } catch (err) {
      alert("删除失败，请检查控制台。");
      console.error(err);
    }
  };

  // 如果正在验证权限，显示加载态
  if (!isAuthorized && loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="text-red-500 font-mono animate-pulse">AUTHENTICATING_ADMIN_ACCESS...</div>
      </div>
    );
  }

  // 如果未授权，不渲染任何内容（由 useEffect 处理跳转）
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans">
      {/* 顶部控制栏 */}
      <header className="border-b border-red-900/30 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Video className="text-white" size={20} />
            </div>
            <h1 className="font-black text-white tracking-widest text-lg uppercase">Video_Control_Center</h1>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="text-[10px] text-slate-500 hover:text-white flex items-center gap-2 border border-slate-800 px-4 py-2 rounded-full transition-all uppercase tracking-widest"
          >
            <Home size={12} /> Exit_Terminal
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* 检索工具栏 */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="搜索视频标题或作者..."
              className="w-full bg-slate-900/40 border border-slate-800/50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchVideos} 
            className="bg-slate-800/80 hover:bg-slate-700 text-white px-8 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold text-sm border border-slate-700"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> 
            {loading ? "同步中..." : "刷新数据"}
          </button>
        </div>

        {/* 视频网格列表 */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-red-500 font-mono text-xs tracking-[0.2em]">FETCHING_ENCRYPTED_RESOURCES...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.filter(v => (v.title || '').toLowerCase().includes(searchTerm.toLowerCase())).map((vid) => (
              <div key={vid.id} className="group bg-slate-900/20 border border-slate-800/60 rounded-3xl overflow-hidden hover:border-red-600/40 transition-all duration-500 shadow-xl hover:shadow-red-900/5">
                {/* 视频封面预览区 */}
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                  {vid.cover_url ? (
                    <img 
                      src={vid.cover_url} 
                      alt="cover" 
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition duration-700" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-800">
                      <Play size={48} className="group-hover:text-red-600/20 transition duration-500" />
                      <span className="text-[10px] font-mono">NO_PREVIEW</span>
                    </div>
                  )}
                  
                  {/* 悬浮覆盖层 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
                  
                  {/* 统计标签 */}
                  <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                      <Eye size={12} className="text-red-500"/> {vid.views || 0}
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                      <ThumbsUp size={12} className="text-red-500"/> {vid.likes || 0}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-slate-100 text-base mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">
                    {vid.title || '无标题资源'}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-600/20 flex items-center justify-center text-[10px] text-red-500 font-bold">
                        {(vid.profiles?.nickname || vid.profiles?.username || 'S')[0]}
                      </div>
                      <span className="text-xs text-slate-500 truncate max-w-[120px]">
                        {vid.profiles?.nickname || vid.profiles?.username || '系统管理员'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-700">
                      {new Date(vid.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-800/50 pt-5">
                    <a 
                      href={vid.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-500 hover:text-blue-400 flex items-center gap-1.5 font-bold tracking-wider transition-colors"
                    >
                      <ExternalLink size={14} /> 访问源文件
                    </a>
                    
                    <button 
                      onClick={() => deleteVideo(vid.id)}
                      className="p-2.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                      title="永久删除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-slate-900 rounded-[40px]">
            <AlertCircle size={48} className="mx-auto text-slate-800 mb-6" />
            <p className="text-slate-600 font-mono tracking-widest uppercase">No_Video_Resources_Found</p>
          </div>
        )}
      </main>
    </div>
  );
}