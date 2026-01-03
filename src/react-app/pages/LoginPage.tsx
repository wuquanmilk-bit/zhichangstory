import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, BookOpen, Key, Check } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  
  const from = location.state?.from || "/profile";

  // 初始化时从localStorage读取保存的账号密码
  const [formData, setFormData] = useState({
    email: localStorage.getItem('savedEmail') || '',
    password: localStorage.getItem('savedPassword') || ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // 增加记住密码状态，默认根据是否有保存的密码来判断
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('savedEmail'));

  // 登录处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const { error: signInError } = await signIn(formData.email, formData.password);
      if (signInError) {
        setError("邮箱或密码不匹配");
      } else {
        // 根据记住密码选项决定是否保存账号密码
        if (rememberMe) {
          localStorage.setItem('savedEmail', formData.email);
          localStorage.setItem('savedPassword', formData.password);
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError("登录失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
            <BookOpen className="text-white h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">欢迎回来</h1>
          <p className="text-gray-500">登录以继续您的阅读之旅</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">邮箱地址</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">登录密码</label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                <Key className="h-3.5 w-3.5" />
                忘记密码？
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* 新增记住密码选项 */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              className={`w-5 h-5 rounded border flex items-center justify-center ${
                rememberMe 
                  ? 'border-blue-600 bg-blue-600 text-white' 
                  : 'border-gray-300 text-transparent'
              }`}
              onClick={() => setRememberMe(!rememberMe)}
            >
              <Check className="h-3 w-3" />
            </button>
            <label 
              className="ml-2 text-sm text-gray-600 cursor-pointer"
              onClick={() => setRememberMe(!rememberMe)}
            >
              记住账号密码
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-xl hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? "验证中..." : "立即登录"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500">
            还没有账号？{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              免费注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}