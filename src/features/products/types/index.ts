export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  purchase_price: number; // 👈 ADD
  price: number;
  stock: number;
  min_stock: number;
  unit: string;
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  code: string;
  name: string;
  description?: string;
  purchase_price: number; // 👈 ADD
  price: number;
  stock: number;
  min_stock: number;
  unit: string;
  category_id: number;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  description?: string;
  purchase_price: number; // 👈 ADD
  price: number;
  stock: number;
  min_stock: number;
  unit: string;
  category_id: number;
}

export interface UpdateProductRequest {
  code: string;
  name: string;
  description?: string;
  purchase_price: number; // 👈 ADD
  price: number;
  min_stock: number;
  unit: string;
  category_id: number;
}
