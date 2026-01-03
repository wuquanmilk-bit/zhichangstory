import React, { useEffect, useState } from "react";
// 确保路径正确指向你的 supabase 客户端
import { supabase } from "../../supabaseClient"; 
import { Play, User, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // 💡 核心修正：添加 .eq('status', 'approved') 仅查询审核通过的视频
        const { data, error } = await supabase
          .from('videos')
          .select('*, profiles(username, full_name)') 
          .eq('status', 'approved') 
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setVideos(data);
        }
      } catch (err) {
        console.error("加载视频失败:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-400 font-bold">正在连接视频元宇宙...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <div className="mb-10 mt-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">职场视频</h1>
          <p className="text-gray-500 mt-2 font-medium">看职场干货，涨实战经验</p>
        </div>
        {/* 提示审核机制 */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100">
          <ShieldCheck className="h-4 w-4" />
          全站内容经人工审核后发布
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="py-32 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
          <div className="text-gray-300 mb-4 font-black text-6xl">:)</div>
          <p className="text-gray-400 font-bold text-lg">暂无过审视频，快去发布第一个吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 border border-gray-100"
            >
              {/* 视频封面预览区 */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <video 
                  src={video.video_url} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                  poster={video.thumbnail_url}
                />
                
                {/* 覆盖层：播放按钮 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <Link 
                    to={`/video/${video.id}`} 
                    className="p-5 bg-white/20 backdrop-blur-xl rounded-full text-white transform scale-90 group-hover:scale-100 transition-all duration-300 border border-white/30"
                  >
                    <Play fill="currentColor" className="h-10 w-10" />
                  </Link>
                </div>

                {/* 时长标签（如果有的话，此处为 UI 占位） */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] text-white font-bold">
                   HD
                </div>
              </div>
              
              {/* 视频信息区 */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-4 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-100">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-700">
                        {video.profiles?.username || video.profiles?.full_name || '高级用户'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(video.created_at).toLocaleDateString()} 发布
                      </span>
                    </div>
                  </div>
                  
                  {/* 小标签：谷子小说/职场视频 */}
                  <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg border border-gray-100">
                    视频
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}