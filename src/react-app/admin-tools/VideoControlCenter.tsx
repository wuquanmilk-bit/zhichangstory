import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient"; 
import { 
  Trash2, Plus, Save, RefreshCw, Search, X, Check,
  ChevronLeft, Play, ExternalLink, AlertCircle
} from 'lucide-react';

// 复用现有类型定义，保持和你代码库一致
interface Video {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  author?: {
    username: string;
  };
}

// 简化版视频管理+审核中心
const SimpleVideoManager = () => {
  // 核心状态
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [newVideo, setNewVideo] = useState<Partial<Video>>({
    title: '',
    video_url: '',
    thumbnail_url: '',
    status: 'pending'
  });
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // 加载所有视频（关联作者信息，和你现有代码逻辑一致）
  const loadAllVideos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('videos')
        .select(`*, author:profiles(username)`)
        .order('created_at', { ascending: false });

      // 状态过滤
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('加载视频失败:', error);
      alert('加载视频失败，请检查网络或数据库连接');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadAllVideos();
  }, [filterStatus]);

  // 搜索+状态双重过滤
  const filteredVideos = videos.filter(video => 
    video.title?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 选择/取消选择视频
  const toggleVideoSelection = (id: string) => {
    setSelectedVideos(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    setSelectedVideos(prev => 
      prev.length === filteredVideos.length 
        ? [] 
        : filteredVideos.map(v => v.id)
    );
  };

  // 批量删除
  const batchDelete = async () => {
    if (selectedVideos.length === 0) {
      alert('请先选择要删除的视频');
      return;
    }

    if (!confirm(`确定要删除选中的 ${selectedVideos.length} 个视频吗？`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .in('id', selectedVideos);
      
      if (error) throw error;
      
      // 更新本地列表
      setVideos(prev => prev.filter(v => !selectedVideos.includes(v.id)));
      setSelectedVideos([]);
      alert('删除成功');
    } catch (error) {
      console.error('批量删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 批量审核（通过/拒绝）
  const batchAudit = async (status: 'approved' | 'rejected') => {
    if (selectedVideos.length === 0) {
      alert('请先选择要审核的视频');
      return;
    }

    try {
      const { error } = await supabase
        .from('videos')
        .update({ status })
        .in('id', selectedVideos);
      
      if (error) throw error;
      
      // 更新本地列表
      setVideos(prev => prev.map(v => 
        selectedVideos.includes(v.id) ? { ...v, status } : v
      ));
      setSelectedVideos([]);
      alert(`批量${status === 'approved' ? '批准' : '拒绝'}成功`);
    } catch (error) {
      console.error('批量审核失败:', error);
      alert('审核失败，请重试');
    }
  };

  // 单个视频审核
  const auditVideo = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // 更新本地列表
      setVideos(prev => prev.map(v => 
        v.id === id ? { ...v, status } : v
      ));
      alert(`视频已${status === 'approved' ? '批准' : '拒绝'}`);
    } catch (error) {
      console.error('审核失败:', error);
      alert('审核失败，请重试');
    }
  };

  // 添加新视频
  const addNewVideo = async () => {
    if (!newVideo.title || !newVideo.video_url) {
      alert('标题和视频链接不能为空');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('videos')
        .insert([{
          title: newVideo.title,
          video_url: newVideo.video_url,
          thumbnail_url: newVideo.thumbnail_url || '',
          status: newVideo.status || 'pending'
        }])
        .select();
      
      if (error) throw error;
      
      // 更新本地列表
      setVideos(prev => [data[0], ...prev]);
      // 重置表单
      setNewVideo({ title: '', video_url: '', thumbnail_url: '', status: 'pending' });
      alert('添加视频成功');
    } catch (error) {
      console.error('添加视频失败:', error);
      alert('添加失败，请重试');
    }
  };

  // 保存编辑的视频
  const saveEditedVideo = async () => {
    if (!editingVideo || !editingVideo.title) {
      alert('标题不能为空');
      return;
    }

    try {
      const { error } = await supabase
        .from('videos')
        .update({
          title: editingVideo.title,
          video_url: editingVideo.video_url,
          thumbnail_url: editingVideo.thumbnail_url,
          status: editingVideo.status
        })
        .eq('id', editingVideo.id);
      
      if (error) throw error;
      
      // 更新本地列表
      setVideos(prev => prev.map(v => 
        v.id === editingVideo.id ? editingVideo : v
      ));
      setEditingVideo(null);
      alert('编辑成功');
    } catch (error) {
      console.error('编辑视频失败:', error);
      alert('编辑失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* 顶部操作栏 */}
        <div className="bg-white rounded-3xl p-5 mb-6 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <h1 className="text-xl font-black text-slate-900">视频管理中心</h1>
            
            {/* 搜索和筛选 */}
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none w-full md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                  placeholder="搜索视频标题..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />
              </div>
              
              {/* 状态筛选 */}
              <select 
                className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
              >
                <option value="all">全部状态</option>
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
              </select>
              
              <button 
                onClick={loadAllVideos}
                className="bg-slate-50 rounded-2xl p-3 hover:bg-slate-100 transition-colors"
                title="刷新列表"
              >
                <RefreshCw size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
          
          {/* 批量操作按钮 */}
          <div className="flex gap-3 mt-4">
            <button 
              onClick={toggleSelectAll}
              className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-200"
            >
              {selectedVideos.length > 0 ? '取消全选' : '全选'} ({selectedVideos.length})
            </button>
            <button 
              onClick={() => batchAudit('approved')}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700"
              disabled={selectedVideos.length === 0}
            >
              批量批准
            </button>
            <button 
              onClick={() => batchAudit('rejected')}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700"
              disabled={selectedVideos.length === 0}
            >
              批量拒绝
            </button>
            <button 
              onClick={batchDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
              disabled={selectedVideos.length === 0}
            >
              <Trash2 size={16} className="inline mr-1" /> 批量删除
            </button>
          </div>
        </div>

        {/* 添加新视频表单 */}
        <div className="bg-white rounded-3xl p-5 mb-6 shadow-sm border">
          <h3 className="font-bold text-slate-800 mb-4">添加新视频</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="p-3 bg-slate-50 border-none rounded-xl text-sm font-bold"
              placeholder="视频标题"
              value={newVideo.title}
              onChange={e => setNewVideo({...newVideo, title: e.target.value})}
            />
            <input
              className="p-3 bg-slate-50 border-none rounded-xl text-sm font-bold"
              placeholder="视频链接"
              value={newVideo.video_url}
              onChange={e => setNewVideo({...newVideo, video_url: e.target.value})}
            />
            <input
              className="p-3 bg-slate-50 border-none rounded-xl text-sm font-bold"
              placeholder="缩略图链接（可选）"
              value={newVideo.thumbnail_url}
              onChange={e => setNewVideo({...newVideo, thumbnail_url: e.target.value})}
            />
          </div>
          <button 
            onClick={addNewVideo}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
          >
            <Plus size={16} className="inline mr-1" /> 添加视频
          </button>
        </div>

        {/* 视频列表 */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">加载中...</div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <AlertCircle size={24} className="mx-auto mb-2" />
            暂无视频数据
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map(video => (
              <div 
                key={video.id} 
                className={`bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all ${
                  video.status === 'pending' ? 'border-amber-200 bg-amber-50' : 
                  video.status === 'approved' ? 'border-green-200 bg-green-50' : 
                  'border-red-200 bg-red-50'
                }`}
              >
                {/* 选择框 */}
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video.id)}
                    onChange={() => toggleVideoSelection(video.id)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {/* 视频缩略图 */}
                <div className="relative aspect-video bg-slate-900">
                  <img 
                    src={video.thumbnail_url || 'https://via.placeholder.com/400x225?text=No+Thumbnail'} 
                    className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" 
                    alt={video.title}
                  />
                  <a 
                    href={video.video_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl">
                      <Play size={24} fill="currentColor"/>
                    </div>
                  </a>
                  
                  {/* 状态标签 */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black">
                    {video.status === 'pending' ? (
                      <span className="bg-amber-500 text-white">待审核</span>
                    ) : video.status === 'approved' ? (
                      <span className="bg-green-500 text-white">已通过</span>
                    ) : (
                      <span className="bg-red-500 text-white">已拒绝</span>
                    )}
                  </div>
                </div>

                {/* 视频信息和操作 */}
                <div className="p-5">
                  <h3 className="font-black text-slate-800 truncate mb-1">{video.title || '未命名视频'}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">
                    作者: {video.author?.username || '匿名'}
                  </p>
                  
                  {/* 单个视频操作 */}
                  <div className="flex gap-2 mt-2">
                    {video.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => auditVideo(video.id, 'approved')}
                          className="flex-1 py-2 bg-green-600 text-white rounded-xl text-xs font-black hover:bg-green-700"
                        >
                          <Check size={14} className="inline mr-1" /> 批准
                        </button>
                        <button 
                          onClick={() => auditVideo(video.id, 'rejected')}
                          className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700"
                        >
                          <X size={14} className="inline mr-1" /> 拒绝
                        </button>
                      </>
                    )}
                    
                    {/* 编辑按钮 */}
                    <button 
                      onClick={() => setEditingVideo(video)}
                      className="py-2 px-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-200"
                    >
                      编辑
                    </button>
                    
                    {/* 删除按钮 */}
                    <button 
                      onClick={async () => {
                        if (confirm('确定删除该视频？')) {
                          await supabase.from('videos').delete().eq('id', video.id);
                          loadAllVideos();
                        }
                      }}
                      className="py-2 px-3 bg-slate-100 text-red-600 rounded-xl text-xs font-black hover:bg-slate-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 编辑视频弹窗（简化为固定层） */}
        {editingVideo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg">
              <h3 className="font-bold text-xl mb-4">编辑视频</h3>
              <div className="space-y-4">
                <input
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold"
                  placeholder="视频标题"
                  value={editingVideo.title}
                  onChange={e => setEditingVideo({...editingVideo, title: e.target.value})}
                />
                <input
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold"
                  placeholder="视频链接"
                  value={editingVideo.video_url}
                  onChange={e => setEditingVideo({...editingVideo, video_url: e.target.value})}
                />
                <input
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold"
                  placeholder="缩略图链接"
                  value={editingVideo.thumbnail_url}
                  onChange={e => setEditingVideo({...editingVideo, thumbnail_url: e.target.value})}
                />
                <select
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold"
                  value={editingVideo.status}
                  onChange={e => setEditingVideo({...editingVideo, status: e.target.value as any})}
                >
                  <option value="pending">待审核</option>
                  <option value="approved">已通过</option>
                  <option value="rejected">已拒绝</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setEditingVideo(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
                >
                  取消
                </button>
                <button 
                  onClick={saveEditedVideo}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
                >
                  <Save size={16} className="inline mr-1" /> 保存修改
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleVideoManager;