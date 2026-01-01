import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, Shield, Search, LayoutGrid, Wrench, 
  Sparkles, Trash2, Terminal, FileText, BookOpen, MessageCircle 
} from 'lucide-react';

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

const SecretManager = () => {
  // ======================================
  // 状态管理
  // ======================================
  const [mainTab, setMainTab] = useState<'users' | 'content' | 'tools'>('users');
  const [loading, setLoading] = useState(false);

  // --- 用户管理 ---
  const [activeTab, setActiveTab] = useState<'coins' | 'punish' | 'history' | 'questions' | 'novels'>('coins'); 
  const [users, setUsers] = useState<any[]>([]);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [customCoinAmount, setCustomCoinAmount] = useState<number | ''>('');
  const [punishReason, setPunishReason] = useState('');
  const [userRole, setUserRole] = useState('');
  
  // --- 历史记录和用户内容 ---
  const [coinLogs, setCoinLogs] = useState<any[]>([]);
  const [userQuestions, setUserQuestions] = useState<any[]>([]);
  const [userNovels, setUserNovels] = useState<any[]>([]);
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
        .limit(100); // 限制100条防止卡顿

      // 搜索逻辑：匹配 username, email 或 nickname
      if (searchKeyword) {
        query = query.or(`username.ilike.%${searchKeyword}%,email.ilike.%${searchKeyword}%,nickname.ilike.%${searchKeyword}%`);
      }

      if (filterStatus === 'banned') query = query.eq('is_banned', true);
      else if (filterStatus === 'muted') query = query.eq('is_muted', true);

      const { data, error } = await query;
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('加载用户失败：', error);
      alert(`加载失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (user: any) => {
    setTargetUser(user);
    setUserRole(user.role || 'member');
    setPunishReason(user.ban_reason || user.mute_reason || '');
    loadCoinLogs(user.id);
    loadUserContent(user.id); // 加载用户发布的内容
  };

  // 加载用户发布的问题和小说
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

      setUserQuestions(questions || []);
      setUserNovels(novels || []);
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
        .limit(50);
      
      if (error) throw error;
      setAllContentData(data || []);
      setSelectedContentIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error('加载内容失败，尝试无关联加载:', error);
      const { data } = await supabase.from(contentTab).select('*').limit(50);
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
        ? (activeTab === 'questions' ? TABLE.QUESTIONS : TABLE.NOVELS)
        : contentTab;
      
      await supabase.from(targetTable).delete().eq('id', id);
      
      // 更新对应的数据列表
      if (isUserContent) {
        if (activeTab === 'questions') {
          setUserQuestions(prev => prev.filter(item => item.id !== id));
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
        const title = toolMode === 'custom' ? customTitle : `${baseTitle} #${Date.now()}_${i}`;
        const content = toolMode === 'custom' ? customContent : `批量测试内容 ${Math.random()}`;
        
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
        const title = toolMode === 'custom' ? customTitle : `${baseTitle} Vol.${i}`;
        
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
      const { data: qList } = await supabase.from(TABLE.QUESTIONS).select('id, title').limit(20);
      if (!qList?.length) throw new Error('没有可评论的问题');

      const count = toolMode === 'custom' ? 1 : batchCount;
      for (let i = 0; i < count; i++) {
        const q = qList[Math.floor(Math.random() * qList.length)];
        const content = toolMode === 'custom' ? customContent : `很有意思的观点！ #${i}`;
        
        // 适配 answers 表：外键是 questionid (全小写)
        await supabase.from(TABLE.ANSWERS).insert([{
          questionid: q.id, 
          content,
          user_id: targetUser.id,
          created_at: new Date().toISOString()
        }]);
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
                    <div className="mt-2 flex gap-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">💰 金币: {targetUser.coins}</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Role: {targetUser.role}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">ID: {targetUser.id}</div>
                </div>

                <div className="flex gap-4 border-b">
                  {['coins', 'punish', 'history', 'questions', 'novels'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab as 'coins' | 'punish' | 'history' | 'questions' | 'novels')} 
                      className={`pb-2 text-sm font-bold ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                      {tab === 'coins' ? '金币管理' : 
                       tab === 'punish' ? '账号管控' : 
                       tab === 'history' ? '流水记录' :
                       tab === 'questions' ? '发布的问题' : '发布的小说'}
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- 模块 2: 内容监控 ----------------- */}
      {mainTab === 'content' && (
        <div className="bg-white rounded-2xl shadow-sm border p-4">
           <div className="flex justify-between items-center border-b mb-4 pb-4">
             <div className="flex border-b">
               {['questions', 'answers', 'novels'].map((t: any) => (
                 <button key={t} onClick={() => setContentTab(t)} className={`px-4 py-2 ${contentTab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
                   {t.toUpperCase()}
                 </button>
               ))}
             </div>
             {/* 批量删除按钮 */}
             {selectedContentIds.length > 0 && (
               <button 
                 onClick={handleBatchDelete} 
                 className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
               >
                 批量删除 ({selectedContentIds.length})
               </button>
             )}
           </div>
           {allContentLoading ? <div>加载中...</div> : (
             <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-xs text-gray-500">
                 <tr>
                   <th className="p-3 w-10">
                     <input 
                       type="checkbox" 
                       checked={selectAll && allContentData.length > 0} 
                       onChange={handleSelectAll}
                       className="rounded"
                     />
                   </th>
                   <th className="p-3">内容/标题</th>
                   <th className="p-3">作者</th>
                   <th className="p-3">时间</th>
                   <th className="p-3">操作</th>
                 </tr>
               </thead>
               <tbody>
                 {allContentData.map(d => (
                   <tr key={d.id} className="border-b hover:bg-gray-50">
                     <td className="p-3">
                       <input 
                         type="checkbox" 
                         checked={selectedContentIds.includes(d.id)} 
                         onChange={() => handleSelectContent(d.id)}
                         className="rounded"
                       />
                     </td>
                     <td className="p-3 truncate max-w-xs">{d.title || d.content}</td>
                     <td className="p-3 text-gray-500">{d.author?.username || d.author?.email || '未知'}</td>
                     <td className="p-3 text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString()}</td>
                     <td className="p-3">
                       <button onClick={() => handleDeleteContent(d.id)} className="text-red-500">
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

      {/* ----------------- 模块 3: 批量工具 ----------------- */}
      {mainTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className={`p-3 rounded mb-4 text-sm ${targetUser ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                当前执行者: {targetUser ? targetUser.username : '未选择 (请去用户管理选择)'}
              </div>
              
              <div className="space-y-4">
                <div className="flex bg-gray-100 p-1 rounded">
                  <button onClick={() => setToolMode('custom')} className={`flex-1 py-1 rounded ${toolMode === 'custom' ? 'bg-white shadow' : ''}`}>自定义</button>
                  <button onClick={() => setToolMode('batch')} className={`flex-1 py-1 rounded ${toolMode === 'batch' ? 'bg-white shadow' : ''}`}>批量生成</button>
                </div>

                <input type="text" placeholder="标题 / 前缀" value={customTitle} onChange={e => setCustomTitle(e.target.value)} className="w-full border p-2 rounded" />
                <textarea placeholder="内容 / 简介" value={customContent} onChange={e => setCustomContent(e.target.value)} className="w-full border p-2 rounded" rows={3} />
                
                {toolMode === 'batch' && (
                   <div className="flex items-center gap-2">
                     <span className="text-sm">数量: {batchCount}</span>
                     <input type="range" min="1" max="20" value={batchCount} onChange={e => setBatchCount(Number(e.target.value))} className="flex-1" />
                   </div>
                )}

                <button onClick={handlePublishQuestion} disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded flex justify-center items-center gap-2"><FileText size={16}/> 发布提问</button>
                <button onClick={handlePublishNovel} disabled={loading} className="w-full py-2 bg-purple-600 text-white rounded flex justify-center items-center gap-2"><BookOpen size={16}/> 发布小说</button>
                <button onClick={handleAutoComment} disabled={loading} className="w-full py-2 bg-green-600 text-white rounded flex justify-center items-center gap-2"><MessageCircle size={16}/> 发送回答</button>
              </div>
           </div>
           
           <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-4 text-green-400 font-mono text-xs overflow-y-auto h-[500px]">
             {toolLog.map((log, i) => <div key={i} className="border-b border-gray-800 py-1">{log}</div>)}
           </div>
        </div>
      )}
    </div>
  );
};

export default SecretManager;