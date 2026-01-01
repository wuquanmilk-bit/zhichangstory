/**
 * 职场story - 精简版 Mock 数据
 * 已切换至 Supabase 数据库，此文件仅作为备用结构
 */

// 1. 用户数据 (保留 1-2 条即可)
export const users = [
  {
    id: 'u_1',
    displayName: '职场官方',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    bio: '欢迎来到职场story！'
  }
];

// 2. 问答数据 (清空，因为我们已经用数据库的了)
export const questions = [];

// 3. 小说数据 (清空)
export const novels = [];

// 4. 回答数据 (清空)
export const answers = [];

// 5. 文章数据 (清空)
export const articles = [];

// 6. 分类数据 (保留几个常用的，方便首页渲染)
export const categories = [
  { id: 'c_1', name: '职场生存', slug: 'office', icon: '💼', count: 0 },
  { id: 'c_2', name: '技术分享', slug: 'tech', icon: '💻', count: 0 },
  { id: 'c_3', name: '都市小说', slug: 'city', icon: '🏙️', count: 0 },
  { id: 'c_4', name: '面试经验', slug: 'interview', icon: '📝', count: 0 },
  { id: 'c_5', name: '情感树洞', slug: 'emotion', icon: '🌙', count: 0 },
  { id: 'c_6', name: '副业思维', slug: 'side-hustle', icon: '💰', count: 0 },
];