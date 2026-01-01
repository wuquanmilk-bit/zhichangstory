// 用户页面
import React, { useState } from 'react';
import { Search, Users, TrendingUp, Clock, Star, Filter } from 'lucide-react';
import { useMockData } from '../hooks/useMockData';
import ContentCard from '../components/mock/ContentCard';

export default function UsersPage() {
  const { getMockData, getRecommendedUsers } = useMockData();
  const [activeTab, setActiveTab] = useState<'popular' | 'creators' | 'new'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  const allUsers = getMockData('users', { count: 20 });
  const creators = allUsers.filter(user => user.role === 'creator' || user.isVerified);
  const newUsers = [...allUsers].sort((a, b) => 
    new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
  );
  
  const getUsers = () => {
    switch (activeTab) {
      case 'popular':
        return allUsers;
      case 'creators':
        return creators;
      case 'new':
        return newUsers;
      default:
        return allUsers;
    }
  };
  
  let users = getUsers();
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    users = users.filter(user => 
      user.displayName.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query) ||
      user.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* 页面标题和搜索 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">用户</h1>
        <p className="text-gray-600 mb-6">发现有趣的创作者和同行者</p>
        
        <div className="relative max-w-2xl mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索用户..."
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            {/* 排行榜 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">排行榜</h3>
              <div className="space-y-3">
                {creators.slice(0, 5).map((user, index) => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`flex items-center justify-center h-6 w-6 rounded text-xs font-bold ${index < 3 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                      {index + 1}
                    </div>
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{user.displayName}</div>
                      <div className="text-xs text-gray-500 truncate">{user.bio}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 筛选 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">筛选</h3>
              <div className="space-y-2">
                {['技术', '创作', '学习', '生活'].map((tag) => (
                  <button
                    key={tag}
                    className="flex items-center justify-between w-full p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    <span>#{tag}</span>
                    <span className="text-gray-400 text-xs">12</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 社区数据 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">社区数据</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>总用户数</span>
                  <span className="font-semibold text-gray-900">{allUsers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>创作者</span>
                  <span className="font-semibold text-purple-600">{creators.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>今日活跃</span>
                  <span className="font-semibold text-gray-900">890</span>
                </div>
                <div className="flex justify-between">
                  <span>新增用户</span>
                  <span className="font-semibold text-gray-900">45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 主内容区 */}
        <div className="lg:col-span-3">
          {/* 标签栏 */}
          <div className="flex space-x-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition ${activeTab === 'popular' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                热门用户
              </div>
            </button>
            <button
              onClick={() => setActiveTab('creators')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition ${activeTab === 'creators' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                创作者
              </div>
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition ${activeTab === 'new' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                新用户
              </div>
            </button>
          </div>
          
          {/* 结果统计 */}
          <div className="mb-6 text-gray-600">
            找到 <span className="font-semibold text-gray-900">{users.length}</span> 个用户
          </div>
          
          {/* 用户列表 */}
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <ContentCard
                  key={user.id}
                  type="user"
                  data={user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无用户</h3>
              <p className="text-gray-600">没有找到匹配的用户</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}