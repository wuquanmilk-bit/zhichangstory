#!/usr/bin/env node
// scripts/esm/simple-mock-data.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('🎯 开始生成模拟数据...');

const mockDataDir = path.join(projectRoot, 'src', 'mockData');
if (!fs.existsSync(mockDataDir)) {
  fs.mkdirSync(mockDataDir, { recursive: true });
  console.log('✅ 创建mockData目录');
}

const mockData = {
  users: [
    {
      id: 'user_1',
      username: 'wang_teacher',
      displayName: '王老师',
      email: 'wang@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王老师',
      bio: '10年前端开发经验，React/Vue专家，喜欢分享技术心得',
      role: 'creator',
      stats: { followers: 2500, following: 120, posts: 24, questions: 8, answers: 45, likes: 3200, views: 15000 },
      tags: ['前端开发', 'React', 'TypeScript', 'Vue'],
      badges: ['技术专家', '优质创作者'],
      joinDate: '2023-01-15T10:30:00Z',
      isVerified: true,
      location: '北京',
      website: 'https://wang.dev',
      isMock: true
    },
    {
      id: 'user_2',
      username: 'chen_writer',
      displayName: '小陈作家',
      email: 'chen@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小陈作家',
      bio: '网络小说作家，擅长都市异能、穿越题材，已创作多部热门作品',
      role: 'creator',
      stats: { followers: 1800, following: 85, posts: 12, questions: 3, answers: 18, likes: 4500, views: 28000 },
      tags: ['小说创作', '都市', '穿越', '玄幻'],
      badges: ['签约作者', '热门作者'],
      joinDate: '2023-03-20T14:20:00Z',
      isVerified: true,
      location: '上海',
      isMock: true
    },
    {
      id: 'user_3',
      username: 'knowledge_base',
      displayName: '知识小百科',
      email: 'knowledge@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=知识小百科',
      bio: '知识分享博主，专注于有趣的知识和实用技巧',
      role: 'creator',
      stats: { followers: 3200, following: 95, posts: 18, questions: 6, answers: 32, likes: 2800, views: 22000 },
      tags: ['知识分享', '学习', '技巧', '效率'],
      badges: ['知识达人', '热门答主'],
      joinDate: '2023-05-10T09:30:00Z',
      isVerified: true,
      location: '杭州',
      isMock: true
    },
    {
      id: 'user_4',
      username: 'zhang_professor',
      displayName: '张教授',
      email: 'zhang@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张教授',
      bio: '大学计算机教授，研究方向：人工智能、机器学习',
      role: 'expert',
      stats: { followers: 1500, following: 60, posts: 8, questions: 2, answers: 15, likes: 1200, views: 9500 },
      tags: ['人工智能', '机器学习', '深度学习', '算法'],
      badges: ['认证专家', '技术专家'],
      joinDate: '2023-07-12T11:45:00Z',
      isVerified: true,
      location: '南京',
      website: 'https://zhang.pro',
      isMock: true
    },
    {
      id: 'user_5',
      username: 'admin_user',
      displayName: '管理员',
      email: 'admin@storyzhihu.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=管理员',
      bio: '平台管理员，维护社区秩序，服务所有用户',
      role: 'admin',
      stats: { followers: 500, following: 200, posts: 5, questions: 0, answers: 10, likes: 800, views: 5000 },
      tags: ['社区管理', '用户服务'],
      badges: ['管理员', '社区贡献者'],
      joinDate: '2022-12-01T08:00:00Z',
      isVerified: true,
      location: '深圳',
      isMock: true
    },
    {
      id: 'user_6',
      username: 'student_li',
      displayName: '李同学',
      email: 'li@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李同学',
      bio: '计算机专业学生，热爱编程和学习',
      role: 'user',
      stats: { followers: 120, following: 45, posts: 5, questions: 12, answers: 8, likes: 320, views: 1800 },
      tags: ['编程', '学习', '学生'],
      badges: ['活跃用户'],
      joinDate: '2024-01-10T09:15:00Z',
      isVerified: false,
      location: '杭州',
      isMock: true
    },
    {
      id: 'user_7',
      username: 'xiaowang_work',
      displayName: '上班族小王',
      email: 'xiaowang@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小王',
      bio: '产品经理，爱读书，喜欢分享职场经验',
      role: 'user',
      stats: { followers: 85, following: 60, posts: 3, questions: 5, answers: 12, likes: 150, views: 1200 },
      tags: ['职场', '产品经理', '读书'],
      badges: [],
      joinDate: '2024-01-05T14:20:00Z',
      isVerified: false,
      location: '广州',
      isMock: true
    },
    {
      id: 'user_8',
      username: 'lin_mother',
      displayName: '宝妈琳达',
      email: 'linda@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=琳达',
      bio: '全职妈妈，分享育儿经验和生活',
      role: 'user',
      stats: { followers: 65, following: 30, posts: 2, questions: 3, answers: 5, likes: 90, views: 800 },
      tags: ['育儿', '生活', '美食'],
      badges: [],
      joinDate: '2024-01-08T10:30:00Z',
      isVerified: false,
      location: '成都',
      isMock: true
    },
    {
      id: 'user_9',
      username: 'fresh_graduate',
      displayName: '应届生小李',
      email: 'fresh@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小李',
      bio: '应届毕业生，正在找工作，分享求职经验',
      role: 'user',
      stats: { followers: 45, following: 80, posts: 1, questions: 8, answers: 3, likes: 60, views: 600 },
      tags: ['求职', '应届生', '面试'],
      badges: [],
      joinDate: '2024-01-12T13:45:00Z',
      isVerified: false,
      location: '武汉',
      isMock: true
    },
    {
      id: 'user_10',
      username: 'tech_enthusiast',
      displayName: '技术爱好者',
      email: 'tech@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=技术',
      bio: '技术爱好者，关注前沿科技动态',
      role: 'user',
      stats: { followers: 180, following: 120, posts: 4, questions: 6, answers: 10, likes: 240, views: 1500 },
      tags: ['科技', '创新', '编程'],
      badges: [],
      joinDate: '2023-11-20T16:10:00Z',
      isVerified: false,
      location: '西安',
      isMock: true
    }
  ],
  
  questions: [
    {
      id: 'question_1',
      title: '零基础如何系统学习编程？',
      content: '我想从零开始学习编程，但不知道从哪里开始，应该先学什么语言？有什么好的学习路线推荐吗？',
      excerpt: '想从零开始学编程，不知道从哪种语言开始比较好...',
      authorId: 'user_6',
      author: { id: 'user_6', username: 'student_li', displayName: '李同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李同学' },
      category: '编程',
      tags: ['编程', '学习路线', '入门'],
      stats: { views: 1250, answers: 12, likes: 86, bookmarks: 45 },
      isSolved: true,
      isPopular: true,
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-20T10:15:00Z',
      isMock: true
    },
    {
      id: 'question_2',
      title: 'React和Vue哪个更适合新手学习？',
      content: '想学前端框架，在React和Vue之间犹豫，哪个对新手更友好？学习曲线如何？就业市场哪个更受欢迎？',
      excerpt: '在React和Vue之间犹豫，不知道选哪个...',
      authorId: 'user_7',
      author: { id: 'user_7', username: 'xiaowang_work', displayName: '上班族小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小王' },
      category: '前端',
      tags: ['React', 'Vue', '前端', '框架'],
      stats: { views: 850, answers: 8, likes: 42, bookmarks: 28 },
      isSolved: true,
      isPopular: true,
      createdAt: '2024-01-18T11:20:00Z',
      updatedAt: '2024-01-22T16:45:00Z',
      isMock: true
    },
    {
      id: 'question_3',
      title: '如何有效克服拖延症？',
      content: '总是把事情拖到最后，有什么有效的方法可以克服拖延症？如何提高工作效率和时间管理能力？',
      excerpt: '总是拖延，效率低下，求解决方法...',
      authorId: 'user_6',
      author: { id: 'user_6', username: 'student_li', displayName: '李同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李同学' },
      category: '效率',
      tags: ['拖延症', '时间管理', '效率'],
      stats: { views: 620, answers: 6, likes: 38, bookmarks: 22 },
      isSolved: false,
      isPopular: false,
      createdAt: '2024-01-20T09:45:00Z',
      updatedAt: '2024-01-20T09:45:00Z',
      isMock: true
    },
    {
      id: 'question_4',
      title: '面试时如何谈薪资比较合适？',
      content: '马上要面试了，不知道怎么谈薪资比较合适。要多少合适？如何评估自己的市场价值？',
      excerpt: '面试时不知道怎么谈薪资，求经验...',
      authorId: 'user_9',
      author: { id: 'user_9', username: 'fresh_graduate', displayName: '应届生小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小李' },
      category: '职场',
      tags: ['面试', '薪资', '职场'],
      stats: { views: 450, answers: 4, likes: 28, bookmarks: 18 },
      isSolved: true,
      isPopular: false,
      createdAt: '2024-01-22T10:15:00Z',
      updatedAt: '2024-01-25T14:30:00Z',
      isMock: true
    },
    {
      id: 'question_5',
      title: '如何提高英语口语水平？',
      content: '想提高英语口语水平，但不知道有什么有效的方法。需要报班吗？有什么自学资源推荐？',
      excerpt: '想提高英语口语，求学习方法...',
      authorId: 'user_6',
      author: { id: 'user_6', username: 'student_li', displayName: '李同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李同学' },
      category: '学习',
      tags: ['英语', '口语', '学习'],
      stats: { views: 380, answers: 5, likes: 24, bookmarks: 15 },
      isSolved: false,
      isPopular: false,
      createdAt: '2024-01-19T15:20:00Z',
      updatedAt: '2024-01-19T15:20:00Z',
      isMock: true
    },
    {
      id: 'question_6',
      title: 'Python在数据分析中有哪些优势？',
      content: '想学习数据分析，听说Python很好用。Python在数据分析中具体有哪些优势？需要学习哪些库？',
      excerpt: 'Python数据分析的优势和需要学习的库...',
      authorId: 'user_7',
      author: { id: 'user_7', username: 'xiaowang_work', displayName: '上班族小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小王' },
      category: '数据分析',
      tags: ['Python', '数据分析', '机器学习'],
      stats: { views: 520, answers: 7, likes: 35, bookmarks: 20 },
      isSolved: true,
      isPopular: false,
      createdAt: '2024-01-16T13:45:00Z',
      updatedAt: '2024-01-20T11:30:00Z',
      isMock: true
    },
    {
      id: 'question_7',
      title: '如何开始自己的副业？',
      content: '想在工作之余做点副业增加收入，但不知道从何开始。有什么适合上班族的副业推荐？',
      excerpt: '想找副业增加收入，求推荐...',
      authorId: 'user_7',
      author: { id: 'user_7', username: 'xiaowang_work', displayName: '上班族小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小王' },
      category: '副业',
      tags: ['副业', '创业', '收入'],
      stats: { views: 680, answers: 9, likes: 45, bookmarks: 30 },
      isSolved: false,
      isPopular: true,
      createdAt: '2024-01-14T09:30:00Z',
      updatedAt: '2024-01-14T09:30:00Z',
      isMock: true
    },
    {
      id: 'question_8',
      title: '有哪些提高工作效率的工具推荐？',
      content: '想提高工作效率，有什么好用的工具推荐？时间管理、任务管理、笔记工具都可以。',
      excerpt: '求提高工作效率的工具推荐...',
      authorId: 'user_7',
      author: { id: 'user_7', username: 'xiaowang_work', displayName: '上班族小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小王' },
      category: '效率',
      tags: ['效率', '工具', '生产力'],
      stats: { views: 420, answers: 6, likes: 32, bookmarks: 25 },
      isSolved: true,
      isPopular: false,
      createdAt: '2024-01-17T16:20:00Z',
      updatedAt: '2024-01-21T10:45:00Z',
      isMock: true
    },
    {
      id: 'question_9',
      title: '如何养成良好的阅读习惯？',
      content: '想多读书但总是坚持不下来，如何养成良好的阅读习惯？有什么方法和技巧？',
      excerpt: '想养成阅读习惯但坚持不下来...',
      authorId: 'user_8',
      author: { id: 'user_8', username: 'lin_mother', displayName: '宝妈琳达', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=琳达' },
      category: '学习',
      tags: ['阅读', '习惯', '学习'],
      stats: { views: 320, answers: 4, likes: 20, bookmarks: 12 },
      isSolved: false,
      isPopular: false,
      createdAt: '2024-01-21T14:10:00Z',
      updatedAt: '2024-01-21T14:10:00Z',
      isMock: true
    },
    {
      id: 'question_10',
      title: '机器学习需要哪些数学基础？',
      content: '想学习机器学习，需要哪些数学基础？线性代数、概率论、微积分要达到什么水平？',
      excerpt: '机器学习需要哪些数学基础...',
      authorId: 'user_10',
      author: { id: 'user_10', username: 'tech_enthusiast', displayName: '技术爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=技术' },
      category: '人工智能',
      tags: ['机器学习', '数学', '算法'],
      stats: { views: 580, answers: 5, likes: 30, bookmarks: 18 },
      isSolved: true,
      isPopular: false,
      createdAt: '2024-01-13T11:00:00Z',
      updatedAt: '2024-01-18T15:20:00Z',
      isMock: true
    },
    {
      id: 'question_11',
      title: '前端开发应该先学什么？',
      content: '想学前端开发，应该从什么开始学起？HTML、CSS、JavaScript的学习顺序是怎样的？',
      excerpt: '前端开发的学习路径...',
      authorId: 'user_6',
      author: { id: 'user_6', username: 'student_li', displayName: '李同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李同学' },
      category: '前端',
      tags: ['前端', 'HTML', 'CSS', 'JavaScript'],
      stats: { views: 720, answers: 8, likes: 40, bookmarks: 22 },
      isSolved: true,
      isPopular: true,
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-15T13:45:00Z',
      isMock: true
    },
    {
      id: 'question_12',
      title: '如何平衡工作和生活？',
      content: '工作压力大，很难平衡工作和生活，有什么好的方法和建议？',
      excerpt: '工作生活平衡的方法...',
      authorId: 'user_7',
      author: { id: 'user_7', username: 'xiaowang_work', displayName: '上班族小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小王' },
      category: '生活',
      tags: ['工作', '生活', '平衡'],
      stats: { views: 390, answers: 5, likes: 25, bookmarks: 16 },
      isSolved: false,
      isPopular: false,
      createdAt: '2024-01-23T09:15:00Z',
      updatedAt: '2024-01-23T09:15:00Z',
      isMock: true
    },
    {
      id: 'question_13',
      title: 'TypeScript和JavaScript有什么区别？',
      content: 'TypeScript和JavaScript的主要区别是什么？学习TypeScript有什么好处？',
      excerpt: 'TypeScript和JavaScript的区别...',
      authorId: 'user_6',
      author: { id: 'user_6', username: 'student_li', displayName: '李同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李同学' },
      category: '前端',
      tags: ['TypeScript', 'JavaScript', '前端'],
      stats: { views: 480, answers: 6, likes: 28, bookmarks: 20 },
      isSolved: true,
      isPopular: false,
      createdAt: '2024-01-11T14:20:00Z',
      updatedAt: '2024-01-16T10:30:00Z',
      isMock: true
    },
    {
      id: 'question_14',
      title: '如何选择适合自己的编程语言？',
      content: '想学编程但不知道选什么语言，如何根据职业目标和个人兴趣选择编程语言？',
      excerpt: '如何选择编程语言...',
      authorId: 'user_9',
      author: { id: 'user_9', username: 'fresh_graduate', displayName: '应届生小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小李' },
      category: '编程',
      tags: ['编程语言', '选择', '学习'],
      stats: { views: 350, answers: 4, likes: 22, bookmarks: 14 },
      isSolved: true,
      isPopular: false,
      createdAt: '2024-01-24T11:45:00Z',
      updatedAt: '2024-01-26T15:20:00Z',
      isMock: true
    },
    {
      id: 'question_15',
      title: '如何准备技术面试？',
      content: '要参加技术面试了，应该如何准备？算法、系统设计、项目经验等方面怎么准备？',
      excerpt: '技术面试准备方法...',
      authorId: 'user_9',
      author: { id: 'user_9', username: 'fresh_graduate', displayName: '应届生小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小李' },
      category: '职场',
      tags: ['面试', '技术', '准备'],
      stats: { views: 550, answers: 7, likes: 35, bookmarks: 24 },
      isSolved: true,
      isPopular: false,
      createdAt: '2024-01-19T13:30:00Z',
      updatedAt: '2024-01-24T09:45:00Z',
      isMock: true
    }
  ],
  
  answers: [
    {
      id: 'answer_1',
      questionId: 'question_1',
      content: '作为有10年前端经验的开发者，我建议从HTML/CSS/JavaScript基础开始，然后学习一个框架如React或Vue。最重要的是多动手实践，做一些小项目。学习路径可以是：1. HTML/CSS基础 2. JavaScript核心概念 3. DOM操作 4. ES6+新特性 5. 选择一个框架深入学习 6. 学习版本控制Git 7. 学习打包工具如Webpack 8. 参与实际项目。',
      excerpt: '从HTML/CSS/JavaScript基础开始学习，多动手实践...',
      authorId: 'user_1',
      author: { id: 'user_1', username: 'wang_teacher', displayName: '王老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王老师' },
      isAccepted: true,
      stats: { likes: 128, comments: 12 },
      createdAt: '2024-01-16T10:15:00Z',
      updatedAt: '2024-01-16T10:15:00Z',
      isMock: true
    },
    {
      id: 'answer_2',
      questionId: 'question_1',
      content: '我建议从Python开始，语法简单，应用广泛，适合初学者。学完基础后可以尝试Django或Flask做web开发，或者用pandas做数据分析。',
      excerpt: '从Python开始学习，语法简单应用广泛...',
      authorId: 'user_4',
      author: { id: 'user_4', username: 'zhang_professor', displayName: '张教授', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张教授' },
      isAccepted: false,
      stats: { likes: 45, comments: 5 },
      createdAt: '2024-01-16T14:30:00Z',
      updatedAt: '2024-01-16T14:30:00Z',
      isMock: true
    },
    {
      id: 'answer_3',
      questionId: 'question_2',
      content: 'Vue对新手更友好，文档完善，中文支持好，学习曲线平缓。React更灵活，生态更丰富，大公司使用更多。建议都了解一下，但可以先从Vue开始。',
      excerpt: 'Vue对新手更友好，React生态更丰富...',
      authorId: 'user_1',
      author: { id: 'user_1', username: 'wang_teacher', displayName: '王老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王老师' },
      isAccepted: true,
      stats: { likes: 96, comments: 8 },
      createdAt: '2024-01-19T14:30:00Z',
      updatedAt: '2024-01-19T14:30:00Z',
      isMock: true
    },
    {
      id: 'answer_4',
      questionId: 'question_2',
      content: '从就业市场看，React的需求量更大，尤其是大公司。但Vue在国内很受欢迎。建议学习React，因为学完React再学Vue很容易，反过来则不然。',
      excerpt: 'React就业市场需求更大，建议先学React...',
      authorId: 'user_7',
      author: { id: 'user_7', username: 'xiaowang_work', displayName: '上班族小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小王' },
      isAccepted: false,
      stats: { likes: 32, comments: 3 },
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-01-20T09:15:00Z',
      isMock: true
    },
    {
      id: 'answer_5',
      questionId: 'question_3',
      content: '克服拖延症的几个方法：1. 番茄工作法，25分钟专注工作+5分钟休息 2. 任务分解，把大任务拆成小任务 3. 设定明确期限 4. 消除干扰，关闭手机通知 5. 先做最难的事 6. 奖励自己完成任务。',
      excerpt: '番茄工作法、任务分解、消除干扰等方法...',
      authorId: 'user_3',
      author: { id: 'user_3', username: 'knowledge_base', displayName: '知识小百科', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=知识小百科' },
      isAccepted: true,
      stats: { likes: 58, comments: 6 },
      createdAt: '2024-01-21T10:45:00Z',
      updatedAt: '2024-01-21T10:45:00Z',
      isMock: true
    },
    {
      id: 'answer_6',
      questionId: 'question_4',
      content: '谈薪资的技巧：1. 先了解市场行情，知道自己值多少钱 2. 让对方先出价 3. 给出一个范围而不是具体数字 4. 不要只看薪资，还要看福利、发展空间 5. 准备好自己的价值证明。',
      excerpt: '了解市场行情，让对方先出价，给出范围...',
      authorId: 'user_7',
      author: { id: 'user_7', username: 'xiaowang_work', displayName: '上班族小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小王' },
      isAccepted: true,
      stats: { likes: 42, comments: 4 },
      createdAt: '2024-01-23T11:20:00Z',
      updatedAt: '2024-01-23T11:20:00Z',
      isMock: true
    },
    {
      id: 'answer_7',
      questionId: 'question_6',
      content: 'Python在数据分析中的优势：1. 简洁易学 2. 丰富的库（pandas, numpy, matplotlib, scikit-learn等） 3. 强大的社区支持 4. 与大数据工具集成好 5. 可视化能力强。需要学习的库：pandas（数据处理）、numpy（数值计算）、matplotlib（绘图）、scikit-learn（机器学习）。',
      excerpt: 'Python简洁易学，库丰富，社区强大...',
      authorId: 'user_4',
      author: { id: 'user_4', username: 'zhang_professor', displayName: '张教授', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张教授' },
      isAccepted: true,
      stats: { likes: 38, comments: 3 },
      createdAt: '2024-01-17T15:30:00Z',
      updatedAt: '2024-01-17T15:30:00Z',
      isMock: true
    },
    {
      id: 'answer_8',
      questionId: 'question_8',
      content: '提高工作效率的工具推荐：1. 时间管理：Todoist, Trello, Notion 2. 笔记：Obsidian, Roam Research 3. 代码：VS Code, GitHub Copilot 4. 沟通：Slack, Discord 5. 设计：Figma, Canva。',
      excerpt: 'Todoist, Notion, VS Code, Figma等工具推荐...',
      authorId: 'user_1',
      author: { id: 'user_1', username: 'wang_teacher', displayName: '王老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王老师' },
      isAccepted: true,
      stats: { likes: 40, comments: 5 },
      createdAt: '2024-01-18T13:45:00Z',
      updatedAt: '2024-01-18T13:45:00Z',
      isMock: true
    },
    {
      id: 'answer_9',
      questionId: 'question_10',
      content: '机器学习需要的数学基础：1. 线性代数（矩阵、向量、特征值） 2. 概率论与统计（概率分布、假设检验） 3. 微积分（导数、梯度、优化） 4. 最优化理论。不需要成为数学专家，但需要理解基本概念。',
      excerpt: '线性代数、概率论、微积分、最优化理论...',
      authorId: 'user_4',
      author: { id: 'user_4', username: 'zhang_professor', displayName: '张教授', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张教授' },
      isAccepted: true,
      stats: { likes: 35, comments: 4 },
      createdAt: '2024-01-14T16:20:00Z',
      updatedAt: '2024-01-14T16:20:00Z',
      isMock: true
    },
    {
      id: 'answer_10',
      questionId: 'question_11',
      content: '前端开发学习顺序：1. HTML基础（标签、语义化） 2. CSS基础（选择器、盒模型、布局） 3. JavaScript核心（变量、函数、DOM操作） 4. ES6+新特性 5. CSS进阶（Flexbox、Grid、动画） 6. 响应式设计 7. 选择一个框架（React/Vue） 8. 打包工具（Webpack/Vite） 9. TypeScript 10. 测试。',
      excerpt: 'HTML → CSS → JavaScript → 框架 → 工具...',
      authorId: 'user_1',
      author: { id: 'user_1', username: 'wang_teacher', displayName: '王老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王老师' },
      isAccepted: true,
      stats: { likes: 52, comments: 6 },
      createdAt: '2024-01-11T14:45:00Z',
      updatedAt: '2024-01-11T14:45:00Z',
      isMock: true
    }
  ],
  
  novels: [
    {
      id: 'novel_1',
      title: '我能看见未来',
      authorId: 'user_2',
      author: { id: 'user_2', username: 'chen_writer', displayName: '小陈作家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小陈作家' },
      description: '林峰意外获得预知未来的能力，从此人生开挂，但能力背后隐藏着巨大的秘密。当他预见到自己将在一个月后死去，他必须与时间赛跑，揭开能力背后的真相，改变自己的命运。',
      excerpt: '都市异能小说，讲述主角获得预知未来能力的故事',
      category: '都市异能',
      tags: ['异能', '都市', '成长', '热血', '悬疑'],
      stats: { views: 52000, likes: 1200, bookmarks: 450, comments: 89, wordCount: 256000 },
      chapters: 12,
      isComplete: false,
      isPopular: true,
      rating: 9.2,
      ratingCount: 1200,
      createdAt: '2023-06-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      isMock: true
    },
    {
      id: 'novel_2',
      title: '古代厨娘在现代',
      authorId: 'user_2',
      author: { id: 'user_2', username: 'chen_writer', displayName: '小陈作家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小陈作家' },
      description: '古代御厨苏婉儿穿越到现代，凭借一手精湛厨艺征服世界，却意外卷入商业帝国的斗争。看她如何用美食改变命运，创立自己的餐饮帝国，同时寻找回到古代的方法。',
      excerpt: '穿越美食小说，古代厨娘在现代的逆袭故事',
      category: '穿越美食',
      tags: ['穿越', '美食', '商业', '逆袭', '言情'],
      stats: { views: 89000, likes: 2400, bookmarks: 850, comments: 156, wordCount: 483000 },
      chapters: 48,
      isComplete: true,
      isPopular: true,
      rating: 9.5,
      ratingCount: 2400,
      createdAt: '2023-03-10T09:15:00Z',
      updatedAt: '2023-12-20T16:30:00Z',
      isMock: true
    },
    {
      id: 'novel_3',
      title: '时间旅行者的日记',
      authorId: 'user_2',
      author: { id: 'user_2', username: 'chen_writer', displayName: '小陈作家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小陈作家' },
      description: '一本神秘的日记，让主人公能够穿越时间，但每一次穿越都会改变未来。当他发现自己被困在时间循环中，必须找到打破循环的方法，否则将永远重复同一天。',
      excerpt: '科幻悬疑小说，关于时间旅行和时间循环的故事',
      category: '科幻悬疑',
      tags: ['科幻', '悬疑', '时间旅行', '烧脑', '循环'],
      stats: { views: 37000, likes: 850, bookmarks: 320, comments: 65, wordCount: 158000 },
      chapters: 8,
      isComplete: false,
      isPopular: true,
      rating: 8.9,
      ratingCount: 850,
      createdAt: '2023-09-05T14:20:00Z',
      updatedAt: '2024-01-15T11:30:00Z',
      isMock: true
    },
    {
      id: 'novel_4',
      title: '修仙学院',
      authorId: 'user_2',
      author: { id: 'user_2', username: 'chen_writer', displayName: '小陈作家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小陈作家' },
      description: '普通大学生林风获得修仙学院系统，从此开启不一样的修仙之路。在现代化的修仙学院中，学习功法、炼丹、炼器，与各种天才竞争，最终成为一代仙尊。',
      excerpt: '修仙系统文，现代背景下的修仙学院故事',
      category: '玄幻奇幻',
      tags: ['修仙', '系统', '学院', '成长', '热血'],
      stats: { views: 68000, likes: 1500, bookmarks: 580, comments: 120, wordCount: 325000 },
      chapters: 25,
      isComplete: false,
      isPopular: true,
      rating: 8.7,
      ratingCount: 1500,
      createdAt: '2023-11-20T13:45:00Z',
      updatedAt: '2024-01-25T10:15:00Z',
      isMock: true
    },
    {
      id: 'novel_5',
      title: '重生之商海传奇',
      authorId: 'user_2',
      author: { id: 'user_2', username: 'chen_writer', displayName: '小陈作家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小陈作家' },
      description: '商业精英陈锋重生回到90年代，凭借前世记忆，在改革开放的大潮中抓住机遇，从摆地摊开始，一步步缔造商业帝国，成为一代商界传奇。',
      excerpt: '重生商战文，90年代背景的商业传奇故事',
      category: '都市重生',
      tags: ['重生', '商战', '逆袭', '年代', '励志'],
      stats: { views: 75000, likes: 1800, bookmarks: 720, comments: 145, wordCount: 420000 },
      chapters: 40,
      isComplete: true,
      isPopular: true,
      rating: 9.0,
      ratingCount: 1800,
      createdAt: '2023-05-12T11:20:00Z',
      updatedAt: '2023-12-05T15:30:00Z',
      isMock: true
    },
    {
      id: 'novel_6',
      title: '星际指挥官',
      authorId: 'user_2',
      author: { id: 'user_2', username: 'chen_writer', displayName: '小陈作家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小陈作家' },
      description: '意外成为星际战舰指挥官，在浩瀚宇宙中探索未知，对抗外星威胁，建立星际帝国。从一艘小型护卫舰开始，逐步成长为掌控整个星系的霸主。',
      excerpt: '星际科幻文，宇宙探索和星际争霸的故事',
      category: '科幻末世',
      tags: ['科幻', '星际', '战争', '探索', '太空'],
      stats: { views: 45000, likes: 950, bookmarks: 380, comments: 75, wordCount: 195000 },
      chapters: 15,
      isComplete: false,
      isPopular: false,
      rating: 8.5,
      ratingCount: 950,
      createdAt: '2023-12-08T09:30:00Z',
      updatedAt: '2024-01-22T13:20:00Z',
      isMock: true
    }
  ],
  
  articles: [
    {
      id: 'article_1',
      title: 'React Hooks完全指南',
      content: 'React Hooks 是 React 16.8 引入的新特性，它让你在不编写 class 的情况下使用 state 以及其他的 React 特性。本文将从基础到高级，全面介绍React Hooks的使用方法和最佳实践。\n\n## 什么是Hooks？\nHooks 让你在不编写 class 的情况下使用 state 以及其他的 React 特性。\n\n## 常用Hooks\n1. useState - 状态管理\n2. useEffect - 副作用处理\n3. useContext - 上下文使用\n4. useReducer - 复杂状态管理\n5. useCallback - 函数记忆\n6. useMemo - 值记忆\n7. useRef - DOM引用和可变值\n\n## 最佳实践\n- 只在最顶层使用Hook\n- 只在React函数中调用Hook\n- 自定义Hook复用逻辑',
      excerpt: '深入浅出讲解React Hooks的使用方法和最佳实践',
      authorId: 'user_1',
      author: { id: 'user_1', username: 'wang_teacher', displayName: '王老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王老师' },
      category: '技术教程',
      tags: ['React', 'Hooks', '前端', '教程'],
      stats: { views: 1800, likes: 256, comments: 24, bookmarks: 89 },
      readTime: 15,
      isFeatured: true,
      isPopular: true,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z',
      isMock: true
    },
    {
      id: 'article_2',
      title: '高效学习的时间管理法',
      content: '时间管理是高效学习的关键，本文将分享几种实用的时间管理方法，帮助你提高学习效率。\n\n## 1. 番茄工作法\n25分钟专注工作 + 5分钟休息，每4个番茄钟后休息15-30分钟。\n\n## 2. 时间块法\n将一天分成几个时间块，每个时间块专注于一项任务。\n\n## 3. 艾森豪威尔矩阵\n将任务分为：重要紧急、重要不紧急、紧急不重要、不紧急不重要四类。\n\n## 4. 帕累托原则\n80%的结果来自20%的努力，找到关键的20%。\n\n## 5. 两分钟原则\n两分钟内能完成的事立即做。',
      excerpt: '分享高效学习的时间管理技巧和方法',
      authorId: 'user_3',
      author: { id: 'user_3', username: 'knowledge_base', displayName: '知识小百科', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=知识小百科' },
      category: '学习方法',
      tags: ['时间管理', '学习', '效率', '方法'],
      stats: { views: 2300, likes: 198, comments: 18, bookmarks: 120 },
      readTime: 8,
      isFeatured: true,
      isPopular: true,
      createdAt: '2024-01-05T14:20:00Z',
      updatedAt: '2024-01-05T14:20:00Z',
      isMock: true
    },
    {
      id: 'article_3',
      title: '2024年前端技术趋势分析',
      content: '随着技术的快速发展，前端开发领域也在不断变化。本文分析2024年前端技术的主要趋势。\n\n## 趋势一：TypeScript普及\nTypeScript成为大型项目的标配，类型安全提高开发效率。\n\n## 趋势二：框架多样化\nReact、Vue、Svelte、Solid等框架各有优势，选择更多样化。\n\n## 趋势三：构建工具演进\nVite、Turbopack等新一代构建工具提升开发体验。\n\n## 趋势四：全栈框架兴起\nNext.js、Nuxt.js、Remix等全栈框架简化前后端开发。\n\n## 趋势五：AI赋能开发\nAI辅助编程工具如GitHub Copilot提高开发效率。',
      excerpt: '分析2024年前端技术的主要发展趋势',
      authorId: 'user_1',
      author: { id: 'user_1', username: 'wang_teacher', displayName: '王老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王老师' },
      category: '行业分析',
      tags: ['前端', '趋势', '技术', '分析', '2024'],
      stats: { views: 1500, likes: 120, comments: 15, bookmarks: 65 },
      readTime: 10,
      isFeatured: false,
      isPopular: true,
      createdAt: '2024-01-08T11:30:00Z',
      updatedAt: '2024-01-08T11:30:00Z',
      isMock: true
    },
    {
      id: 'article_4',
      title: '如何从零开始写作',
      content: '写作是一项重要的能力，无论在工作还是生活中都很有用。本文分享从零开始写作的方法。\n\n## 1. 克服写作恐惧\n不要追求完美，先写出来再说。\n\n## 2. 确定写作目标\n明确写作目的和受众。\n\n## 3. 建立写作习惯\n每天固定时间写作，哪怕只有15分钟。\n\n## 4. 学习写作技巧\n阅读优秀作品，学习结构、逻辑、表达。\n\n## 5. 修改和润色\n好文章是改出来的，多次修改完善。\n\n## 6. 寻求反馈\n让他人阅读并提供建议。',
      excerpt: '分享从零开始学习写作的方法和技巧',
      authorId: 'user_3',
      author: { id: 'user_3', username: 'knowledge_base', displayName: '知识小百科', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=知识小百科' },
      category: '个人成长',
      tags: ['写作', '创作', '成长', '技巧'],
      stats: { views: 1200, likes: 85, comments: 12, bookmarks: 45 },
      readTime: 7,
      isFeatured: false,
      isPopular: false,
      createdAt: '2024-01-12T15:45:00Z',
      updatedAt: '2024-01-12T15:45:00Z',
      isMock: true
    },
    {
      id: 'article_5',
      title: '程序员必备的10个效率工具',
      content: '好的工具能极大提高开发效率，本文推荐10个程序员必备的效率工具。\n\n1. VS Code - 代码编辑器\n2. GitHub Copilot - AI编程助手\n3. iTerm2 - 终端工具\n4. Docker - 容器化\n5. Postman - API测试\n6. Figma - 设计工具\n7. Notion - 笔记和项目管理\n8. Obsidian - 知识管理\n9. Raycast - 快速启动器\n10. 1Password - 密码管理\n\n每个工具都有其独特优势，合理使用能极大提高工作效率。',
      excerpt: '推荐10个能极大提高开发效率的程序员工具',
      authorId: 'user_1',
      author: { id: 'user_1', username: 'wang_teacher', displayName: '王老师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王老师' },
      category: '工具推荐',
      tags: ['工具', '效率', '编程', '推荐'],
      stats: { views: 1900, likes: 145, comments: 20, bookmarks: 75 },
      readTime: 9,
      isFeatured: false,
      isPopular: true,
      createdAt: '2024-01-03T10:15:00Z',
      updatedAt: '2024-01-03T10:15:00Z',
      isMock: true
    },
    {
      id: 'article_6',
      title: '机器学习入门指南',
      content: '机器学习是人工智能的核心领域，本文为初学者提供机器学习入门指南。\n\n## 什么是机器学习？\n机器学习是让计算机从数据中学习，而不需要明确编程。\n\n## 机器学习类型\n1. 监督学习\n2. 无监督学习\n3. 半监督学习\n4. 强化学习\n\n## 学习路径\n1. 数学基础（线性代数、概率论、微积分）\n2. Python编程\n3. 机器学习库（scikit-learn, TensorFlow, PyTorch）\n4. 实践项目\n\n## 资源推荐\nCoursera吴恩达课程、Kaggle竞赛、经典教材。',
      excerpt: '为初学者提供机器学习的入门指南和学习路径',
      authorId: 'user_4',
      author: { id: 'user_4', username: 'zhang_professor', displayName: '张教授', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张教授' },
      category: '技术教程',
      tags: ['机器学习', '人工智能', '入门', '教程'],
      stats: { views: 1100, likes: 78, comments: 10, bookmarks: 42 },
      readTime: 12,
      isFeatured: false,
      isPopular: false,
      createdAt: '2024-01-15T13:20:00Z',
      updatedAt: '2024-01-15T13:20:00Z',
      isMock: true
    }
  ],
  
  categories: [
    { id: 'tech', name: '技术', slug: 'tech', icon: '💻', color: '#3b82f6', count: 45, isPopular: true },
    { id: 'programming', name: '编程', slug: 'programming', icon: '👨‍💻', color: '#8b5cf6', count: 38, isPopular: true },
    { id: 'frontend', name: '前端', slug: 'frontend', icon: '🎨', color: '#10b981', count: 27, isPopular: true },
    { id: 'ai', name: '人工智能', slug: 'ai', icon: '🤖', color: '#ef4444', count: 19, isPopular: true },
    { id: 'learning', name: '学习', slug: 'learning', icon: '📚', color: '#f59e0b', count: 32, isPopular: true },
    { id: 'productivity', name: '效率', slug: 'productivity', icon: '⚡', color: '#06b6d4', count: 24, isPopular: false },
    { id: 'career', name: '职场', slug: 'career', icon: '💼', color: '#8b5cf6', count: 18, isPopular: false },
    { id: 'novel_urban', name: '都市小说', slug: 'novel-urban', icon: '🏙️', color: '#ec4899', count: 15, isPopular: true },
    { id: 'novel_fantasy', name: '玄幻小说', slug: 'novel-fantasy', icon: '🐉', color: '#f97316', count: 12, isPopular: false },
    { id: 'novel_scifi', name: '科幻小说', slug: 'novel-scifi', icon: '🚀', color: '#6366f1', count: 8, isPopular: true }
  ],
  
  tags: [
    { id: 'javascript', name: 'JavaScript', slug: 'javascript', count: 42, isHot: true },
    { id: 'react', name: 'React', slug: 'react', count: 35, isHot: true },
    { id: 'python', name: 'Python', slug: 'python', count: 28, isHot: true },
    { id: 'vue', name: 'Vue', slug: 'vue', count: 22, isHot: false },
    { id: 'typescript', name: 'TypeScript', slug: 'typescript', count: 19, isHot: true },
    { id: 'machine-learning', name: '机器学习', slug: 'machine-learning', count: 15, isHot: true },
    { id: 'time-management', name: '时间管理', slug: 'time-management', count: 12, isHot: false },
    { id: 'productivity', name: '生产力', slug: 'productivity', count: 10, isHot: false },
    { id: 'urban', name: '都市', slug: 'urban', count: 8, isHot: false },
    { id: 'fantasy', name: '玄幻', slug: 'fantasy', count: 7, isHot: false },
    { id: 'time-travel', name: '穿越', slug: 'time-travel', count: 6, isHot: false },
    { id: 'web-dev', name: 'Web开发', slug: 'web-dev', count: 25, isHot: false }
  ]
};

// 保存所有数据
Object.entries(mockData).forEach(([key, data]) => {
  const filePath = path.join(mockDataDir, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ ${key}数据已保存 (${data.length}条)`);
});

// 创建索引文件
const indexContent = `// 模拟数据索引
// 自动生成于 ${new Date().toISOString()}

// 直接导出数据
export const users = ${JSON.stringify(mockData.users, null, 2)};
export const questions = ${JSON.stringify(mockData.questions, null, 2)};
export const answers = ${JSON.stringify(mockData.answers, null, 2)};
export const novels = ${JSON.stringify(mockData.novels, null, 2)};
export const articles = ${JSON.stringify(mockData.articles, null, 2)};
export const categories = ${JSON.stringify(mockData.categories, null, 2)};
export const tags = ${JSON.stringify(mockData.tags, null, 2)};
`;

fs.writeFileSync(
  path.join(mockDataDir, 'index.ts'),
  indexContent,
  'utf8'
);
console.log('✅ 索引文件已创建');

// 统计数据
console.log('\n📊 模拟数据统计:');
console.log(`👥 用户: ${mockData.users.length} 个`);
console.log(`❓ 问题: ${mockData.questions.length} 个`);
console.log(`💬 答案: ${mockData.answers.length} 个`);
console.log(`📖 小说: ${mockData.novels.length} 本`);
console.log(`📄 文章: ${mockData.articles.length} 篇`);
console.log(`🏷️ 分类: ${mockData.categories.length} 个`);
console.log(`🏷️ 标签: ${mockData.tags.length} 个`);

console.log('\n🎉 模拟数据生成完成！');