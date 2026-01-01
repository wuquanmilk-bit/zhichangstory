import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, MessageSquare, Star } from 'lucide-react';

export default function ContentCard({ type, data, className = '', onLike }: any) {
  if (!data) return null;

  // 防御性提取：确保我们渲染的是字符串，不是对象
  const authorName = data.author?.displayName || '匿名用户';
  const authorAvatar = data.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLike) onLike();
  };

  if (type === 'question') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <img src={authorAvatar} className="h-6 w-6 rounded-full" alt="" />
          {/* 这里是关键！必须是 authorName 字符串 */}
          <span className="text-sm font-medium text-gray-700">{authorName}</span>
          <span className="text-xs text-gray-400">· {new Date(data.createdAt).toLocaleDateString()}</span>
        </div>

        <Link to={`/question/${data.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">{data.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{data.content}</p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><Eye className="h-4 w-4 mr-1" />{data.stats?.views || 0}</span>
            <span className="flex items-center"><MessageSquare className="h-4 w-4 mr-1" />{data.stats?.comments || 0}</span>
            <button onClick={handleLikeClick} className="flex items-center hover:text-red-500">
              <Heart className={`h-4 w-4 mr-1 ${data.stats?.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {data.stats?.likes || 0}
            </button>
          </div>
          <span className="text-blue-600 font-medium">详情</span>
        </div>
      </div>
    );
  }

  if (type === 'novel') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
        <Link to={`/novel/${data.id}`} className="block h-40 bg-gray-100 overflow-hidden">
          <img src={data.cover || 'https://picsum.photos/400/250'} className="w-full h-full object-cover" alt="" />
        </Link>
        <div className="p-4">
          <Link to={`/novel/${data.id}`}>
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{data.title}</h3>
          </Link>
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="flex items-center"><Eye className="h-3 w-3 mr-1" />{data.stats?.views || 0}</span>
              <button onClick={handleLikeClick} className="flex items-center hover:text-red-500">
                <Heart className="h-3 w-3 mr-1" />{data.stats?.likes || 0}
              </button>
            </div>
            <span className="text-purple-600 font-bold">立即阅读</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}