import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../api/categories.service";
import { CategoryFormData } from "../types";
import toast from "react-hot-toast";

/**
 * Hook untuk get all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes - categories jarang berubah
  });
}

/**
 * Hook untuk get single category
 */
export function useCategory(id: number) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id, // Only fetch if id exists
  });
}

/**
 * Hook untuk create category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      // Invalidate categories list untuk refresh
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil ditambahkan");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Gagal menambahkan kategori";
      toast.error(message);
    },
  });
}

/**
 * Hook untuk update category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryFormData }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil diperbarui");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Gagal memperbarui kategori";
      toast.error(message);
    },
  });
}

/**
 * Hook untuk delete category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil dihapus");
    },
    onError: (error: any) => {
      const message = 
        error.response?.data?.error || 
        "Gagal menghapus kategori. Mungkin masih ada produk yang menggunakan kategori ini.";
      toast.error(message);
    },
  });
}
