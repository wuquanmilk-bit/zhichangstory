import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { AVATAR_OPTIONS } from '../../constants/avatars';
import { 
  Settings, User, Mail, Lock, Trash2, Save, ArrowLeft, 
  Loader2, Check, LogOut, Coins, Zap, Edit, Shield, Key, 
  Eye, EyeOff, AlertCircle
} from 'lucide-react';



export default function UserSettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<any>(null);

  // 表单状态
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) fetchUserData();
    else navigate('/login');
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (data) {
        setProfile(data);
        setUsername(data.username || '');
        setBio(data.bio || '');
        setSelectedAvatar(data.avatar_id || 1);
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.from('profiles').update({ 
        username, 
        bio, 
        avatar_id: selectedAvatar 
      }).eq('id', user?.id);
      if (error) throw error;
      setSuccess('基本资料更新成功！');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) { setError(err.message || '更新失败'); }
    finally { setLoading(false); }
  };

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) { setError('两次密码输入不一致'); return; }
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess('密码修改成功！');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) { setError(err.message || '修改失败'); }
    finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('警告：此操作将永久删除您的账户及其所有数据，无法恢复。确定继续吗？')) {
      // 实际注销逻辑通常需要通过 Edge Functions 处理，此处仅模拟
      alert('为了账户安全，请联系管理员或使用自助注销系统。');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center justify-between">
        <Link to={`/user/${user?.id}`} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition">
          <ArrowLeft className="h-5 w-5" /> 返回主页
        </Link>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100">
             LV.{Math.floor((profile?.coins || 0) / 1000) + 1}
           </span>
           <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold border border-amber-100 flex items-center gap-1">
             <Coins className="h-3 w-3" /> 谷子币 {profile?.coins || 0}
           </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. 个性化设置（头像与简介） */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-900"><Edit className="h-5 w-5 text-blue-600" /> 个人资料</h2>
          
          <div className="mb-8">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center sm:text-left">个性头像</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {AVATAR_OPTIONS.map((avatar) => (
                <button key={avatar.id} onClick={() => setSelectedAvatar(avatar.id)} className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all ${selectedAvatar === avatar.id ? 'border-blue-600 scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={avatar.url} className="h-full w-full object-cover" alt="" />
                  {selectedAvatar === avatar.id && <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center"><Check className="h-4 w-4 text-white" /></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">我的昵称</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition font-bold" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">个人说明 (Bio)</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="向大家介绍一下你自己..." className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition font-medium text-gray-600" />
            </div>
            <button onClick={handleUpdateProfile} disabled={loading} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition flex items-center gap-2 shadow-lg shadow-gray-200">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} 保存资料
            </button>
          </div>
        </div>

        {/* 2. 安全设置（密码修改） */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-900"><Lock className="h-5 w-5 text-purple-600" /> 账号安全</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">新密码</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition font-bold" 
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-11 text-gray-400">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">确认新密码</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition font-bold" 
              />
            </div>
          </div>
          <button onClick={handleUpdatePassword} disabled={loading} className="mt-6 px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest hover:border-purple-200 hover:text-purple-600 transition flex items-center gap-2">
            修改密码
          </button>
        </div>

        {/* 3. 危险区域 */}
        <div className="bg-red-50 rounded-[2.5rem] p-8 border border-red-100">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-red-600"><AlertCircle className="h-5 w-5" /> 危险操作</h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => { signOut(); navigate('/'); }} className="px-8 py-4 bg-white text-red-600 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition flex items-center gap-2 border border-red-200">
              <LogOut className="h-5 w-5" /> 退出当前登录
            </button>
            <button onClick={handleDeleteAccount} className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> 注销账户
            </button>
          </div>
        </div>

        {/* 提示反馈 */}
        {success && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl animate-bounce">{success}</div>}
        {error && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl">{error}</div>}
      </div>
    </div>
  );
}