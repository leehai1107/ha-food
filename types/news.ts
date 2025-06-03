export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  summary?: string;
  featuredImage?: string;
  image?: string;
  tags: string[];
  author?: {
    id: string;
    name: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
} 