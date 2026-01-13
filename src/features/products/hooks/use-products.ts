import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/products.service";
import { ProductFormData } from "../types";
import toast from "react-hot-toast";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getAll,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil ditambahkan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan produk");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil diupdate");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengupdate produk");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus produk");
    },
  });
};

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: productsApi.getLowStock,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
};