import { api } from "@/shared/lib/api";
import { Transaction, CreateTransactionRequest, TodaySummary } from "../types";

export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get("/transactions");
    return response.data.data.transactions || response.data.data || [];
  },

  getById: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  getByInvoice: async (invoice: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/invoice/${invoice}`);
    return response.data.data;
  },

  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await api.post("/transactions", data);
    return response.data.data;
  },

  getToday: async (): Promise<TodaySummary> => {
    const response = await api.get("/transactions/today");
    return response.data.data;
  },

  getSalesReport: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    
    const response = await api.get(`/transactions/report?${params.toString()}`);
    return response.data.data;
  },
};