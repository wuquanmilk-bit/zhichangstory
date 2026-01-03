import React, { useEffect, useState } from "react";
// 确保路径正确指向 src 目录
import { supabase } from "../../supabaseClient"; 
import { Play, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*, profiles(username, full_name)') // 💡 包含 username 并移除 avatar_url
          .order('created_at', { ascending: false });
        
        if (!error && data) setVideos(data);
      } catch (err) {
        console.error("加载视频失败:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div className="p-20 text-center text-gray-400">视频加载中...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">职场视频</h1>
        <p className="text-gray-500 mt-2">看职场干货，涨实战经验</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div key={video.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
            <div className="relative aspect-video bg-black">
              <video 
                src={video.video_url} 
                className="w-full h-full object-cover opacity-90"
                poster={video.thumbnail_url}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <Link to={`/video/${video.id}`} className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white">
                  <Play fill="currentColor" className="h-8 w-8" />
                </Link>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-gray-900 line-clamp-1 mb-3">{video.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
                {/* 💡 修正：显示“管理员” */}
                <span className="font-medium">
                  {video.profiles?.username || video.profiles?.full_name || '匿名用户'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}