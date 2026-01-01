import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <p className="text-2xl text-gray-500 mt-4 mb-8">糟糕！这个页面被职场吃掉了...</p>
      <Link to="/" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg">回到首页</Link>
    </div>
  );
}