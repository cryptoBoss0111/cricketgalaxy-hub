
export interface Article {
  id: string | number;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  cover_image?: string;
  featured_image?: string;
  category: string;
  author: string;
  author_id?: string;
  date: string;
  timeToRead?: string;
  content?: string;
}
