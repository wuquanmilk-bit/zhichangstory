function CommunityPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">社区</h1>
        <p className="text-gray-600 mb-8">加入讨论，认识志同道合的朋友</p>
        
        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <h2 className="text-2xl font-semibold mb-4">社区功能</h2>
          <p className="text-gray-700 mb-6">社区页面正在开发中，将包含：</p>
          <ul className="space-y-3 text-gray-600">
            <li>• 用户个人主页和关注系统</li>
            <li>• 私信和即时聊天功能</li>
            <li>• 社区活动和线上聚会</li>
            <li>• 专题讨论区和兴趣小组</li>
            <li>• 成就系统和徽章奖励</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;