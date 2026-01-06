import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { AVATAR_OPTIONS } from '../../constants/avatars';
import { 
  User, LogOut, ChevronDown, Settings, Coins, Zap, 
  CheckCircle2, ShieldCheck, BarChart2, Video // 💡 新增引入 Video 图标
} from "lucide-react";

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // 管理员邮箱白名单
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

  // 判断是否为管理员：匹配邮箱或数据库 is_admin 字段
  const isAdmin = profile?.email === ADMIN_EMAIL || profile?.is_admin === true;

  if (authLoading) return <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse"></div>;

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">登录</Link>
        <Link to="/register" className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition">注册</Link>
      </div>
    );
  }

  // 获取头像
  const avatar = AVATAR_OPTIONS.find(a => a.id === profile?.avatar_id) || AVATAR_OPTIONS[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
      >
        <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img src={avatar.url} alt="User Avatar" className="h-full w-full object-cover" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-black text-gray-900 leading-tight">
            {profile?.nickname || profile?.username || "探索者"}
          </p>
          <div className="flex items-center gap-1">
            <Zap className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-bold text-gray-500">LV.{profile?.user_level || 1}</span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <>
          {/* 点击外部关闭 */}
          <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
          
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* 顶栏信息 */}
            <div className="px-5 py-4 border-b border-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-sm font-black text-gray-900">{profile?.coins || 0}</span>
                  <span className="text-[10px] text-gray-400 font-bold ml-1">金币</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart2 className="h-3.5 w-3.5 text-purple-500" />
                  <span className="text-sm font-black text-gray-900">{profile?.exp || 0}</span>
                  <span className="text-[10px] text-gray-400 font-bold ml-1">修为</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {profile?.is_vip && <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[9px] rounded-md font-bold flex items-center gap-0.5"><Zap className="h-2 w-2 fill-amber-600"/>VIP</span>}
                {profile?.is_contract_author && <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[9px] rounded-md font-bold">签约作家</span>}
                {profile?.is_blue_v && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[9px] rounded-md font-bold">蓝V</span>}
              </div>
            </div>

            {/* 功能菜单区 */}
            <div className="py-2 text-xs font-bold text-gray-600">
              {/* 管理员专区 */}
              {isAdmin && (
                <div className="mb-2">
                  <Link to="/system-control-gate" className="flex items-center gap-3 px-5 py-3 bg-slate-50 text-slate-900 hover:bg-slate-100 border-b border-slate-100" onClick={() => setDropdownOpen(false)}>
                    <ShieldCheck className="h-4 w-4 text-blue-600" /> 超级管理后台
                  </Link>
                  {/* 🚀 新增视频管理入口 */}
                  <Link to="/video-manager" className="flex items-center gap-3 px-5 py-3 bg-red-50 text-red-600 hover:bg-red-100 border-b border-slate-100" onClick={() => setDropdownOpen(false)}>
                    <Video className="h-4 w-4 text-red-500" /> 视频资源管理
                  </Link>
                </div>
              )}

              <Link to={`/user/${user.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition" onClick={() => setDropdownOpen(false)}>
                <User className="h-4 w-4 text-gray-400" /> 个人主页
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition" onClick={() => setDropdownOpen(false)}>
                <Settings className="h-4 w-4 text-gray-400" /> 账号设置
              </Link>
            </div>

            <div className="pt-2 mt-2 border-t border-gray-50">
              <button 
                onClick={() => { signOut(); setDropdownOpen(false); navigate("/"); }} 
                className="w-full flex items-center gap-3 px-5 py-4 text-xs font-bold text-red-500 hover:bg-red-50 transition"
              >
                <LogOut className="h-4 w-4" /> 退出登录
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}