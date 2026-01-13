import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockApi } from "../api/stock.service";
import { StockMovementFormData } from "../types";
import toast from "react-hot-toast";

export const useStockMovements = () => {
  return useQuery({
    queryKey: ["stock-movements"],
    queryFn: stockApi.getAll,
  });
};

export const useProductStockHistory = (productId: number) => {
  return useQuery({
    queryKey: ["stock-movements", "product", productId],
    queryFn: () => stockApi.getByProduct(productId),
    enabled: !!productId,
  });
};

export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stok berhasil diupdate");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal update stok";
      toast.error(message);
    },
  });
};