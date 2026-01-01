import { createClient } from "@supabase/supabase-js";

// 从环境变量获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase 配置缺失，请检查 .env 文件");
  throw new Error("缺少 Supabase 配置");
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// 导出用户相关类型
export interface UserProfile {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    avatar_url?: string;
  };
  created_at: string;
}
