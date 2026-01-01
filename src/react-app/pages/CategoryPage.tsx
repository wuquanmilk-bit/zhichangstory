import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CategoryPage() {
  const { category } = useParams();
  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 capitalize">{category} 分类</h1>
      <p className="text-gray-500 text-center py-20 border-2 border-dashed rounded-3xl">该分类下暂无内容</p>
    </div>
  );
}