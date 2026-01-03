import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

export default function UploadVideoPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert("请填写标题并选择视频");

    setUploading(true);
    try {
      // 1. 上传到 Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. 获取公开链接
      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);

      // 3. 存入数据库
      const { error: dbError } = await supabase.from('videos').insert([
        { title, video_url: publicUrl, user_id: (await supabase.auth.getUser()).data.user?.id }
      ]);

      if (dbError) throw dbError;
      navigate('/videos');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm">
      <h2 className="text-2xl font-black mb-6">发布新视频</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input 
          type="text" placeholder="视频标题" 
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Upload className="mx-auto h-12 w-12 text-gray-300 mt-4" />
        </div>
        <button 
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? "上传中..." : "立即发布"}
        </button>
      </form>
    </div>
  );
}