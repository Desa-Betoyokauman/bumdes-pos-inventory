export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category | Category[];
}
