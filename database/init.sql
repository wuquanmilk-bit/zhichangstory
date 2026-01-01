-- Supabase 数据库初始化脚本
-- 在 Supabase SQL 编辑器中运行此脚本

-- 创建 profiles 表
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  website TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 启用行级安全
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 创建策略：公开可读
CREATE POLICY "所有人可查看用户资料" 
  ON public.profiles FOR SELECT 
  USING (true);

-- 创建策略：用户可更新自己的资料
CREATE POLICY "用户可更新自己的资料" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 自动设置 updated_at 的触发器
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'https://ui-avatars.com/api/?name=' || 
    encode(convert_to(COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 'UTF8'), 'hex') ||
    '&background=random'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 创建存储桶用于用户头像
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 头像存储策略
CREATE POLICY "公开可读头像"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "用户可上传自己的头像"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- 创建问题表示例
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  votes INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  is_solved BOOLEAN DEFAULT false,
  is_hot BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 启用行级安全
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- 问题表的策略
CREATE POLICY "所有人可查看问题"
  ON public.questions FOR SELECT 
  USING (true);

CREATE POLICY "用户可创建问题"
  ON public.questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可更新自己的问题"
  ON public.questions FOR UPDATE
  USING (auth.uid() = user_id);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON public.questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_votes ON public.questions(votes DESC);
