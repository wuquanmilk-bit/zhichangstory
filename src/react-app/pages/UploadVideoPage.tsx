import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UploadCloud, FileVideo, Image as ImageIcon, X, 
  CheckCircle2, AlertCircle, Loader2, ShieldCheck 
} from 'lucide-react';

export default function UploadVideoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 状态管理
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // 上传状态
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');

  // 引用
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // 处理视频选择
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 简单校验：最大 500MB
      if (file.size > 500 * 1024 * 1024) {
        alert("视频大小不能超过 500MB");
        return;
      }
      setVideoFile(file);
      // 自动使用文件名作为标题（去掉扩展名）
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // 处理封面选择
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // 核心上传逻辑
  const handleUpload = async () => {
    if (!videoFile || !title || !user) return;

    setIsUploading(true);
    setUploadStep('uploading');
    
    try {
      // 1. 模拟上传进度 (Supabase JS 客户端暂不支持细粒度进度回调，这里做个视觉反馈)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 5;
        });
      }, 500);

      // 2. 上传视频文件
      const videoExt = videoFile.name.split('.').pop();
      const videoFileName = `${user.id}/${Date.now()}_video.${videoExt}`;
      const { data: videoData, error: videoError } = await supabase.storage
        .from('videos') // 确保 Storage 中有 'videos' bucket
        .upload(videoFileName, videoFile);

      if (videoError) throw videoError;

      // 3. 上传封面 (如果有)
      let finalCoverUrl = null;
      if (coverFile) {
        const coverExt = coverFile.name.split('.').pop();
        const coverFileName = `${user.id}/${Date.now()}_cover.${coverExt}`;
        const { data: coverData, error: coverError } = await supabase.storage
          .from('thumbnails') // 确保 Storage 中有 'thumbnails' bucket
          .upload(coverFileName, coverFile);
        
        if (coverError) throw coverError;
        
        const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(coverFileName);
        finalCoverUrl = publicUrl;
      }

      // 获取视频公开链接
      const { data: { publicUrl: videoPublicUrl } } = supabase.storage.from('videos').getPublicUrl(videoFileName);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStep('processing');

      // 4. 写入数据库 (状态设为 pending)
      const { error: dbError } = await supabase.from('videos').insert([
        {
          title,
          description,
          video_url: videoPublicUrl,
          thumbnail_url: finalCoverUrl,
          user_id: user.id,
          status: 'pending', // 💡 关键修改：默认状态为待审核
        }
      ]);

      if (dbError) throw dbError;

      setUploadStep('done');

    } catch (error: any) {
      console.error('上传失败:', error);
      alert(`上传出错: ${error.message}`);
      setIsUploading(false);
      setUploadStep('idle');
      setUploadProgress(0);
    }
  };

  // 如果上传完成，显示成功页面
  if (uploadStep === 'done') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">投稿成功，正在审核中</h2>
        <p className="text-gray-50 mb-8 max-w-md mx-auto">
          您的视频已提交至内容安全中心。审核通常需要 10-30 分钟，支持短视频，通过后将自动展示在视频列表和您的个人主页。
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/videos')} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
            去逛逛视频
          </button>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            继续投稿
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <UploadCloud className="h-8 w-8 text-blue-600" />
            视频投稿
          </h1>
          <p className="text-gray-500 text-sm mt-1">分享你的职场经验，成为意见领袖</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：文件上传区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. 视频上传卡片 */}
          <div className={`
            relative border-2 border-dashed rounded-[32px] transition-all overflow-hidden bg-white
            ${videoFile ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}>
            {!videoFile ? (
              <div 
                onClick={() => videoInputRef.current?.click()}
                className="h-80 flex flex-col items-center justify-center cursor-pointer p-8 text-center"
              >
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <FileVideo className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">点击或拖拽上传视频</h3>
                <p className="text-gray-400 text-sm mb-6">支持 MP4, WebM 格式，最大 500MB</p>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                  选择文件
                </button>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center bg-black relative group">
                <video src={URL.createObjectURL(videoFile)} className="w-full h-full object-contain opacity-80" controls />
                <button 
                  onClick={() => setVideoFile(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  已选择: {videoFile.name}
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={videoInputRef} 
              className="hidden" 
              accept="video/mp4,video/webm" 
              onChange={handleVideoSelect} 
            />
          </div>

          {/* 进度条 (仅上传时显示) */}
          {isUploading && (
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm animate-in slide-in-from-top-2">
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  {uploadStep === 'uploading' ? '正在上传视频文件...' : '正在处理数据...'}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 右侧：元数据表单 */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            视频信息
          </h3>

          <div className="space-y-6">
            {/* 封面上传 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">视频封面</label>
              <div 
                onClick={() => coverInputRef.current?.click()}
                className={`
                  aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all
                  ${coverFile ? 'border-transparent' : 'border-gray-200 hover:border-blue-400 bg-gray-50'}
                `}
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-sm">点击更换封面</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span className="text-xs font-medium">点击上传封面 (16:9)</span>
                  </div>
                )}
                <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverSelect} />
              </div>
            </div>

            {/* 标题 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">视频标题 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="起个吸引人的标题..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900"
                maxLength={50}
              />
              <div className="text-right text-xs text-gray-400 mt-1">{title.length}/50</div>
            </div>

            {/* 简介 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">视频简介</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="介绍一下你的视频内容..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm h-32 resize-none"
                maxLength={200}
              />
            </div>

            {/* 提交按钮 */}
            <button 
              onClick={handleUpload}
              disabled={isUploading || !videoFile || !title}
              className={`
                w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2
                ${isUploading || !videoFile || !title
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200 hover:scale-[1.02] active:scale-95'
                }
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  上传中...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  立即投稿
                </>
              )}
            </button>
            
            <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
              点击投稿即代表您已阅读并同意 <a href="#" className="text-blue-500 hover:underline">《内容创作规范》</a>。<br/>
              请勿上传色情、暴力或侵权内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}