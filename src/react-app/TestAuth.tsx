// 测试组件，检查 AuthProvider 是否工作
import React from "react";
import { useAuth } from "../contexts/AuthContext";

export function TestAuth() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>加载中...</div>;
  }
  
  return (
    <div style={{ padding: "20px", background: "#f0f0f0" }}>
      <h3>AuthProvider 测试</h3>
      {user ? (
        <div>
          <p>✅ 用户已登录</p>
          <p>邮箱: {user.email}</p>
          <p>昵称: {user.name}</p>
        </div>
      ) : (
        <p>❌ 用户未登录</p>
      )}
    </div>
  );
}
