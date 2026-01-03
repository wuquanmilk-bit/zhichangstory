import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { AVATAR_OPTIONS } from '../../constants/avatars';
import { 
  User, LogOut, ChevronDown, Settings, Coins, Zap, 
  CheckCircle2, ShieldCheck, BarChart2 // 新增引入修为 图标
} from "lucide-react";

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  
  const ADMIN_EMAIL = "115382613@qq.com";

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) setProfile(data);
  };

  if (authLoading) return <div className="h-8 w-8 rounded-full rounded-full bg-gray-100 animate-pulse"></div>;

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900">登录</Link>
        <Link to="/register" className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl shadow-lg">立即注册</Link>
      </div>
    );
  }

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profile?.avatar_id)?.url || AVATAR_OPTIONS[0].url;
  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div className="relative">
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-1 group">
        <div className="h-8 w-8 rounded-lg border border border-gray-100 overflow-hidden">
          <img src={currentAvatar} alt="avatar" className="h-full w-full object-cover" />
        </div>
        <ChevronDown className={`h-3 w-3 text-gray-400 ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setDropdownOpen(false)} />
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gray-50/50">
              <div className="flex items-center gap-2">
                 <p className="text-sm font-black text-gray-900 truncate">{profile?.username || "谷子书友"}</p>
                 {profile?.is_verified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-current" />}
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-3">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">
                  <Zap className="h-2.5 w-2.5 fill-current" /> LV.{profile?.user_level || 1}
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black">
                  <Coins className="h-2.5 w-2.5" /> {profile?.coins || 0}
                </div>
                {/* 新增修为（exp）显示 */}
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black">
                  <BarChart2 className="h-2.5 w-2.5" /> {profile?.exp || 0} 修为
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                {profile?.is_vip && <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[9px] rounded-md font-bold">VIP</span>}
                {profile?.is_contract_author && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[9px] rounded-md font-bold">签约作家</span>}
                {profile?.is_blue_v && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[9px] rounded-md font-bold">蓝V</span>}
              </div>
            </div>

            <div className="py-2 text-xs font-bold text-gray-600">
              {isAdmin && (
                <Link to="/system-control-gate" className="flex items-center gap-3 px-5 py-3 bg-slate-50 text-slate-900 hover:bg-slate-100 border-b border-slate-100" onClick={() => setDropdownOpen(false)}>
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> 超级管理后台
                </Link>
              )}

              <Link to={`/user/${user.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                <User className="h-4 w-4 text-gray-400" /> 个人主页
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                <Settings className="h-4 w-4 text-gray-400" /> 账号设置
              </Link>
            </div>

            <button 
              onClick={() => { signOut(); setDropdownOpen(false); navigate("/"); }} 
              className="w-full flex items-center gap-3 px-5 py-4 text-red-500 border-t border-gray-50 hover:bg-red-50 text-xs font-black"
            >
              <LogOut className="h-4 w-4" /> 安全退出
            </button>
          </div>
        </>
      )}
    </div>
  );
}