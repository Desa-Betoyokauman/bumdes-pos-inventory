import { api } from "@/shared/lib/api";
import { Product, ProductFormData } from "../types";

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    // Backend return data.data.products, bukan data.data
    return response.data.data.products || [];
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  create: async (data: ProductFormData): Promise<Product> => {
    console.log("Sending product data:", data);
    const response = await api.post("/products", data);
    return response.data.data;
  },

  update: async (id: number, data: ProductFormData): Promise<Product> => {
    console.log("Updating product:", id, data);
    const response = await api.put(`/products/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};