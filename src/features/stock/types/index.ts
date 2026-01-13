export interface StockMovement {
  id: number;
  product_id: number;
  product?: {
    id: number;
    name: string;
    code: string;
  };
  type: "in" | "out" | "adjustment";
  quantity: number;
  note?: string;  // Backend pakai 'note', bukan 'notes'
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface StockMovementFormData {
  product_id: number;
  type: "in" | "out";
  quantity: number;
  note?: string;  // Ganti dari 'notes' ke 'note'
}