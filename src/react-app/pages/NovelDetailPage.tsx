import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMockData } from '../hooks/useMockData';
import { 
  ChevronLeft, Moon, Sun, Type, Heart, 
  Lock, Volume2, Pause, Sparkles, ArrowRight
} from 'lucide-react';

export default function NovelReadingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getNovelById, isLoading, handleLike } = useMockData();

  const checkAuth = () => {
    const hasSupaToken = Object.keys(localStorage).some(key => key.includes('auth-token'));
    return hasSupaToken || !!localStorage.getItem('user');
  };
  
  const [isLoggedIn] = useState(checkAuth());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem(`novel_page_${id}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const toggleSpeech = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }
    const pageText = currentDisplayParagraphs.join(' ');
    const utterance = new SpeechSynthesisUtterance(pageText);
    utterance.lang = 'zh-CN';
    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => synth.cancel();
  }, [currentPage, synth]);

  // 保存阅读页码到本地存储
  useEffect(() => {
    if (id) {
      localStorage.setItem(`novel_page_${id}`, currentPage.toString());
    }
  }, [currentPage, id]);

  const novel = getNovelById(id || '');
  const paragraphsPerPage = 12; 
  const allParagraphs = useMemo(() => {
    if (!novel?.content) return [];
    return novel.content.split('\n').filter((p: string) => p.trim() !== "");
  }, [novel?.content]);

  const totalPages = Math.ceil(allParagraphs.length / paragraphsPerPage);
  const currentDisplayParagraphs = useMemo(() => {
    return allParagraphs.slice(currentPage * paragraphsPerPage, (currentPage + 1) * paragraphsPerPage);
  }, [allParagraphs, currentPage]);

  const totalLikes = (novel?.stats?.likes || 0) + (novel?.likes || 0);

  const formatDate = (dateStr: any) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse text-stone-500">翻开书卷...</div>;
  if (!novel) return <div className="p-20 text-center">暂无内容</div>;

  // 未登录状态的解锁弹窗
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center p-6 overflow-hidden ${isDarkMode ? 'bg-zinc-950' : 'bg-[#f6f1e7]'}`}>
        {/* 背景装饰流光 */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        {/* 核心弹窗容器 */}
        <div className="relative w-full max-w-lg">
          <div className={`backdrop-blur-2xl rounded-[3.5rem] p-12 text-center border shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] 
            ${isDarkMode 
              ? 'bg-zinc-900/40 border-white/10' 
              : 'bg-white/40 border-white/40'}`}>
            
            {/* 图标装饰 */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full" />
              <div className={`relative w-20 h-20 rounded-3xl flex items-center justify-center rotate-3 shadow-2xl 
                ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white text-stone-900'}`}>
                <Lock className="h-9 w-9" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Sparkles className="text-white h-4 w-4 fill-current" />
              </div>
            </div>

            <h2 className={`text-3xl font-serif font-black mb-4 tracking-tighter ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
              余下篇幅 待君开启
            </h2>
            <p className={`text-sm mb-10 leading-relaxed font-medium ${isDarkMode ? 'text-gray-400' : 'text-stone-500'}`}>
               登录后即可解锁后续精彩章节 <br />
               支持 AI 语音朗读，并为您同步阅读足迹
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => navigate('/login', { state: { from: location.pathname } })}
                className="group relative w-full py-5 bg-stone-900 text-white rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  立即登录 <ArrowRight size={20} />
                </span>
              </button>

              <button 
                onClick={() => navigate('/novels')}
                className={`w-full py-4 rounded-2xl font-bold text-xs transition-all opacity-60 hover:opacity-100 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}
              >
                回到藏经阁
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900 text-gray-300' : 'bg-[#f6f1e7] text-gray-800'}`}>
      {/* 顶部工具栏 */}
      <div className={`sticky top-0 z-50 border-b ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/80 border-stone-200'} backdrop-blur-lg`}>
        <div className="max-w-4xl mx-auto py-2 px-4 flex justify-between items-center">
          <button onClick={() => navigate('/novels')} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ChevronLeft />
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                isSpeaking 
                ? 'bg-stone-900 border-stone-900 text-white' 
                : 'bg-white/50 border-stone-300 text-stone-500 hover:text-stone-900'
              }`}
            >
              {isSpeaking ? <Pause size={14} /> : <Volume2 size={14} />}
              <span className="text-[11px] font-black">{isSpeaking ? '停止' : '朗读'}</span>
            </button>

            <button 
              onClick={() => handleLike?.(novel.id, totalLikes, 'novels')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                totalLikes > 0 ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white/50 border-stone-300 text-stone-500 hover:text-rose-500'
              }`}
            >
              <Heart size={14} className={totalLikes > 0 ? 'fill-current' : ''} />
              <span className="text-[11px] font-black">{totalLikes}</span>
            </button>

            <div className="w-px h-4 bg-stone-300 mx-1" />

            <button onClick={() => setFontSize(p => (p >= 26 ? 16 : p + 2))} className="p-2 text-stone-400 hover:text-stone-900">
              <Type size={16} />
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-stone-400 hover:text-stone-900">
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 w-full box-sizing: border-box">
        <header className="mb-12 text-center">
         <h1 
  className="text-3xl font-serif font-black mb-4 leading-tight break-words whitespace-pre-wrap w-full max-w-full"
  style={{
    wordBreak: 'break-all', // 强制任意字符（包括无空格连续字符）换行
    overflowWrap: 'break-word' // 长单词拆分换行，双重保障
  }}
>
  {novel.title}
</h1>
          <p className="text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase">
            第 {currentPage + 1} / {totalPages} 回  |  刊印：{formatDate(novel.created_at)}
          </p>
        </header>

        {/* 文章内容区域 - 严格强制换行，不撑破容器 */}
        <article 
          className="min-h-[50vh] leading-relaxed font-serif text-justify w-full box-sizing: border-box" 
          style={{ 
  fontSize: `${fontSize}px`,
  wordBreak: 'break-all',        // 强制任意字符（包括连续i）换行
  overflowWrap: 'break-word',    // 长单词/URL拆分换行
  whiteSpace: 'pre-wrap',        // 保留原始换行，同时自动适配容器宽度
  maxWidth: '100%',              // 严格限制最大宽度为父容器
  padding: 0,                    // 无额外内边距导致溢出
  margin: '0 auto',              // 修正：值用字符串包裹，补充逗号/分号（这里用逗号，因为是对象属性）
}}
        >
          {currentDisplayParagraphs.map((p, i) => (
            <p key={i} className="mb-8 indent-8 break-words whitespace-pre-wrap w-full">
              {p}
            </p>
          ))}
        </article>

        {/* 分页按钮 */}
        <div className="mt-20 flex items-center justify-between pt-10 border-t border-stone-400/10 w-full">
          <button 
            onClick={() => {
              setCurrentPage(p => Math.max(0, p - 1));
              window.scrollTo(0,0);
            }} 
            disabled={currentPage === 0} 
            className="px-6 py-3 border border-stone-300 rounded-xl font-bold disabled:opacity-20 hover:bg-white transition-all"
          >
            上一回
          </button>
          <button 
            onClick={() => {
              if (currentPage < totalPages - 1) {
                setCurrentPage(p => p + 1);
                window.scrollTo(0,0);
              }
            }} 
            className="px-10 py-3 bg-stone-900 text-white rounded-xl font-bold shadow-xl hover:bg-blue-900 transition-all"
          >
            下一回
          </button>
        </div>
      </div>
    </div>
  );
}