import React, { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Mail, Lock, User, UserPlus, ArrowRight, CheckCircle, Star, BookOpen, 
  MessageSquare, Send, Shield, Check, X, ExternalLink, Copy, 
  MailOpen, AlertCircle, ChevronRight, CheckCheck, Sparkles, ChevronLeft, ChevronRight as ChevronRightIcon
} from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, loading } = useAuth();
  
  const from = location.state?.from || "/";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  // 新增状态：条款阅读和同意相关
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [currentTermsPage, setCurrentTermsPage] = useState(1);
  const [hasReadThreePages, setHasReadThreePages] = useState(false);
  
  const [error, setError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showAllProviders, setShowAllProviders] = useState(false);

  // 服务条款三页内容
  const termsPages = [
    `
      <h4 class="font-bold text-gray-900 mb-2">服务条款 - 第一页</h4>
      <p class="mb-2">欢迎注册职场Story平台（以下简称"本平台"）。在注册前，请您仔细阅读以下条款。</p>
      <p class="mb-2">1. 您必须年满16周岁才能注册和使用本平台服务。</p>
      <p class="mb-2">2. 您承诺提供真实、准确的注册信息，并对您的账户安全负责。</p>
      <p>3. 您不得利用本平台从事任何违法违规活动，包括但不限于传播不良信息、侵犯他人权益等。</p>
    `,
    `
      <h4 class="font-bold text-gray-900 mb-2">服务条款 - 第二页</h4>
      <p class="mb-2">4. 本平台保留随时修改服务条款的权利，修改后将通过平台公告通知用户。</p>
      <p class="mb-2">5. 用户在本平台发布的内容应遵守知识产权相关法律法规，不得侵犯任何第三方权益。</p>
      <p class="mb-2">6. 本平台对用户发布的内容不承担审核责任，但有权在发现违规内容时进行删除或屏蔽。</p>
      <p>7. 您同意本平台根据业务需要收集和使用您的必要信息，具体请参阅隐私政策。</p>
    `,
    `
      <h4 class="font-bold text-gray-900 mb-2">服务条款 - 第三页</h4>
      <p class="mb-2">8. 您可以随时注销账户，但注销后部分数据可能无法恢复，请谨慎操作。</p>
      <p class="mb-2">9. 本平台提供的服务可能包含第三方链接，对于第三方服务本平台不承担责任。</p>
      <p class="mb-2">10. 您理解并同意，本平台在维护、升级系统时可能会暂停部分服务，并会提前通知。</p>
      <p>11. 本服务条款的最终解释权归职场Story平台所有，如有疑问请联系客服。</p>
    `
  ];

  // 邮箱服务商配置
  const emailProviders = [
    { 
      name: "QQ邮箱", 
      domains: ["qq.com", "vip.qq.com", "foxmail.com"], 
      url: "https://mail.qq.com"
    },
    { 
      name: "163邮箱", 
      domains: ["163.com", "126.com", "yeah.net"], 
      url: "https://mail.163.com"
    },
    { 
      name: "Gmail", 
      domains: ["gmail.com"], 
      url: "https://mail.google.com"
    },
    { 
      name: "Outlook", 
      domains: ["outlook.com", "hotmail.com", "live.com"], 
      url: "https://outlook.live.com"
    },
    { 
      name: "新浪邮箱", 
      domains: ["sina.com", "sina.cn"], 
      url: "https://mail.sina.com.cn"
    },
    { 
      name: "阿里邮箱", 
      domains: ["aliyun.com"], 
      url: "https://mail.aliyun.com"
    }
  ];

  // 获取邮箱域名
  const getEmailDomain = (email: string) => {
    return email.split('@')[1]?.toLowerCase() || '';
  };

  // 根据邮箱获取推荐的服务商
  const getEmailProvider = (email: string) => {
    const domain = getEmailDomain(email);
    return emailProviders.find(provider => 
      provider.domains.some(d => domain.endsWith(d))
    ) || null;
  };

  // 获取邮箱链接
  const getEmailUrl = (email: string) => {
    const provider = getEmailProvider(email);
    if (provider) {
      return provider.url;
    }
    
    // 如果没有匹配的邮箱服务商，使用通用搜索
    const domain = getEmailDomain(email);
    return `https://www.google.com/search?q=${encodeURIComponent(domain)}+邮箱登录`;
  };

  // 条款分页控制
  const nextTermsPage = () => {
    if (currentTermsPage < 3) {
      setCurrentTermsPage(prev => prev + 1);
      // 阅读到第三页时标记为已阅读全部
      if (currentTermsPage === 2) {
        setHasReadThreePages(true);
      }
    }
  };

  const prevTermsPage = () => {
    if (currentTermsPage > 1) {
      setCurrentTermsPage(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // 验证条款阅读和同意状态
    if (!hasReadThreePages) {
      setError("请阅读完所有服务条款内容");
      return;
    }
    
    if (!agreeTerms) {
      setError("请同意服务条款和隐私政策");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    
    try {
      const { error: signUpError } = await signUp(formData.email, formData.password, formData.name);
      if (signUpError) {
        setError(signUpError.message || "注册失败");
      } else {
        setRegisteredEmail(formData.email);
        setIsRegistered(true);
        setResendCountdown(60);
        
        const interval = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      }
    } catch (err) {
      setError("系统繁忙，请稍后再试");
    }
  };

  const handleResendEmail = async () => {
    if (resendCountdown > 0) return;
    
    try {
      // 调用重新发送验证邮件的API
      setResendCountdown(60);
      
      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("验证邮件已重新发送，请查收您的邮箱");
    } catch (err) {
      alert("重新发送失败，请稍后再试");
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(registeredEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleOpenEmail = () => {
    if (!registeredEmail) return;
    
    const emailUrl = getEmailUrl(registeredEmail);
    if (emailUrl) {
      window.open(emailUrl, '_blank');
    }
  };

  const handleCloseVerification = () => {
    navigate("/login", { state: { from, email: registeredEmail }, replace: true });
  };

  const handleBackToRegister = () => {
    setIsRegistered(false);
    setRegisteredEmail("");
  };

  // 获取显示的服务商列表
  const visibleProviders = showAllProviders ? emailProviders : emailProviders.slice(0, 6);

  // 注册成功后的验证界面
  if (isRegistered) {
    const emailProvider = getEmailProvider(registeredEmail);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex justify-center items-center mb-6 relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full"></div>
                <MailOpen className="h-8 w-8 text-blue-600 absolute" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                请验证您的邮箱
              </h2>
              
              <p className="text-gray-600 text-sm mb-6">
                我们已经向您的邮箱发送了一封验证邮件，请前往前往邮箱点击验证链接以激活您的账户。
              </p>
              
              {/* 邮箱卡片 */}
              <div 
                onClick={handleOpenEmail}
                className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">验证邮件已发送至</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-700">{registeredEmail}</span>
                      {emailProvider && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {emailProvider.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-blue-500" />
                </div>
                
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyEmail();
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 flex itemsitems-center gap-1"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="h-4 w-4 text-green-500" />
                        已复制邮箱
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        复制邮箱地址
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* 快捷邮箱链接 */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">常用邮箱直达：</p>
                <div className="grid grid-cols-3 gap-2">
                  {emailProviders.map((provider, index) => (
                    <a
                      key={index}
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex itemsitems-center justify-center p-2 text-sm rounded-lg border ${
                        provider === emailProvider
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {provider.name}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* 重要提示 */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-1">重要提示</p>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li>• 验证链接24小时内有效</li>
                      <li>• 请检查垃圾邮件文件夹</li>
                      <li>• 未验证邮箱将无法正常登录</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="space-y-3">
                <button
                  onClick={handleResendEmail}
                  disabled={resendCountdown > 0}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    resendCountdown > 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {resendCountdown > 0 ? `${resendCountdown}秒后重发` : "重新发送发送验证邮件"}
                </button>
                
                <button
                  onClick={handleCloseVerification}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  已完成验证，前往登录
                </button>
                
                <button
                  onClick={handleBackToRegister}
                  className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  返回修改信息
                </button>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                没有收到邮件？请检查垃圾邮件文件夹，或将 noreply@zhichangstory.com 加入白名单
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 注册表单界面
  return (
    <div className="min-h-screen bg-white flex flex flex-col md:flex-row">
      {/* 左侧：品牌价值展示 */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-12">
            <BookOpen className="h-8 w-8" />
            <span className="text-2xl font-black tracking-tighter">职场Story</span>
          </div>
          
          <h2 className="text-5xl font-black leading-tight mb-8">
            加入我们，<br />
            书写你的你的职场传奇。
          </h2>
          
          <div className="space-y-6">
            {[
              { icon: <Star className="h-6 w-6" />, title: "深度精品小说", desc: "解锁全部职场逆袭连载章节" },
              { icon: <MessageSquare className="h-6 w-6" />, title: "专业问答社区", desc: "与万千千职场精英在线交流" },
              { icon: <CheckCircle className="h-6 w-6" />, title: "独家实战经验", desc: "获取最前沿的行业避坑指南" }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                <div className="bg-white/20 p-2 rounded-lg">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 mt-12 text-white/50 text-sm font-medium">
          © 2025 职场Story · 深度内容驱动成长
        </div>

        {/* 装饰性背景圆圈 */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-blue-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* 右侧：注册表单 */}
      <div className="flex-1 flex itemsitems-center justify-center p-8 bg-gray-50/50">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-gray-900 mb-2">免费创建账号</h2>
            <p className="text-gray-500 font-medium">只需几秒钟，开启你的职场进阶之旅</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-700 text-sm font-bold animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="笔名 / 昵称"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="电子邮箱地址"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white border border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                    placeholder="设置密码"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-4 bg-white border border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                    placeholder="确认密码"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* 服务条款阅读区域 */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3">服务条款阅读</h3>
              
              {/* 条款阅读区域 */}
              <div className="h-40 overflow-auto p-3 bg-white rounded-lg border border-gray-100 mb-3 text-sm text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: termsPages[currentTermsPage - 1] }} />
              </div>
              
              {/* 分页控制 */}
              <div className="flex justify-between items-center">
                <button 
                  onClick={prevTermsPage} 
                  disabled={currentTermsPage === 1}
                  className="text-sm text-blue-600 disabled:text-gray-300 flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </button>
                <span className="text-sm text-gray-500">
                  第 {currentTermsPage}/3 页
                </span>
                <button 
                  onClick={nextTermsPage} 
                  disabled={currentTermsPage === 3}
                  className="text-sm text-blue-600 disabled:text-gray-300 flex items-center gap-1"
                >
                  下一页
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 同意条款勾选框 */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                我已阅读并同意<a href="/terms" className="text-blue-600 hover:underline">服务条款</a>和<a href="/privacy" className="text-blue-600 hover:underline">隐私政策</a>
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    注册后，我们将向您的邮箱发送验证邮件
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    请及时验证，未验证的账户将在7天后被自动清理
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !agreeTerms || !hasReadThreePages}
              className={`w-full flex justify-center items-center py-4 rounded-2xl font-black text-lg transition-all shadow shadow-xl ${
                loading || !agreeTerms || !hasReadThreePages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 active:scale-[0.98]"
              }`}
            >
              {loading ? "正在开启职场之旅..." : <><UserPlus className="h-5 w-5 mr-2" /> 立即加入职场Story</>}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-bold text-sm">
            已经有账号了？{" "}
            <Link 
              to="/login" 
              state={{ from }} 
              className="text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}