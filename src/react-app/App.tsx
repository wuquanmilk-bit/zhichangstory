import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import { Search, PlusSquare, PenTool } from "lucide-react";
import UserMenu from "./components/UserMenu";
import MyDrafts from './pages/MyDrafts';
import DailyRewardModal from "./components/DailyRewardModal"; 
import HomePage from "./pages/HomePage";
import QuestionsPage from "./pages/QuestionsPage";
import QuestionDetailPage from "./pages/QuestionDetailPage"; 
import NovelsPage from "./pages/NovelsPage";
import NovelDetailPage from "./pages/NovelDetailPage";
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import LoginPage from "./pages/LoginPage";         
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserDetailPage from "./pages/UserDetailPage"; 
import WritePage from "./pages/WritePage";
import Footer from "../components/layout/Footer";
import AskQuestionPage from "./pages/AskQuestionPage";
import MyQuestionsPage from "./pages/MyQuestionsPage";
import MyNovelsPage from "./pages/MyNovelsPage";
import SearchPage from "./pages/SearchPage"; 
import UserSettingsPage from "./pages/UserSettingsPage"; 
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

// --- 管理员页面 ---
import SecretManager from "./admin-tools/SecretManager"; 

// 受保护的路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) {
    return <div className="p-20 text-center text-gray-400">系统加载中...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 💡 每日红包组件放在这里，确保全局都能弹出 */}
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
          {/* 左侧：Logo 和导航链接 */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              职场Story
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-600 font-bold transition-colors">首页</Link>
              <Link to="/novels" className="hover:text-blue-600 font-bold transition-colors">谷子小说</Link>
              <Link to="/questions" className="hover:text-blue-600 font-bold transition-colors">问答</Link>
            </div>

            {/* 搜索框 */}
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

          {/* 右侧：操作区 */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* 快捷发布按钮（手机端只显示图标） */}
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

      {/* 主要内容区域 */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/novels" element={<NovelsPage />} />
          <Route path="/novel/:id" element={<NovelDetailPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/question/:id" element={<QuestionDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/user/:id" element={<UserDetailPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/my/drafts" element={<MyDrafts />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />

          {/* 管理员入口 */}
          <Route path="/system-control-gate" element={<SecretManager />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* 受保护路由 */}
          <Route path="/profile" element={<ProtectedRoute><UserDetailPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><UserSettingsPage /></ProtectedRoute>} />
          <Route path="/write/novel" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
          <Route path="/my-novels" element={<ProtectedRoute><MyNovelsPage /></ProtectedRoute>} />
          <Route path="/ask-question" element={<ProtectedRoute><AskQuestionPage /></ProtectedRoute>} />
          <Route path="/my-questions" element={<ProtectedRoute><MyQuestionsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;