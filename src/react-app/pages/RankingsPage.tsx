function RankingsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">热门榜单</h1>
        <p className="text-gray-600 mb-8">查看最受欢迎的问题、小说和作者排行</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">🔥 热门问答榜</h3>
            <p>这里将显示最受欢迎的问题和回答...</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">📚 小说排行榜</h3>
            <p>这里将显示最受欢迎的小说作品...</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-semibold mb-4 text-green-600">👑 作者影响力榜</h3>
            <p>这里将显示最有影响力的作者...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingsPage;