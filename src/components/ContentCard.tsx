import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, BookOpen, Clock } from 'lucide-react';

interface ContentCardProps {
  type: 'question' | 'novel';
  data: any;
}

export default function ContentCard({ type, data }: ContentCardProps) {
  // 统一跳转路径
  const detailLink = type === 'question' ? `/question/${data.id}` : `/novel/${data.id}`;
  
  return (
    <Link to={detailLink} className="block group">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1">
        <div className="flex items-center gap-2 mb-3">
          {type === 'question' ? (
            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><MessageSquare size={16} /></span>
          ) : (
            <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg"><BookOpen size={16} /></span>
          )}
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {type === 'question' ? '职场问答' : '职场story'}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
          {data.title}
        </h3>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
          {/* 统一读取数据库里的内容字段 */}
          {data.content || data.description || "点击查看详情..."}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(data.created_at).toLocaleDateString()}
          </div>
          <span className="font-medium text-purple-500">阅读全文 →</span>
        </div>
      </div>
    </Link>
  );
}