import { api } from "@/shared/lib/api";
import {
  Transaction,
  CreateTransactionRequest,
  TodaySummary,
  SalesReport,
  TransactionFilters,
} from "../types";

export const transactionsApi = {
  /**
   * Get all transactions with filters & pagination
   */
  getAll: async (filters?: TransactionFilters): Promise<{
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_page: number;
    };
  }> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.payment_method) params.append("payment_method", filters.payment_method);

    const response = await api.get(`/transactions?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get single transaction by ID
   */
  getById: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  /**
   * Get transaction by invoice number
   */
  getByInvoice: async (invoice: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/invoice/${invoice}`);
    return response.data.data;
  },

  /**
   * Create new transaction (checkout)
   */
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await api.post("/transactions", data);
    return response.data.data;
  },

  /**
   * Get today's summary
   */
  getToday: async (): Promise<TodaySummary> => {
    const response = await api.get("/transactions/today");
    return response.data.data;
  },

  /**
   * Get sales report by date range
   */
  getSalesReport: async (startDate?: string, endDate?: string): Promise<SalesReport> => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const response = await api.get(`/transactions/report?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get top selling products
   */
  getTopProducts: async (limit = 10, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const response = await api.get(`/transactions/top-products?${params.toString()}`);
    return response.data.data;
  },
};
