import React, { useState, useEffect } from 'react';
// 💡 关键修正：直接引用你根目录配好的客户端，确保权限和环境一致
import { supabase } from "../../supabaseClient"; 
import { 
  User, Shield, Search, LayoutGrid, Wrench, 
  Sparkles, Trash2, Terminal, FileText, BookOpen, MessageCircle,
  Zap, Crown, Award, BadgeCheck, CheckCircle2, UserCog,
  Video, Play, RefreshCw, ChevronLeft, Clock, Check, X, ExternalLink,
  Coins, TrendingUp, Ban, ShieldAlert, MousePointer2
} from 'lucide-react';

// --- 类型定义 ---
interface Profile {
  id: string;
  username: string;
  email: string;
  nickname?: string;
  coins: number;
  role: string;
  exp: number;
  user_level: number;
  is_banned: boolean;
  is_muted: boolean;
  ban_reason?: string;
  mute_reason?: string;
  is_verified: boolean; 
  is_blue_v: boolean; 
  is_contract_author: boolean; 
  is_vip: boolean; 
  is_author: boolean; 
  is_moderator: boolean; 
  created_at: string;
}

const TABLE = {
  USERS: 'profiles',
  QUESTIONS: 'questions',
  ANSWERS: 'answers',
  NOVELS: 'novels',
  VIDEOS: 'videos'
};

