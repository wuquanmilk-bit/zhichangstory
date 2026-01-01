// 导航栏组件
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MessageSquare, BookOpen, Users, Home, User, Plus } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-2"></div>
              <span className="text-xl font-bold text-gray-900">StoryZhihu</span>
            </Link>
          </div>
          
          {/* 导航链接 */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
              }
            >
              <Home className="h-5 w-5" />
              <span>首页</span>
            </NavLink>
            
            <NavLink
              to="/questions"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
              }
            >
              <MessageSquare className="h-5 w-5" />
              <span>问答</span>
            </NavLink>
            
            <NavLink
              to="/novels"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`
              }
            >
              <BookOpen className="h-5 w-5" />
              <span>小说</span>
            </NavLink>
            
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
              }
            >
              <Users className="h-5 w-5" />
              <span>用户</span>
            </NavLink>
          </div>
          
          {/* 右侧操作 */}
          <div className="flex items-center space-x-4">
            <Link
              to="/ask"
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              提问
            </Link>
            
            <Link
              to="/profile"
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}