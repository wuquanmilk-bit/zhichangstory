// 🎭 谷子角色头像库 - 混合真人照片与卡通动漫风格
export const AVATAR_OPTIONS = [
  // --- 顶级高手 (剑/气) ---
  { 
    id: 1, 
    category: '剑宗', 
    name: '青莲剑仙', 
    url: 'https://images.pexels.com/photos/2694037/pexels-photo-2694037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },
  { 
    id: 2, 
    category: '剑宗', 
    name: '冷月剑寒', 
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=冷月剑寒&backgroundColor=b6e3f4,c0aede,d1d4f9&size=400',
    style: 'anime'
  },
  { 
    id: 3, 
    category: '侠女', 
    name: '寒山女侠', 
    url: 'https://images.pexels.com/photos/371160/pexels-photo-371160.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },
  { 
    id: 4, 
    category: '侠女', 
    name: '红枫影', 
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=红枫影&backgroundColor=ffd5dc,ffdfbf,c0aede&size=400',
    style: 'anime'
  },

  // --- 奇门异事 (术/毒) ---
  { 
    id: 5, 
    category: '暗影', 
    name: '锦衣夜行', 
    url: 'https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },
  { 
    id: 6, 
    category: '暗影', 
    name: '影刃', 
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=影刃&backgroundColor=2c2c2c,4a4a4a,666666&size=400',
    style: 'anime'
  },
  { 
    id: 7, 
    category: '术士', 
    name: '龙脉传人', 
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=龙脉传人&backgroundColor=6b46c1,805ad5,9f7aea&size=400',
    style: 'anime'
  },
  { 
    id: 8, 
    category: '医仙', 
    name: '悬壶济世', 
    url: 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },

  // --- 豪侠壮志 (力/刚) ---
  { 
    id: 9, 
    category: '霸刀', 
    name: '狂刀铁牛', 
    url: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=狂刀铁牛&backgroundColor=d1d4f9,ffdfbf,a3bffa&size=400',
    style: 'anime'
  },
  { 
    id: 10, 
    category: '霸刀', 
    name: '塞外刀王', 
    url: 'https://images.pexels.com/photos/143580/pexels-photo-143580.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },
  { 
    id: 11, 
    category: '武僧', 
    name: '伏虎罗汉', 
    url: 'https://api.dicebear.com/7.x/croodles/svg?seed=伏虎罗汉&backgroundColor=ffdfbf,fbb6ce,fed7aa&size=400',
    style: 'anime'
  },
  { 
    id: 12, 
    category: '战将', 
    name: '破军', 
    url: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },

  // --- 江湖意境 (风/月) ---
  { 
    id: 13, 
    category: '琴师', 
    name: '高山流水', 
    url: 'https://api.dicebear.com/7.x/miniavs/svg?seed=高山流水&backgroundColor=b6e3f4,c0aede,d1d4f9&size=400',
    style: 'anime'
  },
  { 
    id: 14, 
    category: '浪子', 
    name: '逍遥游', 
    url: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },
  { 
    id: 15, 
    category: '隐士', 
    name: '钓鱼翁', 
    url: 'https://api.dicebear.com/7.x/big-ears/svg?seed=钓鱼翁&backgroundColor=ffdfbf,a3bffa,fed7aa&size=400',
    style: 'anime'
  },
  { 
    id: 16, 
    category: '灵兽', 
    name: '火麒麟', 
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=火麒麟&backgroundColor=fbb6ce,fed7aa,ffdfbf&size=400',
    style: 'anime'
  },

  // --- 精英与传说 ---
  { 
    id: 17, 
    category: '门主', 
    name: '万剑归宗', 
    url: 'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },
  { 
    id: 18, 
    category: '邪魅', 
    name: '东方不败', 
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=东方不败&backgroundColor=fbb6ce,c0aede,d1d4f9&size=400',
    style: 'anime'
  },
  { 
    id: 19, 
    category: '剑客', 
    name: '天涯孤客', 
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=天涯孤客&backgroundColor=2c2c2c,4a4a4a,666666&size=400',
    style: 'anime'
  },
  { 
    id: 20, 
    category: '刺客', 
    name: '无情', 
    url: 'https://images.pexels.com/photos/458518/pexels-photo-458518.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },
  { 
    id: 21, 
    category: '龙子', 
    name: '真龙传人', 
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=真龙传人&backgroundColor=b6e3f4,a3bffa,c0aede&size=400',
    style: 'anime'
  },
  { 
    id: 22, 
    category: '豪侠', 
    name: '镇关西', 
    url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },
  { 
    id: 23, 
    category: '巾帼', 
    name: '穆桂英', 
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=穆桂英&backgroundColor=ffd5dc,fbb6ce,fed7aa&size=400',
    style: 'anime'
  },
  { 
    id: 24, 
    category: '宗师', 
    name: '张三丰', 
    url: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    style: 'realistic'
  },

  // === 新增卡通动漫风格角色 ===
  
  // --- 新增剑道高手 ---
  { 
    id: 25, 
    category: '剑宗', 
    name: '樱花剑舞', 
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=樱花剑舞&backgroundColor=ffd5dc,fbb6ce,fed7aa&size=400',
    style: 'anime'
  },
  { 
    id: 26, 
    category: '剑宗', 
    name: '流星剑影', 
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=流星剑影&backgroundColor=b6e3f4,c0aede,d1d4f9&size=400',
    style: 'anime'
  },
  
  // --- 新增侠女系列 ---
  { 
    id: 27, 
    category: '侠女', 
    name: '紫霞仙子', 
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=紫霞仙子&backgroundColor=fbb6ce,ffd5dc,fed7aa&size=400',
    style: 'anime'
  },
  { 
    id: 28, 
    category: '侠女', 
    name: '月下独酌', 
    url: 'https://api.dicebear.com/7.x/miniavs/svg?seed=月下独酌&backgroundColor=b6e3f4,a3bffa,c0aede&size=400',
    style: 'anime'
  },
  
  // --- 新增暗影系列 ---
  { 
    id: 29, 
    category: '暗影', 
    name: '夜鸦', 
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=夜鸦&backgroundColor=2c2c2c,4a4a4a,666666&size=400',
    style: 'anime'
  },
  { 
    id: 30, 
    category: '暗影', 
    name: '暗月', 
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=暗月&backgroundColor=4a5568,2d3748,1a202c&size=400',
    style: 'anime'
  },
  
  // --- 新增术士系列 ---
  { 
    id: 31, 
    category: '术士', 
    name: '星象师', 
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=星象师&backgroundColor=6b46c1,805ad5,9f7aea&size=400',
    style: 'anime'
  },
  { 
    id: 32, 
    category: '术士', 
    name: '符咒大师', 
    url: 'https://api.dicebear.com/7.x/croodles/svg?seed=符咒大师&backgroundColor=ffdfbf,fed7aa,fbb6ce&size=400',
    style: 'anime'
  },
  
  // --- 新增医仙系列 ---
  { 
    id: 33, 
    category: '医仙', 
    name: '百草仙子', 
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=百草仙子&backgroundColor=d1f7c4,ffd5dc,b6e3f4&size=400',
    style: 'anime'
  },
  { 
    id: 34, 
    category: '医仙', 
    name: '妙手回春', 
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=妙手回春&backgroundColor=ffdfbf,fed7aa,fbb6ce&size=400',
    style: 'anime'
  },
  
  // --- 新增霸刀系列 ---
  { 
    id: 35, 
    category: '霸刀', 
    name: '断岳刀狂', 
    url: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=断岳刀狂&backgroundColor=a3bffa,ffdfbf,d1d4f9&size=400',
    style: 'anime'
  },
  { 
    id: 36, 
    category: '霸刀', 
    name: '血刃', 
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=血刃&backgroundColor=e53e3e,c53030,742a2a&size=400',
    style: 'anime'
  },
  
  // --- 新增武僧系列 ---
  { 
    id: 37, 
    category: '武僧', 
    name: '金刚不坏', 
    url: 'https://api.dicebear.com/7.x/big-ears/svg?seed=金刚不坏&backgroundColor=ffdfbf,fed7aa,ecc94b&size=400',
    style: 'anime'
  },
  { 
    id: 38, 
    category: '武僧', 
    name: '禅心', 
    url: 'https://api.dicebear.com/7.x/miniavs/svg?seed=禅心&backgroundColor=b6e3f4,c0aede,a3bffa&size=400',
    style: 'anime'
  },
  
  // --- 新增琴师系列 ---
  { 
    id: 39, 
    category: '琴师', 
    name: '琴魔', 
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=琴魔&backgroundColor=6b46c1,805ad5,9f7aea&size=400',
    style: 'anime'
  },
  { 
    id: 40, 
    category: '琴师', 
    name: '音律仙子', 
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=音律仙子&backgroundColor=ffd5dc,fbb6ce,fed7aa&size=400',
    style: 'anime'
  },
  
  // --- 新增浪子系列 ---
  { 
    id: 41, 
    category: '浪子', 
    name: '酒剑仙', 
    url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=酒剑仙&backgroundColor=ffdfbf,a3bffa,d1d4f9&size=400',
    style: 'anime'
  },
  { 
    id: 42, 
    category: '浪子', 
    name: '逍遥书生', 
    url: 'https://api.dicebear.com/7.x/croodles/svg?seed=逍遥书生&backgroundColor=b6e3f4,c0aede,a3bffa&size=400',
    style: 'anime'
  },
  
  // --- 新增隐士系列 ---
  { 
    id: 43, 
    category: '隐士', 
    name: '竹林隐者', 
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=竹林隐者&backgroundColor=d1f7c4,ffdfbf,b6e3f4&size=400',
    style: 'anime'
  },
  { 
    id: 44, 
    category: '隐士', 
    name: '山野道人', 
    url: 'https://api.dicebear.com/7.x/big-ears/svg?seed=山野道人&backgroundColor=ffdfbf,fed7aa,ecc94b&size=400',
    style: 'anime'
  },
  
  // --- 新增灵兽系列 ---
  { 
    id: 45, 
    category: '灵兽', 
    name: '九尾狐', 
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=九尾狐&backgroundColor=fbb6ce,ffd5dc,fed7aa&size=400',
    style: 'anime'
  },
  { 
    id: 46, 
    category: '灵兽', 
    name: '白虎', 
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=白虎&backgroundColor=f7fafc,e2e8f0,cbd5e0&size=400',
    style: 'anime'
  },
  
  // --- 新增门主系列 ---
  { 
    id: 47, 
    category: '门主', 
    name: '天机阁主', 
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=天机阁主&backgroundColor=2c2c2c,4a4a4a,666666&size=400',
    style: 'anime'
  },
  { 
    id: 48, 
    category: '门主', 
    name: '玄天宗主', 
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=玄天宗主&backgroundColor=b6e3f4,c0aede,a3bffa&size=400',
    style: 'anime'
  }
];