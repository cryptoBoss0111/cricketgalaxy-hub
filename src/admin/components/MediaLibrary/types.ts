
export interface MediaFile {
  id: string;
  original_file_name: string;
  stored_file_name: string;
  url: string;
  created_at: string;
  size?: number;
  content_type?: string;
}
