export interface Product {
  id: number;
  name: string;
  code: string;
  category_id: number | null;
  category?: {
    id: number;
    name: string;
  };
  price: number;
  stock: number;
  min_stock: number;
  unit: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  code: string;
  category_id: number;
  price: number;
  stock: number;
  min_stock: number;
  unit: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
}