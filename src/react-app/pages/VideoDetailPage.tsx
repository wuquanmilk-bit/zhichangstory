import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { User, Send, ChevronLeft } from "lucide-react";

export default function VideoDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideoData();
  }, [id]);

  const fetchVideoData = async () => {
    try {
      // 1. 获取视频及作者信息
      const { data: videoData } = await supabase
        .from('videos')
        .select('*, profiles(username, full_name)')
        .eq('id', id)
        .single();
      
      // 2. 获取评论列表及评论者信息
      const { data: commentData } = await supabase
        .from('video_comments')
        .select('*, profiles(username, full_name)')
        .eq('video_id', id)
        .order('created_at', { ascending: false });

      if (videoData) setVideo(videoData);
      if (commentData) setComments(commentData);
    } catch (err) {
      console.error("加载详情失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("请先登录");

    const { error } = await supabase.from('video_comments').insert([
      { content: newComment, video_id: id, user_id: user.id }
    ]);

    if (!error) {
      setNewComment("");
      fetchVideoData();
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400">加载中...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Link to="/videos" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> 返回视频列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
            <video src={video?.video_url} controls autoPlay className="w-full h-full" />
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100">
            <h1 className="text-2xl font-black text-gray-900">{video?.title}</h1>
            {/* 💡 修正：发布者显示 */}
            <p className="text-gray-500 mt-2 font-medium">
              发布者：{video?.profiles?.username || video?.profiles?.full_name || '匿名'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-[600px] flex flex-col">
          <h3 className="font-bold text-lg mb-4">评论 ({comments.length})</h3>
          <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    {/* 💡 修正：评论者显示 */}
                    <p className="text-xs font-bold text-gray-700">
                      {comment.profiles?.username || comment.profiles?.full_name || '用户'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 ml-2">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendComment} className="relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="说点什么吧..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-xl">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}