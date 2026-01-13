export interface Transaction {
  id: number;
  invoice_number: string;
  total_amount: number;
  payment_method: "cash" | "transfer";
  payment_amount: number;
  change_amount: number;
  notes?: string;
  items: TransactionItem[];
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id: number;
  transaction_id: number;
  product_id: number;
  product?: {
    id: number;
    name: string;
    code: string;
    price: number;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CreateTransactionRequest {
  payment_method: "cash" | "transfer";
  payment_amount: number;
  notes?: string;
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

export interface CartItem {
  product_id: number;
  product: {
    id: number;
    name: string;
    code: string;
    price: number;
    stock: number;
    unit: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

// Add Summary Type
export interface TodaySummary {
  total_transactions: number;
  total_revenue: number;
  cash_payments: number;
  transfer_payments: number;
  total_items_sold: number;
}