// ==========================================
// 1. 子组件：视频风控审计大屏 (修复更新逻辑)
// ==========================================
const VideoAuditSubPage = ({ onBack }: { onBack: () => void }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const loadVideos = async () => {
    setLoading(true);
    // 💡 获取视频和作者信息
    const { data, error } = await supabase
      .from(TABLE.VIDEOS)
      .select(`*, author:profiles(username)`)
      .order('created_at', { ascending: false });
    
    if (!error && data) setVideos(data);
    setLoading(false);
  };

  useEffect(() => { loadVideos(); }, []);

  // 💡 核心修复：执行数据库更新
  const handleAudit = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { data, error } = await supabase
        .from(TABLE.VIDEOS)
        .update({ status: newStatus }) // 更新状态字段
        .eq('id', id)
        .select();

      if (error) {
        console.error("更新失败:", error);
        alert("审批失败: " + error.message + "\n请检查数据库 RLS 权限是否开启了 UPDATE。");
        return;
      }

      // 实时更新本地 UI 状态
      setVideos(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
      alert(`谷子视频已标记为: ${newStatus === 'approved' ? '批准发布' : '已拦截'}`);
    } catch (err) {
      alert("网络异常，请重试");
    }
  };

  const filtered = videos.filter(v => (v.status || 'pending') === filter);

  return (
    <div className="space-y-6 animate-fadeIn p-4">
      <div className="flex justify-between items-center bg-white p-5 rounded-3xl border shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 font-black hover:text-blue-600 px-6 py-2 bg-slate-50 rounded-2xl transition-all">
          <ChevronLeft size={20} /> 返回后台
        </button>
        <div className="flex bg-slate-100 p-1 rounded-2xl border">
          {(['pending', 'approved', 'rejected'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${filter === s ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>
              {s === 'pending' ? '待审核' : s === 'approved' ? '已通过' : '已拦截'}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="py-20 text-center text-slate-400">正在调取监控...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all group">
              <div className="relative aspect-video bg-slate-900">
                <img src={v.thumbnail_url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <a href={v.video_url} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl"><Play size={24} fill="currentColor"/></div>
                </a>
              </div>
              <div className="p-5">
                <h3 className="font-black text-slate-800 truncate mb-1">{v.title || '未命名视频'}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">作者: {v.author?.username || '匿名侠客'}</p>
                {v.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleAudit(v.id, 'approved')} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700">批准</button>
                    <button onClick={() => handleAudit(v.id, 'rejected')} className="flex-1 py-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-black hover:bg-slate-200">拒绝</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. 主页面逻辑
// ==========================================
const SecretManager = () => {
  const [mainTab, setMainTab] = useState<'users' | 'content' | 'tools' | 'video_audit'>('users');
  const [loading, setLoading] = useState(false);
  
  const [users, setUsers] = useState<Profile[]>([]);
  const [targetUser, setTargetUser] = useState<Profile | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [contentTab, setContentTab] = useState<'questions' | 'answers' | 'novels'>('questions');
  const [contentData, setContentData] = useState<any[]>([]);
  const [toolLog, setToolLog] = useState<string[]>([]);

  // 加载数据
  const loadMainData = async () => {
    setLoading(true);
    if (mainTab === 'users') {
      let query = supabase.from(TABLE.USERS).select('*').order('created_at', { ascending: false });
      if (searchKeyword) query = query.or(`username.ilike.%${searchKeyword}%,email.ilike.%${searchKeyword}%`);
      const { data } = await query.limit(50);
      if (data) setUsers(data as Profile[]);
    } else if (mainTab === 'content') {
      const { data } = await supabase.from(contentTab).select(`*, author:profiles(username)`).order('created_at', { ascending: false }).limit(50);
      if (data) setContentData(data);
    }
    setLoading(false);
  };

  useEffect(() => { loadMainData(); }, [mainTab, contentTab, searchKeyword]);

  const addLog = (msg: string) => setToolLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 50)]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-['PingFang_SC']">
      <div className="max-w-[1600px] mx-auto">
        
        {/* 顶部导航 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">谷子小说 · 核心管理</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SYSTEM CONTROL CENTER</p>
            </div>
          </div>
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {(['users', 'content', 'tools'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                  mainTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'users' ? <User size={16}/> : tab === 'content' ? <LayoutGrid size={16}/> : <Wrench size={16}/>}
                {tab === 'users' ? '用户管理' : tab === 'content' ? '内容监控' : '自动化工具'}
              </button>
            ))}
          </div>
        </div>

        {/* 视频审计快捷入口 */}
        {mainTab === 'content' && (
          <div className="mb-8 p-8 bg-slate-900 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-blue-400 flex items-center gap-3">
                <Video size={28} className="animate-pulse" /> 谷子视频风控审计
              </h2>
              <p className="text-slate-400 mt-2 font-bold">后台检测到待审核视频，需人工介入</p>
            </div>
            <button onClick={() => setMainTab('video_audit')} className="relative z-10 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-900/40">
              进入审计大屏
            </button>
          </div>
        )}

        {/* 模块：用户管理 */}
        {mainTab === 'users' && (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-4 bg-white rounded-[2rem] border p-6 h-[700px] flex flex-col">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                  placeholder="搜索用户..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {users.map(u => (
                  <div key={u.id} onClick={() => setTargetUser(u)} className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${targetUser?.id === u.id ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="font-black text-slate-800">{u.username || '匿名'}</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase">Coins: {u.coins} | Exp: {u.exp}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] border p-10">
              {targetUser ? (
                <div className="animate-fadeIn">
                  <h2 className="text-4xl font-black mb-8">{targetUser.username}</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-xs font-black text-slate-400 mb-4 uppercase">账户金币</p>
                      <div className="flex gap-2">
                        <input id="coinInput" type="number" className="flex-1 p-3 rounded-xl border-none font-bold" placeholder="数量" />
                        <button onClick={async () => {
                          const val = (document.getElementById('coinInput') as HTMLInputElement).value;
                          const { error } = await supabase.from('profiles').update({ coins: targetUser.coins + parseInt(val) }).eq('id', targetUser.id);
                          if(!error) { setTargetUser({...targetUser, coins: targetUser.coins + parseInt(val)}); alert('修改成功'); }
                        }} className="px-6 bg-slate-900 text-white rounded-xl font-bold">充值</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-200 uppercase font-black tracking-widest">请选择一名用户</div>
              )}
            </div>
          </div>
        )}

        {/* 模块：视频审计页面 */}
        {mainTab === 'video_audit' && <VideoAuditSubPage onBack={() => setMainTab('content')} />}

        {/* 模块：内容监控 */}
        {mainTab === 'content' && (
          <div className="bg-white rounded-[2rem] border p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black">谷子小说内容监控</h2>
               <div className="flex bg-slate-100 p-1 rounded-xl">
                 {(['questions', 'answers', 'novels'] as const).map(t => (
                   <button key={t} onClick={() => setContentTab(t)} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${contentTab === t ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>
                     {t === 'questions' ? '问答' : t === 'answers' ? '评论' : '小说'}
                   </button>
                 ))}
               </div>
            </div>
            <div className="overflow-hidden border rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 font-black text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-4">内容内容</th>
                    <th className="px-6 py-4">作者</th>
                    <th className="px-6 py-4 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contentData.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700 truncate max-w-md">{item.title || item.content}</td>
                      <td className="px-6 py-4 font-black text-slate-500">{item.author?.username || '系统'}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={async () => {
                          if(confirm('确定抹除此内容？')) {
                            await supabase.from(contentTab).delete().eq('id', item.id);
                            loadMainData();
                          }
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretManager;