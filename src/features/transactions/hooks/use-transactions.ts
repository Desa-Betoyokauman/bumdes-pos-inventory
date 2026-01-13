import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../api/transactions.service";
import { CreateTransactionRequest, TransactionFilters } from "../types";
import toast from "react-hot-toast";

/**
 * Hook untuk get all transactions dengan filters
 */
export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionsApi.getAll(filters),
  });
}

/**
 * Hook untuk get single transaction
 */
export function useTransaction(id: number) {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook untuk get transaction by invoice
 */
export function useTransactionByInvoice(invoice: string) {
  return useQuery({
    queryKey: ["transactions", "invoice", invoice],
    queryFn: () => transactionsApi.getByInvoice(invoice),
    enabled: !!invoice,
  });
}

/**
 * Hook untuk today's summary
 */
export function useTodayTransactions() {
  return useQuery({
    queryKey: ["transactions", "today"],
    queryFn: transactionsApi.getToday,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Hook untuk sales report
 */
export function useSalesReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["transactions", "report", startDate, endDate],
    queryFn: () => transactionsApi.getSalesReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

/**
 * Hook untuk top products
 */
export function useTopProducts(limit = 10, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["transactions", "top-products", limit, startDate, endDate],
    queryFn: () => transactionsApi.getTopProducts(limit, startDate, endDate),
  });
}

/**
 * Hook untuk create transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Refresh products (stock updated)
      toast.success(`Transaksi berhasil! Invoice: ${data.invoice_number}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Transaksi gagal";
      toast.error(message);
    },
  });
}
