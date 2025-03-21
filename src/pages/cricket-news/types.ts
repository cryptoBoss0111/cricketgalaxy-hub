
export interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
  timeToRead: string;
}
