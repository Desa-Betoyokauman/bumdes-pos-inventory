import { api } from "@/shared/lib/api";
import { StockMovement, StockMovementFormData, StockSummary, StockHistoryResponse } from "../types";

export const stockApi = {
  getAll: async (): Promise<StockMovement[]> => {
    const response = await api.get("/stock/movements");  // Ganti endpoint
    return response.data.data.movements || [];
  },

  create: async (data: StockMovementFormData): Promise<StockMovement> => {
    const response = await api.post("/stock/movement", data);  // Ganti endpoint
    return response.data.data.movement;
  },

  getByProduct: async (productId: number): Promise<StockHistoryResponse> => { // 👈 UPDATE return type
    const response = await api.get(`/stock/movements/product/${productId}`);
    return response.data.data;
  },

  getSummary: async (): Promise<StockSummary> => {
    const response = await api.get("/stock/summary");
    return response.data.data;
  },
};