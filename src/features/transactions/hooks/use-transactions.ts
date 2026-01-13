import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../api/transactions.service";
import { CreateTransactionRequest, TodaySummary } from "../types";
import toast from "react-hot-toast";

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsApi.getAll,
  });
};

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  });
};

export const useTodayTransactions = () => {
  return useQuery<TodaySummary>({
    queryKey: ["transactions", "today"],
    queryFn: () => transactionsApi.getToday(), // Tambah arrow function
    refetchInterval: 30000,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      
      toast.success("Transaksi berhasil!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal membuat transaksi";
      toast.error(message);
    },
  });
};