// E:\zhihuguali\src\react-app\pages\ResetPasswordPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Mail, Key } from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ 
    password: "", 
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log("检查认证状态...");
        
        // 获取当前会话
        const { data: { session } } = await supabase.auth.getSession();
        console.log("当前会话:", session);
        
        if (session?.user) {
          console.log("用户已登录，可以重置密码");
          setUserEmail(session.user.email || "");
          setIsChecking(false);
        } else {
          // 检查是否有重置密码的token
          const token = searchParams.get("token");
          const type = searchParams.get("type");
          
          console.log("URL参数 - token:", token, "type:", type);
          
          if (token && type === "recovery") {
            console.log("检测到重置密码token，尝试验证...");
            
            try {
              // 验证恢复 token
              const { error: verifyError } = await supabase.auth.verifyOtp({
                token_hash: token,
                type: "recovery",
              });
              
              if (verifyError) {
                console.error("验证token失败:", verifyError);
                setError("重置链接已过期，请重新申请");
              } else {
                console.log("token验证成功");
                // 验证成功后，应该会自动登录用户
                // 重新检查会话
                const { data: { session: newSession } } = await supabase.auth.getSession();
                if (newSession?.user) {
                  setUserEmail(newSession.user.email || "");
                  console.log("用户已自动登录");
                }
              }
            } catch (err: any) {
              console.error("验证token时出错:", err);
              setError("验证重置链接时发生错误");
            }
          } else {
            // 检查是否在 hash 中有 token
            const hash = window.location.hash.substring(1);
            const hashParams = new URLSearchParams(hash);
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");
            
            if (accessToken && refreshToken) {
              console.log("在hash中发现token，设置会话...");
              try {
                const { error: sessionError } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                });
                
                if (sessionError) {
                  console.error("设置会话失败:", sessionError);
                  setError("认证失败，请重试");
                } else {
                  console.log("会话设置成功");
                  const { data: { session: newSession } } = await supabase.auth.getSession();
                  if (newSession?.user) {
                    setUserEmail(newSession.user.email || "");
                    console.log("用户已登录");
                  }
                }
              } catch (err: any) {
                console.error("设置会话时出错:", err);
                setError("处理认证时发生错误");
              }
            } else {
              console.log("没有有效的认证信息");
              setError("请通过忘记密码链接访问此页面");
            }
          }
        }
      } catch (err: any) {
        console.error("检查认证状态时出错:", err);
        setError("检查认证状态时发生错误");
      } finally {
        setIsChecking(false);
      }
    };

    // 添加对 auth 状态变化的监听
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth状态变化:", event, "Session:", session);
      
      if (event === "PASSWORD_RECOVERY") {
        console.log("进入密码恢复模式");
        if (session?.user) {
          setUserEmail(session.user.email || "");
        }
      } else if (event === "SIGNED_IN") {
        console.log("用户已登录");
        if (session?.user) {
          setUserEmail(session.user.email || "");
        }
      }
    });

    checkAuthState();

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password.length < 6) {
      setError("密码长度至少6位");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setIsLoading(true);

    try {
      console.log("开始更新密码...");
      
      // 更新密码
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (updateError) {
        console.error("更新密码失败:", updateError);
        throw updateError;
      }

      console.log("密码更新成功:", data);
      setSuccess("密码重置成功！正在跳转到登录页面...");
      
      // 等待2秒，然后登出并跳转
      setTimeout(async () => {
        await supabase.auth.signOut();
        
        // 跳转到登录页面
        navigate("/login", { 
          state: { 
            message: "密码已重置，请使用新密码登录"
          } 
        });
      }, 2000);
    } catch (err: any) {
      console.error("重置密码错误:", err);
      
      if (err.message?.includes('Password should be at least 6 characters')) {
        setError("密码长度至少6位");
      } else if (err.message?.includes('New password should be different')) {
        setError("新密码不能与旧密码相同");
      } else if (err.message?.includes('Auth session missing')) {
        setError("会话已过期，请重新获取重置链接");
      } else if (err.message?.includes('User not found')) {
        setError("用户不存在，请重新登录");
      } else {
        setError(`重置密码失败: ${err.message || "请重试"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 检查状态
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证重置链接...</p>
        </div>
      </div>
    );
  }

  // 如果有错误，显示错误页面
  if (error && !userEmail) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600 h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">无法重置密码</h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              前往忘记密码
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              返回登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-green-600 h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">设置新密码</h1>
          <p className="text-gray-500 mt-2">
            {userEmail ? `为 ${userEmail} 设置新密码` : "请输入您的新密码"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2 animate-shake">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">新密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
                placeholder="至少6位字符"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">密码长度至少6个字符</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">确认新密码</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
                placeholder="再次输入新密码"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-black rounded-xl hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                重置中...
              </span>
            ) : "重置密码"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
          <p className="font-semibold mb-1">🔐 密码安全提示：</p>
          <ul className="space-y-1">
            <li>• 使用至少8位字符的密码更安全</li>
            <li>• 包含大小写字母、数字和特殊字符</li>
            <li>• 避免使用生日、电话号码等简单密码</li>
            <li>• 不要在所有网站使用相同密码</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回登录
          </button>
        </div>
      </div>
    </div>
  );
}