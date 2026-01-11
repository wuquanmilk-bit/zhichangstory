import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, Shield, Search, LayoutGrid, Wrench, 
  Sparkles, Trash2, Terminal, FileText, BookOpen, MessageCircle,
  Zap, Crown, Award, BadgeCheck, CheckCircle2, UserCog
} from 'lucide-react';

// 定义用户资料类型接口，统一字段命名
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
  is_verified: boolean; // 实名认证
  is_blue_v: boolean; // 蓝V认证
  is_contract_author: boolean; // 签约作家
  is_vip: boolean; // VIP会员
  is_author: boolean; // 认证作者
  is_moderator: boolean; // 社区版主
  created_at: string;
}

// ==========================================
// 1. 初始化 Supabase
// ==========================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Based on your CSV files
const TABLE = {
  USERS: 'profiles',         // 对应 profiles_rows.csv
  COIN_LOGS: 'coin_logs',    // 对应 coin_logs_rows.csv
  QUESTIONS: 'questions',    // 对应 questions_rows.csv
  ANSWERS: 'answers',        // 对应 answers_rows.csv
  NOVELS: 'novels',          // 对应 novels_rows.csv
};

// 标签渲染组件
const UserBadges = ({ profile }: { profile: Profile | null }) => {
  if (!profile) return null;
  
  return (
    <div className="flex flex-wrap gap-1.5 ml-2">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full border border-gray-200">
        基础会员
      </span>
      
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
        <Zap className="h-3 w-3 fill-current" /> 
        LV.{profile.user_level || Math.floor((profile.exp || 0) / 1000) + 1}
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

const SecretManager = () => {
  // ======================================
  // 状态管理
  // ======================================
  const [mainTab, setMainTab] = useState<'users' | 'content' | 'tools'>('users');
  const [loading, setLoading] = useState(false);
  // --- 拖拽选择功能 ---
  const [dragSelecting, setDragSelecting] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [dragEndIndex, setDragEndIndex] = useState<number | null>(null);
  const [dragSelectedIds, setDragSelectedIds] = useState<string[]>([]);
  // --- 用户管理 ---
  const [activeTab, setActiveTab] = useState<'coins' | 'punish' | 'history' | 'questions' | 'answers' | 'novels' | 'exp'>('coins'); 
  const [users, setUsers] = useState<Profile[]>([]);
  const [targetUser, setTargetUser] = useState<Profile | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [customCoinAmount, setCustomCoinAmount] = useState<number | ''>('');
  const [punishReason, setPunishReason] = useState('');
  const [userRole, setUserRole] = useState('');
  
  // --- 身份与等级系统 ---
  const [userExp, setUserExp] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [isBlueV, setIsBlueV] = useState<boolean>(false); // 蓝V认证
  const [isContractAuthor, setIsContractAuthor] = useState<boolean>(false); // 签约作家
  const [isVIP, setIsVIP] = useState<boolean>(false); // VIP会员
  const [isVerified, setIsVerified] = useState<boolean>(false); // 实名认证
  const [isAuthor, setIsAuthor] = useState<boolean>(false); // 认证作者
  const [isModerator, setIsModerator] = useState<boolean>(false); // 社区版主
  const [customExpAmount, setCustomExpAmount] = useState<number | ''>('');
  
  // --- 历史记录和用户内容 ---
  const [coinLogs, setCoinLogs] = useState<any[]>([]);
  const [userQuestions, setUserQuestions] = useState<any[]>([]);
  const [userNovels, setUserNovels] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<any[]>([]); // 新增评论状态
  const [contentLoading, setContentLoading] = useState(false);

  // --- 内容监控 ---
  const [contentTab, setContentTab] = useState<'questions' | 'answers' | 'novels'>('questions');
  const [allContentData, setAllContentData] = useState<any[]>([]);
  const [allContentLoading, setAllContentLoading] = useState(false);
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // --- 批量工具 ---
  const [toolLog, setToolLog] = useState<string[]>([]);
  const [batchCount, setBatchCount] = useState(5);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [customCategory, setCustomCategory] = useState('fantasy'); 
  const [toolMode, setToolMode] = useState<'custom' | 'batch'>('custom');

  // ======================================
  // 核心逻辑 A：用户管理 (适配 profiles 表)
  // ======================================
  
  const loadAllUsers = async () => {
    setLoading(true);
    try {
      console.log(`正在加载用户表: ${TABLE.USERS}...`);
      
      let query = supabase
        .from(TABLE.USERS)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10000); // 限制100条防止卡顿

      // 搜索逻辑：匹配 username, email 或 nickname
      if (searchKeyword) {
        query = query.or(`username.ilike.%${searchKeyword}%,email.ilike.%${searchKeyword}%,nickname.ilike.%${searchKeyword}%`);
      }

      if (filterStatus === 'banned') query = query.eq('is_banned', true);
      else if (filterStatus === 'muted') query = query.eq('is_muted', true);

      const { data, error } = await query;
      if (error) throw error;
      setUsers(data as Profile[] || []);
    } catch (error: any) {
      console.error('加载用户失败：', error);
      alert(`加载失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (user: Profile) => {
    setTargetUser(user);
    setUserRole(user.role || 'member');
    setPunishReason(user.ban_reason || user.mute_reason || '');
    
    // 加载身份与等级相关数据
    setUserExp(user.exp || 0);
    setUserLevel(user.user_level || 1);
    setIsBlueV(user.is_blue_v || false);
    setIsContractAuthor(user.is_contract_author || false);
    setIsVIP(user.is_vip || false);
    setIsVerified(user.is_verified || false);
    setIsAuthor(user.is_author || false);
    setIsModerator(user.is_moderator || false);
    
    loadCoinLogs(user.id);
    loadUserContent(user.id); // 加载用户发布的内容
  };

  // 加载用户发布的问题、小说和评论
  const loadUserContent = async (userId: string) => {
    setContentLoading(true);
    try {
      // 加载用户的问题
      const { data: questions } = await supabase
        .from(TABLE.QUESTIONS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      // 加载用户的小说
      const { data: novels } = await supabase
        .from(TABLE.NOVELS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // 新增：加载用户的评论
      const { data: answers } = await supabase
        .from(TABLE.ANSWERS)
        .select('*, question:questionid(title)') // 关联查询问题标题
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setUserQuestions(questions || []);
      setUserNovels(novels || []);
      setUserAnswers(answers || []); // 保存评论数据
    } catch (e) { 
      console.error('加载用户内容失败:', e); 
    } finally {
      setContentLoading(false);
    }
  };

  // 加载金币流水
  const loadCoinLogs = async (userId: string) => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from(TABLE.COIN_LOGS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setCoinLogs(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  // 修改金币
  const handleCoinAdjust = async (type: 'add' | 'reduce', amount?: number) => {
    if (!targetUser) return alert('请先选择用户');
    let adjustAmount = amount || (customCoinAmount as number);
    if (!adjustAmount || adjustAmount <= 0) return alert('金额无效');

    setLoading(true);
    try {
      // 1. 计算新余额
      const currentCoins = targetUser.coins || 0;
      const newCoins = type === 'add' ? currentCoins + adjustAmount : Math.max(0, currentCoins - adjustAmount);
      
      // 2. 更新 profiles 表
      const { error: updateError } = await supabase
        .from(TABLE.USERS)
        .update({ coins: newCoins })
        .eq('id', targetUser.id);
      
      if (updateError) throw updateError;

      // 3. 写入 coin_logs 表
      const logAmount = type === 'add' ? adjustAmount : -adjustAmount;
      await supabase.from(TABLE.COIN_LOGS).insert([{
        user_id: targetUser.id,
        amount: logAmount,
        reason: '管理员后台调整',
        created_at: new Date().toISOString()
      }]);

      setTargetUser({ ...targetUser, coins: newCoins });
      loadCoinLogs(targetUser.id);
      alert(`成功！当前金币: ${newCoins}`);
    } catch (e: any) { alert('操作失败: ' + e.message); } finally { setLoading(false); }
  };

  // 修改角色
  const handleUpdateUserRole = async () => {
    if (!targetUser) return;
    setLoading(true);
    try {
      await supabase.from(TABLE.USERS).update({ role: userRole }).eq('id', targetUser.id);
      setTargetUser({ ...targetUser, role: userRole });
      alert('角色更新成功');
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  // 封禁/禁言
  const handlePunishUser = async (punishType: 'ban' | 'mute' | 'unlock') => {
    if (!targetUser) return;
    setLoading(true);
    try {
      let updateData: any = {};
      if (punishType === 'ban') {
        updateData = { is_banned: true, ban_reason: punishReason };
      } else if (punishType === 'mute') {
        updateData = { is_muted: true, mute_reason: punishReason };
      } else {
        updateData = { is_banned: false, is_muted: false, ban_reason: null, mute_reason: null };
      }

      const { error } = await supabase.from(TABLE.USERS).update(updateData).eq('id', targetUser.id);
      if (error) throw error;

      setTargetUser({ ...targetUser, ...updateData });
      alert('操作成功');
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  // ======================================
  // 核心逻辑 A2：经验与身份管理
  // ======================================
  
  // 调整经验值
  const handleExpAdjust = async (type: 'add' | 'reduce', amount?: number) => {
    if (!targetUser) return alert('请先选择用户');
    let adjustAmount = amount || (customExpAmount as number);
    if (!adjustAmount || adjustAmount <= 0) return alert('经验值无效');

    setLoading(true);
    try {
      // 1. 计算新经验值
      const currentExp = targetUser.exp || 0;
      const newExp = type === 'add' ? currentExp + adjustAmount : Math.max(0, currentExp - adjustAmount);
      
      // 2. 计算等级 (每1000经验升一级，与UserBadges保持一致)
      const newLevel = Math.floor(newExp / 1000) + 1;
      
      // 3. 更新用户表
      const { error: updateError } = await supabase
        .from(TABLE.USERS)
        .update({ exp: newExp, user_level: newLevel })
        .eq('id', targetUser.id);
      
      if (updateError) throw updateError;

      // 更新本地状态
      setTargetUser({ ...targetUser, exp: newExp, user_level: newLevel });
      setUserExp(newExp);
      setUserLevel(newLevel);
      alert(`成功！当前经验: ${newExp}, 当前等级: ${newLevel}`);
    } catch (e: any) { alert('操作失败: ' + e.message); } finally { setLoading(false); }
  };

  // 身份状态切换
  const handleToggleIdentity = async (type: 'blueV' | 'contract' | 'vip' | 'verified' | 'author' | 'moderator') => {
    if (!targetUser) return;
    setLoading(true);
    try {
      // 根据类型更新对应字段
      let updateData: any = {};
      let statusText = '';
      
      switch(type) {
        case 'blueV':
          updateData = { is_blue_v: !isBlueV };
          statusText = isBlueV ? '已取消蓝V认证' : '已授予蓝V认证';
          break;
        case 'contract':
          updateData = { is_contract_author: !isContractAuthor };
          statusText = isContractAuthor ? '已取消签约作家身份' : '已授予签约作家身份';
          break;
        case 'vip':
          updateData = { is_vip: !isVIP };
          statusText = isVIP ? '已取消VIP会员' : '已授予VIP会员';
          break;
        case 'verified':
          updateData = { is_verified: !isVerified };
          statusText = isVerified ? '已取消实名认证' : '已授予实名认证';
          break;
        case 'author':
          updateData = { is_author: !isAuthor };
          statusText = isAuthor ? '已取消认证作者' : '已授予认证作者';
          break;
        case 'moderator':
          updateData = { is_moderator: !isModerator };
          statusText = isModerator ? '已取消社区版主' : '已授予社区版主';
          break;
      }

      const { error } = await supabase
        .from(TABLE.USERS)
        .update(updateData)
        .eq('id', targetUser.id);
        
      if (error) throw error;

      // 更新本地状态
      const updatedUser = { ...targetUser, ...updateData };
      setTargetUser(updatedUser);
      
      // 更新对应的状态变量
      switch(type) {
        case 'blueV': setIsBlueV(!isBlueV); break;
        case 'contract': setIsContractAuthor(!isContractAuthor); break;
        case 'vip': setIsVIP(!isVIP); break;
        case 'verified': setIsVerified(!isVerified); break;
        case 'author': setIsAuthor(!isAuthor); break;
        case 'moderator': setIsModerator(!isModerator); break;
      }
      
      alert(`操作成功：${statusText}`);
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  // ======================================
  // 核心逻辑 B：内容监控
  // ======================================
  
  const loadAllContent = async () => {
    setAllContentLoading(true);
    try {
      // 关联查询作者信息
      const { data, error } = await supabase
        .from(contentTab) // questions, answers, novels
        .select(`*, author:user_id(username, email)`) 
        .order('created_at', { ascending: false })
        .limit(5000);
      
      if (error) throw error;
      setAllContentData(data || []);
      setSelectedContentIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error('加载内容失败，尝试无关联加载:', error);
      const { data } = await supabase.from(contentTab).select('*').limit(5000);
      setAllContentData(data || []);
    } finally {
      setAllContentLoading(false);
    }
  };

  const handleDeleteContent = async (id: string, isUserContent?: boolean) => {
    if (!confirm('确定删除？')) return;
    try {
      // 确定要删除的内容类型
      const targetTable = isUserContent 
        ? (activeTab === 'questions' ? TABLE.QUESTIONS : 
           activeTab === 'answers' ? TABLE.ANSWERS :  // 新增评论表判断
           TABLE.NOVELS)
        : contentTab;
      
      await supabase.from(targetTable).delete().eq('id', id);
      
      // 更新对应的数据列表
      if (isUserContent) {
        if (activeTab === 'questions') {
          setUserQuestions(prev => prev.filter(item => item.id !== id));
        } else if (activeTab === 'answers') {  // 新增评论列表更新
          setUserAnswers(prev => prev.filter(item => item.id !== id));
        } else {
          setUserNovels(prev => prev.filter(item => item.id !== id));
        }
      } else {
        setAllContentData(prev => prev.filter(item => item.id !== id));
        setSelectedContentIds(prev => prev.filter(itemId => itemId !== id));
      }
    } catch (e: any) { alert('删除失败: ' + e.message); }
  };

  // 多选删除功能
  const handleSelectContent = (id: string) => {
    setSelectedContentIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };
// 拖拽选择相关函数
const handleMouseDown = (index: number, itemId: string) => {
  setDragSelecting(true);
  setDragStartIndex(index);
  setDragEndIndex(index);
e.stopPropagation(); // 阻止事件冒泡
  
  // 初始化拖拽选择
  setDragSelectedIds([itemId]);
  handleSelectContent(itemId);
};

const handleMouseEnter = (index: number, itemId: string) => {
  if (dragSelecting && dragStartIndex !== null) {
    setDragEndIndex(index);
    
    // 获取开始和结束的索引范围
    const start = Math.min(dragStartIndex, index);
    const end = Math.max(dragStartIndex, index);
    const newSelectedIds = new Set(selectedContentIds);
    
    // 添加范围内的所有项目
    for (let i = start; i <= end; i++) {
      const item = allContentData[i];
      if (item) {
        newSelectedIds.add(item.id);
      }
    }
    
    setSelectedContentIds(Array.from(newSelectedIds));
  }
};

const handleMouseUp = () => {
  setDragSelecting(false);
  setDragStartIndex(null);
  setDragEndIndex(null);
  setDragSelectedIds([]);
};
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContentIds([]);
    } else {
      setSelectedContentIds(allContentData.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleBatchDelete = async () => {
    if (selectedContentIds.length === 0) return alert('请先选择要删除的内容');
    if (!confirm(`确定要删除选中的 ${selectedContentIds.length} 条内容吗？`)) return;
    
    try {
      // 批量删除选中的内容
      const { error } = await supabase
        .from(contentTab)
        .delete()
        .in('id', selectedContentIds);
        
      if (error) throw error;
      
      // 更新本地数据
      setAllContentData(prev => prev.filter(item => !selectedContentIds.includes(item.id)));
      setSelectedContentIds([]);
      setSelectAll(false);
      alert('批量删除成功');
    } catch (e: any) {
      alert('删除失败: ' + e.message);
    }
  };

  // ======================================
  // 核心逻辑 C：批量工具
  // ======================================

  const addLog = (msg: string) => setToolLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const handlePublishQuestion = async () => {
  if (!targetUser) return alert('请先在用户管理选择一个用户！');
  setLoading(true);
  try {
    const count = toolMode === 'custom' ? 1 : batchCount;
    const baseTitle = customTitle || "自动生成问题";
    
    for (let i = 0; i < count; i++) {
      // 移除标题中的编号
      const title = baseTitle; // 直接使用标题，不添加编号
      const content = customContent || `这是自动生成的问题内容`; // 使用输入的内容或默认内容
      
      await supabase.from(TABLE.QUESTIONS).insert([{
        title, 
        content, 
        user_id: targetUser.id,
        created_at: new Date().toISOString()
      }]);
      addLog(`✅ 发布问题: ${title}`);
    }
    // 如果当前在用户的问题标签页，刷新内容
    if (targetUser && activeTab === 'questions') {
      loadUserContent(targetUser.id);
    }
  } catch (e: any) { addLog(`❌ 失败: ${e.message}`); } finally { setLoading(false); }
};

  const handlePublishNovel = async () => {
  if (!targetUser) return alert('请先选择用户！');
  setLoading(true);
  try {
    const count = toolMode === 'custom' ? 1 : batchCount;
    const baseTitle = customTitle || "自动生成小说";
    
    for (let i = 0; i < count; i++) {
      const title = baseTitle; // 直接使用标题，不添加 "Vol.${i}"
      
      // 适配 novels 表字段
      await supabase.from(TABLE.NOVELS).insert([{
        title,
        description: customContent || '自动生成的简介...',
        category: customCategory,
        user_id: targetUser.id,
        is_public: true,
        created_at: new Date().toISOString()
      }]);
      addLog(`✅ 发布小说: ${title}`);
    }
    // 如果当前在用户的小说标签页，刷新内容
    if (targetUser && activeTab === 'novels') {
      loadUserContent(targetUser.id);
    }
  } catch (e: any) { addLog(`❌ 失败: ${e.message}`); } finally { setLoading(false); }
};

  const handleAutoComment = async () => {
  if (!targetUser) return alert('请先选择用户！');
  setLoading(true);
  try {
    const { data: qList } = await supabase.from(TABLE.QUESTIONS).select('id, title').limit(200);
    if (!qList?.length) throw new Error('没有可评论的问题');

    const count = toolMode === 'custom' ? 1 : batchCount;
    for (let i = 0; i < count; i++) {
      const q = qList[Math.floor(Math.random() * qList.length)];
      // 移除内容中的编号，直接使用输入的内容或固定内容
      const content = toolMode === 'custom' ? customContent : `很有意思的观点！`;
      
      // 适配 answers 表：外键是 questionid (全小写)
      await supabase.from(TABLE.ANSWERS).insert([{
        questionid: q.id, 
        content,
        user_id: targetUser.id,
        created_at: new Date().toISOString()
      }]);
      // 在日志中移除编号的显示
      addLog(`💬 评论问题 [${q.title.slice(0,10)}]: ${content}`);
    }
  } catch (e: any) { addLog(`❌ 失败: ${e.message}`); } finally { setLoading(false); }
};

  // ======================================
  // 界面渲染
  // ======================================
  useEffect(() => {
    if (mainTab === 'users') loadAllUsers();
    if (mainTab === 'content') loadAllContent();
  }, [mainTab, searchKeyword, filterStatus, contentTab]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-slate-800">
      
      {/* 顶部导航 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="text-blue-600" /> 超级管理后台 <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">DB适配版</span>
          </h1>
        </div>
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

      {/* ----------------- 模块 1: 用户管理 ----------------- */}
      {mainTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧列表 */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border p-4 h-[calc(100vh-140px)] flex flex-col">
            <div className="mb-4 relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input type="text" placeholder="搜索用户名/邮箱/昵称..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {loading && <div className="text-center text-xs text-gray-400">加载中...</div>}
              {users.map(u => (
                <div key={u.id} onClick={() => handleSelectUser(u)} 
                  className={`p-3 rounded-xl border cursor-pointer ${targetUser?.id === u.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="font-bold text-sm truncate">{u.username || u.email}</div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{u.nickname || '无昵称'}</span>
                    <span className={u.is_banned ? 'text-red-500' : 'text-green-500'}>{u.is_banned ? '已封禁' : '正常'}</span>
                  </div>
                  <UserBadges profile={u} />
                </div>
              ))}
            </div>
          </div>

          {/* 右侧详情 */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border p-6 h-[calc(100vh-140px)] overflow-y-auto">
            {!targetUser ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">请选择用户</div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{targetUser.username}</h2>
                    <p className="text-gray-500 text-sm">{targetUser.email}</p>
                    <div className="mt-2 flex items-center flex-wrap">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">💰 金币: {targetUser.coins}</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Role: {targetUser.role}</span>
                      <UserBadges profile={targetUser} />
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">ID: {targetUser.id}</div>
                </div>

                <div className="flex gap-4 border-b">
                  {['coins', 'punish', 'history', 'questions', 'answers', 'novels', 'exp'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab as 'coins' | 'punish' | 'history' | 'questions' | 'answers' | 'novels' | 'exp')} 
                      className={`pb-2 text-sm font-bold ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                      {tab === 'coins' ? '金币管理' : 
                       tab === 'punish' ? '账号管控' : 
                       tab === 'history' ? '流水记录' :
                       tab === 'questions' ? '发布的问题' : 
                       tab === 'answers' ? '发布的评论' : 
                       tab === 'novels' ? '发布的小说' :
                       tab === 'exp' ? '经验与身份管理' : ''}
                    </button>
                  ))}
                </div>

                {activeTab === 'coins' && (
                  <div className="space-y-4 pt-4">
                     <div className="flex gap-2">
                       {[100, 1000, 5000].map(amt => (
                         <div key={amt} className="flex gap-1">
                           <button onClick={() => handleCoinAdjust('add', amt)} className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded text-sm">+ {amt}</button>
                           <button onClick={() => handleCoinAdjust('reduce', amt)} className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-sm">- {amt}</button>
                         </div>
                       ))}
                     </div>
                     <div className="flex gap-2">
                       <input type="number" placeholder="自定义数量" value={customCoinAmount} onChange={e => setCustomCoinAmount(Number(e.target.value))} className="border p-2 rounded-lg" />
                       <button onClick={() => handleCoinAdjust('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">执行增加</button>
                     </div>
                  </div>
                )}

                {activeTab === 'punish' && (
                  <div className="space-y-4 pt-4">
                    <textarea placeholder="惩罚原因..." value={punishReason} onChange={e => setPunishReason(e.target.value)} className="w-full border p-2 rounded-lg" />
                    <div className="flex gap-2">
                      <button onClick={() => handlePunishUser('ban')} className="bg-red-600 text-white px-4 py-2 rounded-lg">封禁账号</button>
                      <button onClick={() => handlePunishUser('mute')} className="bg-orange-500 text-white px-4 py-2 rounded-lg">禁言账号</button>
                      <button onClick={() => handlePunishUser('unlock')} className="bg-green-600 text-white px-4 py-2 rounded-lg">解除限制</button>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="pt-4">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50"><tr><th className="p-2">数额</th><th className="p-2">原因</th><th className="p-2">时间</th></tr></thead>
                      <tbody>
                        {coinLogs.map((log: any) => (
                          <tr key={log.id} className="border-b">
                            <td className={`p-2 font-bold ${log.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{log.amount > 0 ? '+' : ''}{log.amount}</td>
                            <td className="p-2">{log.reason}</td>
                            <td className="p-2 text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 用户发布的问题 */}
                {activeTab === 'questions' && (
                  <div className="pt-4">
                    {contentLoading ? (
                      <div>加载中...</div>
                    ) : userQuestions.length === 0 ? (
                      <div className="text-gray-500 text-center py-4">该用户未发布任何问题</div>
                    ) : (
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500">
                          <tr>
                            <th className="p-3">标题</th>
                            <th className="p-3">内容</th>
                            <th className="p-3">时间</th>
                            <th className="p-3">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userQuestions.map(d => (
                            <tr key={d.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 truncate max-w-xs">{d.title}</td>
                              <td className="p-3 truncate max-w-md text-gray-500">{d.content?.substring(0, 50)}...</td>
                              <td className="p-3 text-xs text-gray-400">{new Date(d.created_at).toLocaleString()}</td>
                              <td className="p-3">
                                <button 
                                  onClick={() => handleDeleteContent(d.id, true)} 
                                  className="text-red-500"
                                >
                                  <Trash2 size={16}/>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* 用户发布的评论 */}
                {activeTab === 'answers' && (
                  <div className="pt-4">
                    {contentLoading ? (
                      <div>加载中...</div>
                    ) : userAnswers.length === 0 ? (
                      <div className="text-gray-500 text-center py-4">该用户未发布任何评论</div>
                    ) : (
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500">
                          <tr>
                            <th className="p-3">问题</th>
                            <th className="p-3">评论内容</th>
                            <th className="p-3">时间</th>
                            <th className="p-3">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userAnswers.map(d => (
                            <tr key={d.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 truncate max-w-xs text-blue-600">
                                {d.question?.title || '已删除的问题'}
                              </td>
                              <td className="p-3 truncate max-w-md text-gray-500">
                                {d.content?.substring(0, 50)}...
                              </td>
                              <td className="p-3 text-xs text-gray-400">
                                {new Date(d.created_at).toLocaleString()}
                              </td>
                              <td className="p-3">
                                <button 
                                  onClick={() => handleDeleteContent(d.id, true)} 
                                  className="text-red-500"
                                >
                                  <Trash2 size={16}/>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* 用户发布的小说 */}
                {activeTab === 'novels' && (
                  <div className="pt-4">
                    {contentLoading ? (
                      <div>加载中...</div>
                    ) : userNovels.length === 0 ? (
                      <div className="text-gray-500 text-center py-4">该用户未发布任何小说</div>
                    ) : (
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500">
                          <tr>
                            <th className="p-3">标题</th>
                            <th className="p-3">分类</th>
                            <th className="p-3">简介</th>
                            <th className="p-3">时间</th>
                            <th className="p-3">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userNovels.map(d => (
                            <tr key={d.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 truncate max-w-xs">{d.title}</td>
                              <td className="p-3 text-gray-500">{d.category}</td>
                              <td className="p-3 truncate max-w-md text-gray-500">{d.description?.substring(0, 50)}...</td>
                              <td className="p-3 text-xs text-gray-400">{new Date(d.created_at).toLocaleString()}</td>
                              <td className="p-3">
                                <button 
                                  onClick={() => handleDeleteContent(d.id, true)} 
                                  className="text-red-500"
                                >
                                  <Trash2 size={16}/>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* 经验与身份管理标签页 */}
                {activeTab === 'exp' && (
                  <div className="space-y-6 pt-4">
                    {/* 经验值调整区域 */}
                    <div className="border p-4 rounded-lg">
                      <h3 className="text-sm font-bold mb-3">经验值管理</h3>
                      <div className="flex gap-2 flex-wrap">
                        {[10, 50, 100].map(amt => (
                          <div key={amt} className="flex gap-1">
                            <button onClick={() => handleExpAdjust('add', amt)} className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded text-sm">+ {amt} EXP</button>
                            <button onClick={() => handleExpAdjust('reduce', amt)} className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-sm">- {amt} EXP</button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <input 
                          type="number" 
                          placeholder="自定义经验值" 
                          value={customExpAmount} 
                          onChange={e => setCustomExpAmount(Number(e.target.value))} 
                          className="border p-2 rounded-lg" 
                        />
                        <button onClick={() => handleExpAdjust('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">执行增加</button>
                      </div>
                    </div>

                    {/* 身份认证管理 */}
                    <div className="border p-4 rounded-lg">
                      <h3 className="text-sm font-bold mb-3">身份认证管理</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <button 
                          onClick={() => handleToggleIdentity('blueV')}
                          className={`p-3 border rounded-lg text-sm flex items-center gap-2 ${isBlueV ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <BadgeCheck size={16} /> 蓝V认证 {isBlueV ? '✓' : '×'}
                        </button>
                        <button 
                          onClick={() => handleToggleIdentity('contract')}
                          className={`p-3 border rounded-lg text-sm flex items-center gap-2 ${isContractAuthor ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <Award size={16} /> 签约作家 {isContractAuthor ? '✓' : '×'}
                        </button>
                        <button 
                          onClick={() => handleToggleIdentity('vip')}
                          className={`p-3 border rounded-lg text-sm flex items-center gap-2 ${isVIP ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <Crown size={16} /> VIP会员 {isVIP ? '✓' : '×'}
                        </button>
                        <button 
                          onClick={() => handleToggleIdentity('verified')}
                          className={`p-3 border rounded-lg text-sm flex items-center gap-2 ${isVerified ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <CheckCircle2 size={16} /> 实名认证 {isVerified ? '✓' : '×'}
                        </button>
                        <button 
                          onClick={() => handleToggleIdentity('author')}
                          className={`p-3 border rounded-lg text-sm flex items-center gap-2 ${isAuthor ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <UserCog size={16} /> 认证作者 {isAuthor ? '✓' : '×'}
                        </button>
                        <button 
                          onClick={() => handleToggleIdentity('moderator')}
                          className={`p-3 border rounded-lg text-sm flex items-center gap-2 ${isModerator ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <Shield size={16} /> 社区版主 {isModerator ? '✓' : '×'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

{/* ----------------- 模块 2: 内容监控 ----------------- */}
{mainTab === 'content' && (
  <div className="bg-white rounded-2xl shadow-sm border p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <LayoutGrid size={18} /> 内容监控
      </h2>
      <div className="flex gap-2">
        <button 
          onClick={() => setContentTab('questions')} 
          className={`px-3 py-1 text-sm rounded ${contentTab === 'questions' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
        >
          <FileText size={14} className="inline mr-1" /> 问题
        </button>
        <button 
          onClick={() => setContentTab('answers')} 
          className={`px-3 py-1 text-sm rounded ${contentTab === 'answers' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
        >
          <MessageCircle size={14} className="inline mr-1" /> 评论
        </button>
        <button 
          onClick={() => setContentTab('novels')} 
          className={`px-3 py-1 text-sm rounded ${contentTab === 'novels' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
        >
          <BookOpen size={14} className="inline mr-1" /> 小说
        </button>
      </div>
    </div>

    <div className="mb-4 flex justify-between items-center">
      <div className="text-sm text-gray-600">
        提示：按住鼠标左键拖拽可选择多行，点击复选框切换选择状态
      </div>
      <div className="flex gap-2">
        <button 
          onClick={handleSelectAll}
          className="text-xs border px-2 py-1 rounded hover:bg-gray-100"
        >
          {selectAll ? '取消全选' : '全选'} ({allContentData.length})
        </button>
        <button 
          onClick={handleBatchDelete}
          disabled={selectedContentIds.length === 0}
          className={`text-xs border px-2 py-1 rounded ${selectedContentIds.length > 0 ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
        >
          <Trash2 size={14} className="inline mr-1" /> 批量删除 ({selectedContentIds.length})
        </button>
      </div>
    </div>

    {allContentLoading ? (
      <div className="text-center py-8 text-gray-400">加载中...</div>
    ) : allContentData.length === 0 ? (
      <div className="text-center py-8 text-gray-400">没有找到内容</div>
    ) : (
      <div 
        className="overflow-x-auto"
        onMouseLeave={handleMouseUp}
      >
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="p-2 w-10">
                <input 
                  type="checkbox" 
                  checked={selectAll} 
                  onChange={handleSelectAll} 
                  className="cursor-pointer"
                />
              </th>
              {contentTab === 'questions' && (
                <>
                  <th className="p-2">标题</th>
                  <th className="p-2">作者</th>
                  <th className="p-2">时间</th>
                  <th className="p-2">操作</th>
                </>
              )}
              {contentTab === 'answers' && (
                <>
                  <th className="p-2">问题</th>
                  <th className="p-2">评论内容</th>
                  <th className="p-2">作者</th>
                  <th className="p-2">时间</th>
                  <th className="p-2">操作</th>
                </>
              )}
              {contentTab === 'novels' && (
                <>
                  <th className="p-2">标题</th>
                  <th className="p-2">分类</th>
                  <th className="p-2">作者</th>
                  <th className="p-2">时间</th>
                  <th className="p-2">操作</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {allContentData.map((item, index) => (
              <tr 
                key={item.id} 
                className={`border-b hover:bg-gray-50 ${dragSelecting && dragStartIndex !== null && dragEndIndex !== null && index >= Math.min(dragStartIndex, dragEndIndex) && index <= Math.max(dragStartIndex, dragEndIndex) ? 'bg-blue-50' : ''}`}
                onMouseDown={() => handleMouseDown(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseUp={handleMouseUp}
              >
                <td className="p-2">
                  <input 
                    type="checkbox" 
                    checked={selectedContentIds.includes(item.id)} 
                    onChange={() => handleSelectContent(item.id)} 
                    className="cursor-pointer"
                  />
                </td>
                
                {contentTab === 'questions' && (
                  <>
                    <td className="p-2 truncate max-w-md">{item.title}</td>
                    <td className="p-2 text-gray-500">{item.author?.username || '未知用户'}</td>
                    <td className="p-2 text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="p-2">
                      <button onClick={() => handleDeleteContent(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                )}
                
                {contentTab === 'answers' && (
                  <>
                    <td className="p-2 truncate max-w-xs text-blue-600">{item.question?.title || '已删除的问题'}</td>
                    <td className="p-2 truncate max-w-md text-gray-500">{item.content?.substring(0, 50)}...</td>
                    <td className="p-2 text-gray-500">{item.author?.username || '未知用户'}</td>
                    <td className="p-2 text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="p-2">
                      <button onClick={() => handleDeleteContent(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                )}
                
                {contentTab === 'novels' && (
                  <>
                    <td className="p-2 truncate max-w-md">{item.title}</td>
                    <td className="p-2 text-gray-500">{item.category}</td>
                    <td className="p-2 text-gray-500">{item.author?.username || '未知用户'}</td>
                    <td className="p-2 text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</td>
                    <td className="p-2">
                      <button onClick={() => handleDeleteContent(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

      {/* ----------------- 模块 3: 批量工具 ----------------- */}
      {mainTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Terminal size={18} /> 批量操作工具
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setToolMode('custom')} className={`flex-1 py-2 text-sm rounded ${toolMode === 'custom' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100'}`}>自定义内容</button>
                  <button onClick={() => setToolMode('batch')} className={`flex-1 py-2 text-sm rounded ${toolMode === 'batch' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100'}`}>批量生成</button>
                </div>
                
                {toolMode === 'batch' && (
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">生成数量</label>
                    <input 
                      type="number" 
                      value={batchCount} 
                      onChange={e => setBatchCount(Number(e.target.value))} 
                      min="1" max="20" 
                      className="w-full border p-2 rounded-lg text-sm"
                    />
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="text-xs text-gray-500 block mb-1">标题</label>
                  <input 
                    type="text" 
                    value={customTitle} 
                    onChange={e => setCustomTitle(e.target.value)} 
                    placeholder={toolMode === 'custom' ? '输入内容标题' : '批量标题前缀'}
                    className="w-full border p-2 rounded-lg text-sm"
                  />
                </div>
                
                {contentTab === 'novels' && (
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">分类</label>
                    <select 
                      value={customCategory} 
                      onChange={e => setCustomCategory(e.target.value)}
                      className="w-full border p-2 rounded-lg text-sm"
                    >
                      <option value="fantasy">奇幻</option>
                      <option value="sci-fi">科幻</option>
                      <option value="romance">言情</option>
                      <option value="mystery">悬疑</option>
                      <option value="history">历史</option>
                    </select>
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="text-xs text-gray-500 block mb-1">内容</label>
                  <textarea 
                    value={customContent} 
                    onChange={e => setCustomContent(e.target.value)} 
                    placeholder={toolMode === 'custom' ? '输入内容详情' : '批量内容模板'}
                    className="w-full border p-2 rounded-lg text-sm h-24"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={handlePublishQuestion}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <FileText size={16} /> 发布问题
                </button>
                
                <button 
                  onClick={handleAutoComment}
                  className="w-full py-2 bg-green-600 text-white rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} /> 发布评论
                </button>
                
                <button 
                  onClick={handlePublishNovel}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <BookOpen size={16} /> 发布小说
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Terminal size={18} /> 操作日志
            </h2>
            
            <div className="h-[calc(100vh-140px)] overflow-y-auto bg-gray-50 p-4 rounded-lg font-mono text-xs">
              {toolLog.length === 0 ? (
                <div className="text-gray-400 italic">没有操作记录</div>
              ) : (
                toolLog.map((log, i) => (
                  <div key={i} className="py-1 border-b border-gray-100">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretManager;