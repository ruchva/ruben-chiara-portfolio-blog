
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  featured?: boolean;
  type: 'web' | 'fintech' | 'backend';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
}

export type NavItem = 'home' | 'work' | 'blog' | 'contact';
