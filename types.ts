
export interface BookContent {
  title: string;
  author: string;
  foreword: string;
  toc: string[];
  introduction: string;
  chapters: string[];
  bibliography: string;
}

export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
  lastLogin: string;
  password?: string; // Menambahkan password untuk manajemen admin
}

export interface WritingResult {
  id: string;
  title: string;
  author: string;
  date: string;
  content: BookContent;
}

export type AppView = 'login' | 'dashboard' | 'admin';
