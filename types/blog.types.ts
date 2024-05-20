export interface blogType {
  id: string;
  category: string;
  title: string;
  content: string;
  thumbnail: string;
  tag: string[];
  blogViews: number;
  likes: number;
  dislike: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface blogBodyType {
  title: string;
  category: string;
  author: string;
  content: string;
  thumbnail: string;
  tag: string[];
}
