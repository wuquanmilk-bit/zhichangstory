// src/types/mock.types.ts
export interface MockUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'creator' | 'user' | 'admin' | 'expert';
  stats: {
    followers: number;
    following: number;
    posts: number;
    questions: number;
    answers: number;
    likes: number;
    views: number;
  };
  tags: string[];
  badges: string[];
  joinDate: string;
  isVerified: boolean;
  website?: string;
  location?: string;
  isMock: boolean;
}

export interface MockQuestion {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  author: MockUser;
  category: string;
  tags: string[];
  stats: {
    views: number;
    answers: number;
    likes: number;
    bookmarks: number;
  };
  isSolved: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
  isMock: boolean;
}

export interface MockAnswer {
  id: string;
  questionId: string;
  content: string;
  excerpt: string;
  authorId: string;
  author: MockUser;
  isAccepted: boolean;
  stats: {
    likes: number;
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
  isMock: boolean;
}

export interface MockNovel {
  id: string;
  title: string;
  authorId: string;
  author: MockUser;
  description: string;
  excerpt: string;
  category: string;
  tags: string[];
  stats: {
    views: number;
    likes: number;
    bookmarks: number;
    comments: number;
    wordCount: number;
  };
  chapters: number;
  isComplete: boolean;
  isPopular: boolean;
  rating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  isMock: boolean;
}

export interface MockArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  author: MockUser;
  category: string;
  tags: string[];
  stats: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };
  readTime: number;
  isFeatured: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
  isMock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  count: number;
  isPopular: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
  isHot: boolean;
}