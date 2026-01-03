import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import { Search, PlusSquare, PenTool, PlayCircle } from "lucide-react";

// --- 1. 核心基础组件 (静态导入以加快首屏渲染) ---
import UserMenu from "./components/UserMenu";
import DailyRewardModal from "./components/DailyRewardModal";
import Footer from "../components/layout/Footer";
import HomePage from "./pages/HomePage";

// --- 2. 路由懒加载 (Code Splitting 优化加载速度) ---
// 只有当用户访问对应页面时，浏览器才会下载对应的 JS 块
const NovelsPage = lazy(() => import("./pages/NovelsPage"));
const NovelDetailPage = lazy(() => import("./pages/NovelDetailPage"));
const QuestionsPage = lazy(() => import("./pages/QuestionsPage"));
const QuestionDetailPage = lazy(() => import("./pages/QuestionDetailPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));

// 视频板块
const VideosPage = lazy(() => import("./pages/VideosPage"));
const VideoDetailPage = lazy(() => import("./pages/VideoDetailPage"));
const UploadVideoPage = lazy(() => import("./pages/UploadVideoPage"));

// 用户与鉴权
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const UserDetailPage = lazy(() => import("./pages/UserDetailPage"));
const UserSettingsPage = lazy(() => import("./pages/UserSettingsPage"));

// 创作与管理
const WritePage = lazy(() => import("./pages/WritePage"));
const MyDrafts = lazy(() => import("./pages/MyDrafts"));
const AskQuestionPage = lazy(() => import("./pages/AskQuestionPage"));
const MyQuestionsPage = lazy(() => import("./pages/MyQuestionsPage"));
const MyNovelsPage = lazy(() => import("./pages/MyNovelsPage"));
const SecretManager = lazy(() => import("./admin-tools/SecretManager"));

// 其他辅助页面
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));

// --- 3. 性能优化：加载占位符 ---
const PageLoader = () => (
  <div className="flex flex-col justify-center items-center p-20 text-gray-400 animate-pulse">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="font-medium text-sm">职场内容加载中...</p>
  </div>
);

// --- 4. 受保护路由组件 (增强版) ---
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        // 如果 Token 失效或不存在，强制清除本地会话以防止 400 错误循环
        if (error || !user) {
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) return <div className="p-20 text-center text-gray-400">正在验证身份...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <DailyRewardModal />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900 flex flex-col">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              职场Story
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-600 font-bold transition-colors">首页</Link>
              <Link to="/novels" className="hover:text-blue-600 font-bold transition-colors">谷子小说</Link>
              <Link to="/videos" className="hover:text-blue-600 font-bold transition-colors">视频</Link>
              <Link to="/questions" className="hover:text-blue-600 font-bold transition-colors">问答</Link>
            </div>

            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="搜索干货内容..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-64 outline-none transition-all text-sm font-medium"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* 发布动作按钮 */}
            <Link to="/write/video" className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
              <PlayCircle className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-black uppercase">发视频</span>
            </Link>

            <Link to="/write/novel" className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200">
              <PenTool className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-black uppercase">写小说</span>
            </Link>
            
            <Link to="/ask-question" className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
              <PlusSquare className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-black uppercase">提问</span>
            </Link>

            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* 核心内容区 */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* 公开路由 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/novels" element={<NovelsPage />} />
            <Route path="/novel/:id" element={<NovelDetailPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/question/:id" element={<QuestionDetailPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/video/:id" element={<VideoDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/user/:id" element={<UserDetailPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />

            {/* 鉴权路由 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/system-control-gate" element={<SecretManager />} />

            {/* 需要登录的路由 (ProtectedRoute) */}
            <Route path="/profile" element={<ProtectedRoute><UserDetailPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><UserSettingsPage /></ProtectedRoute>} />
            <Route path="/write/novel" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
            <Route path="/write/video" element={<ProtectedRoute><UploadVideoPage /></ProtectedRoute>} />
            <Route path="/my/drafts" element={<ProtectedRoute><MyDrafts /></ProtectedRoute>} />
            <Route path="/my-novels" element={<ProtectedRoute><MyNovelsPage /></ProtectedRoute>} />
            <Route path="/ask-question" element={<ProtectedRoute><AskQuestionPage /></ProtectedRoute>} />
            <Route path="/my-questions" element={<ProtectedRoute><MyQuestionsPage /></ProtectedRoute>} />

            {/* 通配 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;