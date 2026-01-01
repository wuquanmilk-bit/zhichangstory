import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 
import { users as localUsers, categories as localCategories } from '../../mockData';

export function useMockData() {
  const [dbQuestions, setDbQuestions] = useState<any[]>([]);
  const [dbNovels, setDbNovels] = useState<any[]>([]);
  const [dbAnswers, setDbAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 安全解析函数：确保 author 和 stats 一定是对象
  const ensureObject = (item: any) => {
    if (!item) return item;
    const newItem = { ...item };
    if (typeof newItem.author === 'string') {
      try { newItem.author = JSON.parse(newItem.author); } catch { newItem.author = { displayName: '匿名用户' }; }
    }
    if (typeof newItem.stats === 'string') {
      try { newItem.stats = JSON.parse(newItem.stats); } catch { newItem.stats = { views: 0, likes: 0 }; }
    }
    // 补全默认值
    if (!newItem.author) newItem.author = { displayName: '匿名用户' };
    if (!newItem.stats) newItem.stats = { views: 0, likes: 0 };
    return newItem;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [qRes, nRes, aRes] = await Promise.all([
          supabase.from('questions').select('*'),
          supabase.from('novels').select('*'),
          supabase.from('answers').select('*')
        ]);

        if (qRes.data) setDbQuestions(qRes.data.map(ensureObject));
        if (nRes.data) setDbNovels(nRes.data.map(ensureObject));
        if (aRes.data) setDbAnswers(aRes.data.map(ensureObject));
      } catch (e) {
        console.error("加载失败:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. 内部排序逻辑：不再依赖外部函数名
  const getSorted = (data: any[]) => {
    return [...data].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  };

  return {
    isLoading,
    // 列表页 API
    getPopularQuestions: (count = 50) => getSorted(dbQuestions).slice(0, count),
    getPopularNovels: (count = 10) => getSorted(dbNovels).slice(0, count),
    getLatestNovels: (count = 10) => getSorted(dbNovels).slice(0, count),
    
    // 详情页 API
    getQuestionById: (id: string) => dbQuestions.find(q => String(q.id) === String(id)),
    getAnswersByQuestionId: (qId: string) => dbAnswers.filter(a => String(a.questionid) === String(qId)),
    getNovelById: (id: string) => dbNovels.find(n => String(n.id) === String(id)),

    // 辅助 API
    getRecommendedUsers: (count = 5) => localUsers.slice(0, count),
    getPopularCategories: (count = 10) => localCategories.slice(0, count),
    getPopularArticles: () => [],

    handleLike: async (id: string, currentLikes: number, type: 'questions' | 'novels') => {
      const targetList = type === 'questions' ? dbQuestions : dbNovels;
      const target = targetList.find(i => String(i.id) === String(id));
      if (!target) return;
      
      const newStats = { ...target.stats, likes: (currentLikes || 0) + 1 };
      
      // 更新本地状态（乐观更新）
      if (type === 'questions') {
        setDbQuestions(prev => prev.map(q => String(q.id) === String(id) ? { ...q, stats: newStats } : q));
      } else {
        setDbNovels(prev => prev.map(n => String(n.id) === String(id) ? { ...n, stats: newStats } : n));
      }

      await supabase.from(type).update({ stats: newStats }).eq('id', id);
    }
  };
}