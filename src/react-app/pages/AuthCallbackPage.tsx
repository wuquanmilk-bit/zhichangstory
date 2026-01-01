// E:\zhihuguali\src\react-app\pages\AuthCallbackPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth回调参数:", Object.fromEntries(searchParams.entries()));
        
        // 检查是否有错误参数
        const errorCode = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        
        if (errorCode) {
          console.error("认证错误:", errorCode, errorDescription);
          setStatus("error");
          setMessage(errorDescription || "认证失败");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }
        
        // 从 URL hash 中获取 token
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const tokenType = hashParams.get("type");
        
        console.log("从Hash中获取的token:", { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          tokenType 
        });
        
        if (accessToken && refreshToken) {
          // 设置会话
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (sessionError) {
            console.error("设置会话失败:", sessionError);
            throw sessionError;
          }
          
          console.log("Session设置成功");
          
          // 根据 token 类型跳转
          if (tokenType === "recovery") {
            // 跳转到重置密码页面
            console.log("跳转到重置密码页面");
            navigate("/reset-password", { replace: true });
          } else {
            // 其他类型跳转到首页
            console.log("跳转到首页");
            navigate("/", { replace: true });
          }
        } else {
          // 如果没有 token，检查是否有 URL 参数
          const token = searchParams.get("token");
          const type = searchParams.get("type");
          
          if (token && type === "recovery") {
            // 验证恢复 token
            const { error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: "recovery",
            });
            
            if (verifyError) {
              console.error("验证token失败:", verifyError);
              throw verifyError;
            }
            
            // 跳转到重置密码页面
            console.log("验证成功，跳转到重置密码页面");
            navigate(`/reset-password?token=${token}&type=${type}`, { replace: true });
          } else {
            // 没有 token，检查当前 session
            console.log("没有token参数，检查当前session");
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error("获取session失败:", sessionError);
              throw sessionError;
            }
            
            if (session) {
              console.log("已登录，跳转到首页");
              navigate("/", { replace: true });
            } else {
              console.log("未登录，跳转到登录页面");
              navigate("/login", { replace: true });
            }
          }
        }
      } catch (error: any) {
        console.error("Auth回调处理错误:", error);
        setStatus("error");
        setMessage(error.message || "处理认证回调时发生错误");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在处理认证...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "success" ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600 h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">成功！</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="animate-pulse text-sm text-gray-500">
              即将自动跳转...
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600 h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">出错了</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回登录
            </button>
          </>
        )}
      </div>
    </div>
  );
}