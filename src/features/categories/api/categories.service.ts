import { api } from "@/shared/lib/api";
import { Category, CategoryFormData } from "../types";

export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data.data || [];
  },

  /**
   * Get single category by ID
   */
  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  /**
   * Create new category
   * Only admin can create
   */
  create: async (data: CategoryFormData): Promise<Category> => {
    const response = await api.post("/categories", data);
    return response.data.data;
  },

  /**
   * Update existing category
   * Only admin can update
   */
  update: async (id: number, data: CategoryFormData): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete category
   * Only admin can delete
   * Backend will prevent deletion if category has products
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
