import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function MyPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      supabase.from('novels').select('*').eq('user_id', user.id)
        .then(({ data }) => data && setPosts(data));
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">我的创作</h1>
      {posts.length === 0 ? (
        <div className="p-20 text-center border-2 border-dashed rounded-3xl text-gray-400">你还没写过任何内容呢</div>
      ) : (
        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
              <span className="font-bold">{p.title}</span>
              <button className="text-blue-500 text-sm">编辑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}