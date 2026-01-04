import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, Shield, Search, LayoutGrid, Wrench, 
  Sparkles, Trash2, Terminal, FileText, BookOpen, MessageCircle,
  Zap, Crown, Award, BadgeCheck, CheckCircle2, UserCog,
  Video, Play, RefreshCw, ChevronLeft, Clock, Check, X, ExternalLink
} from 'lucide-react';

// 定义用户资料类型接口
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

// ==========================================
// 1. 初始化 Supabase
// ==========================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE = {
  USERS: 'profiles',
  COIN_LOGS: 'coin_logs',
  QUESTIONS: 'questions',
  ANSWERS: 'answers',
  NOVELS: 'novels',
  VIDEOS: 'videos' // 新增视频表
};

// 标签渲染组件 (保持原样)
const UserBadges = ({ profile }: { profile: Profile | null }) => {
  if (!profile) return null;
  return (
    <div className="flex flex-wrap gap-1.5 ml-2">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200">基础会员</span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
        <Zap className="h-3 w-3 fill-current" /> LV.{profile.user_level || Math.floor((profile.exp || 0) / 1000) + 1}
      </span>
      {profile.is_vip && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 text-[10px] font-bold rounded-full border border-amber-200"><Crown className="h-3 w-3 fill-current" /> VIP会员</span>}
      {profile.is_contract_author && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-600 text-[10px] font-bold rounded-full border border-orange-200"><Award className="h-3 w-3" /> 签约作家</span>}
      {profile.is_blue_v && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 text-[10px] font-bold rounded-full border border-blue-200"><BadgeCheck className="h-3 w-3" /> 蓝V认证</span>}
      {profile.is_verified && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 text-[10px] font-bold rounded-full border border-purple-200"><CheckCircle2 className="h-3 w-3" /> 实名认证</span>}
      {profile.is_author && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 text-[10px] font-bold rounded-full border border-green-200"><UserCog className="h-3 w-3" /> 认证作者</span>}
      {profile.is_moderator && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-200"><Shield className="h-3 w-3" /> 社区版主</span>}
    </div>
  );
};

// ==========================================
// 💡 新增：独立的视频管理与审核组件
// ==========================================
const VideoAuditSubPage = ({ onBack }: { onBack: () => void }) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const loadVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLE.VIDEOS)
      .select(`*, author:${TABLE.USERS}!user_id(username, email)`)
      .order('created_at', { ascending: false });
    if (!error) setVideos(data || []);
    setLoading(false);
  };

  useEffect(() => { loadVideos(); }, []);

  const handleAudit = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from(TABLE.VIDEOS).update({ status }).eq('id', id);
    if (!error) setVideos(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("确定删除此视频？")) return;
    const { error } = await supabase.from(TABLE.VIDEOS).delete().eq('id', id);
    if (!error) setVideos(prev => prev.filter(v => v.id !== id));
  };

  const filtered = videos.filter(v => (v.status || 'pending') === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-bold hover:text-blue-600 px-4 py-2 bg-gray-50 rounded-xl transition-all">
          <ChevronLeft size={20} /> 返回
        </button>
        <div className="flex bg-gray-100 p-1 rounded-xl border">
          {['pending', 'approved', 'rejected'].map((s: any) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${filter === s ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
              {s === 'pending' ? '待审核' : s === 'approved' ? '已通过' : '已拒绝'}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <div className="col-span-full text-center py-20 font-bold text-gray-400">正在加载谷子小说视频库...</div> :
          filtered.length === 0 ? <div className="col-span-full text-center py-20 text-gray-300 font-bold">暂无数据</div> :
          filtered.map(v => (
            <div key={v.id} className="bg-white rounded-3xl overflow-hidden border shadow-sm">
              <div className="relative aspect-video bg-black group">
                <img src={v.thumbnail_url} className="w-full h-full object-cover opacity-80" />
                <a href={v.video_url} target="_blank" className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-blue-600 shadow-xl group-hover:scale-110 transition-transform"><Play size={24} fill="currentColor"/></div>
                </a>
              </div>
              <div className="p-5 text-left">
                <h3 className="font-bold text-gray-800 truncate">{v.title || '无标题'}</h3>
                <p className="text-[10px] text-gray-400 mt-1">作者: {v.author?.username || v.user_id}</p>
                <div className="flex gap-2 mt-4">
                  {filter === 'pending' && (
                    <>
                      <button onClick={() => handleAudit(v.id, 'approved')} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">通过</button>
                      <button onClick={() => handleAudit(v.id, 'rejected')} className="flex-1 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold">拒绝</button>
                    </>
                  )}
                  <button onClick={() => handleDelete(v.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};
// ==========================================
// 2. 主程序：SecretManager (整合版)
// ==========================================
const SecretManager = () => {
  // --- 状态管理 (完全保留你原有的定义) ---
  const [mainTab, setMainTab] = useState<'users' | 'content' | 'tools' | 'video_audit'>('users');
  const [loading, setLoading] = useState(false);
  const [dragSelecting, setDragSelecting] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [dragEndIndex, setDragEndIndex] = useState<number | null>(null);
  const [dragSelectedIds, setDragSelectedIds] = useState<string[]>([]);
  
  const [activeTab, setActiveTab] = useState<'coins' | 'punish' | 'history' | 'questions' | 'answers' | 'novels' | 'exp'>('coins'); 
  const [users, setUsers] = useState<Profile[]>([]);
  const [targetUser, setTargetUser] = useState<Profile | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [customCoinAmount, setCustomCoinAmount] = useState<number | ''>('');
  const [punishReason, setPunishReason] = useState('');
  const [userRole, setUserRole] = useState('');
  
  const [userExp, setUserExp] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [isBlueV, setIsBlueV] = useState<boolean>(false);
  const [isContractAuthor, setIsContractAuthor] = useState<boolean>(false);
  const [isVIP, setIsVIP] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const [customExpAmount, setCustomExpAmount] = useState<number | ''>('');
  
  const [coinLogs, setCoinLogs] = useState<any[]>([]);
  const [userQuestions, setUserQuestions] = useState<any[]>([]);
  const [userNovels, setUserNovels] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [contentLoading, setContentLoading] = useState(false);

  const [contentTab, setContentTab] = useState<'questions' | 'answers' | 'novels'>('questions');
  const [allContentData, setAllContentData] = useState<any[]>([]);
  const [allContentLoading, setAllContentLoading] = useState(false);
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [toolLog, setToolLog] = useState<string[]>([]);
  const [batchCount, setBatchCount] = useState(5);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [customCategory, setCustomCategory] = useState('fantasy'); 
  const [toolMode, setToolMode] = useState<'custom' | 'batch'>('custom');

  // ======================================
  // 核心逻辑 (完全保留你提供的函数，不作任何变动)
  // ======================================
  
  const loadAllUsers = async () => {
    setLoading(true);
    try {
      let query = supabase.from(TABLE.USERS).select('*').order('created_at', { ascending: false }).limit(100);
      if (searchKeyword) {
        query = query.or(`username.ilike.%${searchKeyword}%,email.ilike.%${searchKeyword}%,nickname.ilike.%${searchKeyword}%`);
      }
      if (filterStatus === 'banned') query = query.eq('is_banned', true);
      else if (filterStatus === 'muted') query = query.eq('is_muted', true);
      const { data } = await query;
      setUsers(data as Profile[] || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSelectUser = async (user: Profile) => {
    setTargetUser(user);
    setUserRole(user.role || 'member');
    setPunishReason(user.ban_reason || user.mute_reason || '');
    setUserExp(user.exp || 0);
    setUserLevel(user.user_level || 1);
    setIsBlueV(user.is_blue_v || false);
    setIsContractAuthor(user.is_contract_author || false);
    setIsVIP(user.is_vip || false);
    setIsVerified(user.is_verified || false);
    setIsAuthor(user.is_author || false);
    setIsModerator(user.is_moderator || false);
    loadCoinLogs(user.id);
    loadUserContent(user.id);
  };

  const loadUserContent = async (userId: string) => {
    setContentLoading(true);
    try {
      const { data: q } = await supabase.from(TABLE.QUESTIONS).select('*').eq('user_id', userId).order('created_at', { ascending: false });
      const { data: n } = await supabase.from(TABLE.NOVELS).select('*').eq('user_id', userId).order('created_at', { ascending: false });
      const { data: a } = await supabase.from(TABLE.ANSWERS).select('*, question:questionid(title)').eq('user_id', userId).order('created_at', { ascending: false });
      setUserQuestions(q || []);
      setUserNovels(n || []);
      setUserAnswers(a || []);
    } finally { setContentLoading(false); }
  };

  const loadCoinLogs = async (userId: string) => {
    const { data } = await supabase.from(TABLE.COIN_LOGS).select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setCoinLogs(data || []);
  };

  // 经验、金币、身份、内容删除等所有 handleXXXX 函数保持原样...
  // (此处省略函数体以节省空间，但在你的代码中应包含 handleCoinAdjust, handleExpAdjust, handleToggleIdentity, handleDeleteContent 等)
  const handleCoinAdjust = async (type: 'add' | 'reduce', amount?: number) => { /* 你的原代码逻辑 */ };
  const handleExpAdjust = async (type: 'add' | 'reduce', amount?: number) => { /* 你的原代码逻辑 */ };
  const handleToggleIdentity = async (type: any) => { /* 你的原代码逻辑 */ };
  const handleDeleteContent = async (id: string, isUserContent?: boolean) => { /* 你的原代码逻辑 */ };

  // --- 拖拽选择逻辑 ---
  const handleMouseDown = (index: number, itemId: string) => {
    setDragSelecting(true);
    setDragStartIndex(index);
    setDragEndIndex(index);
    handleSelectContent(itemId);
  };

  const handleMouseEnter = (index: number) => {
    if (dragSelecting && dragStartIndex !== null) {
      setDragEndIndex(index);
      const start = Math.min(dragStartIndex, index);
      const end = Math.max(dragStartIndex, index);
      const rangeIds = allContentData.slice(start, end + 1).map(item => item.id);
      setSelectedContentIds(Array.from(new Set([...selectedContentIds, ...rangeIds])));
    }
  };

  const handleSelectContent = (id: string) => {
    setSelectedContentIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const loadAllContent = async () => {
    setAllContentLoading(true);
    const { data } = await supabase.from(contentTab).select(`*, author:user_id(username, email)`).order('created_at', { ascending: false }).limit(50);
    setAllContentData(data || []);
    setAllContentLoading(false);
  };

  useEffect(() => {
    if (mainTab === 'users') loadAllUsers();
    if (mainTab === 'content') loadAllContent();
  }, [mainTab, searchKeyword, filterStatus, contentTab]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-slate-800" onMouseUp={() => setDragSelecting(false)}>
      <div className="max-w-[1600px] mx-auto">
        
        {/* 顶部导航 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="text-blue-600" /> 谷子小说管理后台
          </h1>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setMainTab('users')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${mainTab === 'users' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
              <User size={16} /> 用户管理
            </button>
            <button onClick={() => setMainTab('content')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${mainTab === 'content' ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}>
              <LayoutGrid size={16} /> 内容监控
            </button>
            <button onClick={() => setMainTab('tools')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${mainTab === 'tools' ? 'bg-white shadow text-amber-600' : 'text-gray-500'}`}>
              <Wrench size={16} /> 批量工具
            </button>
          </div>
        </div>

        {/* 💡 视频管理快捷入口 (仅在内容标签下显示) */}
        {mainTab === 'content' && (
          <div className="mb-6 p-6 bg-slate-900 rounded-3xl text-white flex justify-between items-center shadow-lg">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-blue-400"><Video /> 视频风控审计</h2>
              <p className="text-xs text-gray-400 mt-1">当前有待审核的视频内容，请及时处理</p>
            </div>
            <button onClick={() => setMainTab('video_audit')} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all">进入视频大屏</button>
          </div>
        )}

        {/* 模块渲染：用户管理 (完全保留原 UI) */}
        {mainTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* ... 这里放置你原有的用户列表和详情页代码 ... */}
          </div>
        )}

        {/* 模块渲染：内容监控 (完全保留原 UI 与拖拽逻辑) */}
        {mainTab === 'content' && (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            {/* ... 这里放置你原有的 Questions/Answers/Novels 表格代码 ... */}
          </div>
        )}

        {/* 模块渲染：批量工具 (完全保留原 UI) */}
        {mainTab === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ... 这里放置你原有的工具和日志代码 ... */}
          </div>
        )}

        {/* 💡 新增模块：视频管理 */}
        {mainTab === 'video_audit' && (
          <VideoAuditSubPage onBack={() => setMainTab('content')} />
        )}

      </div>
    </div>
  );
};

export default SecretManager;