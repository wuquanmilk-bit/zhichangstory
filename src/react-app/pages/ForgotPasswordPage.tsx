// E:\zhihuguali\src\react-app\pages\ForgotPasswordPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, ExternalLink, Inbox } from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("请输入有效的邮箱地址");
      setIsLoading(false);
      return;
    }

    try {
      console.log('发送重置密码邮件到:', email);
      
      const siteUrl = window.location.origin;
      console.log('当前站点URL:', siteUrl);
      
      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });

      console.log('发送邮件响应:', { data, error: resetError });

      if (resetError) {
        console.error('发送邮件错误详情:', resetError);
        
        if (resetError.message?.includes('User not found')) {
          setError("该邮箱未注册");
        } else if (resetError.message?.includes('Email rate limit exceeded')) {
          setError("发送邮件过于频繁，请稍后再试");
        } else if (resetError.message?.includes('Email provider is not configured')) {
          setError("邮件服务未配置，请联系管理员");
        } else {
          setError(`发送邮件失败: ${resetError.message || "请稍后重试"}`);
        }
        return;
      }

      console.log('重置邮件发送成功');
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("重置密码错误:", err);
      setError("发送邮件时发生错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 根据邮箱域名获取邮箱登录链接
  const getEmailServiceLink = () => {
    const domain = email.split('@')[1];
    if (!domain) return null;
    
    const serviceMap: Record<string, string> = {
      'gmail.com': 'https://mail.google.com',
      'qq.com': 'https://mail.qq.com',
      '163.com': 'https://mail.163.com',
      '126.com': 'https://mail.126.com',
      'sina.com': 'https://mail.sina.com.cn',
      'sina.cn': 'https://mail.sina.com.cn',
      'outlook.com': 'https://outlook.live.com',
      'hotmail.com': 'https://outlook.live.com',
      'live.com': 'https://outlook.live.com',
      'yahoo.com': 'https://mail.yahoo.com',
      'foxmail.com': 'https://mail.qq.com',
      'aliyun.com': 'https://mail.aliyun.com',
      'yeah.net': 'https://www.yeah.net',
    };
    
    return serviceMap[domain.toLowerCase()] || null;
  };

  const emailServiceLink = getEmailServiceLink();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回登录
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="text-blue-600 h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">重置密码</h1>
          <p className="text-gray-500 mt-2">输入您的邮箱地址，我们将发送重置链接</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2 animate-shake">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-500 h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">邮件已发送！</h2>
            <p className="text-gray-600 mb-6">
              重置链接已发送至 <span className="font-semibold">{email}</span>
              <br />
              <span className="text-sm text-gray-500">
                请查收您的收件箱（包括垃圾邮件文件夹）
              </span>
            </p>
            
            {/* 去邮箱验证的按钮 */}
            {emailServiceLink && (
              <div className="mb-6">
                <a
                  href={emailServiceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Inbox className="h-5 w-5" />
                  立即去邮箱验证
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-xs text-gray-500 mt-2">
                  点击后会在新窗口打开邮箱登录页面
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Link
                to="/login"
                className="inline-block w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                返回登录
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                  setError("");
                }}
                className="inline-block w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                重新发送
              </button>
            </div>
            <div className="mt-6 p-3 bg-blue-50 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-blue-800 mb-1">📧 没收到邮件？</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 检查垃圾邮件/广告邮件文件夹</li>
                <li>• 确认邮箱地址是否正确</li>
                <li>• 等待1-5分钟后重试</li>
                <li>• 如果问题持续，请检查邮箱服务是否正常</li>
              </ul>
              {!emailServiceLink && (
                <div className="mt-2">
                  <p className="text-xs text-blue-700">请手动访问您的邮箱服务商网站</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
                  placeholder="请输入您注册时使用的邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  disabled={isLoading}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                请确保邮箱地址与注册时使用的一致
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-xl hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  发送中...
                </span>
              ) : "发送重置链接"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            遇到问题？{" "}
            <a 
              href="mailto:admin@zhihuguali.com" 
              className="text-blue-600 font-medium hover:underline"
            >
              联系管理员
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}