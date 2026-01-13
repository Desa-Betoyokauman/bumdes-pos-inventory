"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ProductSearch } from "@/features/transactions/components/product-search";
import { Cart } from "@/features/transactions/components/cart";
import { PaymentDialog } from "@/features/transactions/components/payment-dialog";
import { useCartStore } from "@/features/transactions/store/cart-store";
import { useCreateTransaction } from "@/features/transactions/hooks/use-transactions";
import { Product } from "@/features/products/types";

export default function TransactionsPage() {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  const { items, addItem, getTotalAmount, getTotalItems, clearCart } = useCartStore();
  const createMutation = useCreateTransaction();

  const handleSelectProduct = (product: Product) => {
    if (product.stock > 0) {
      addItem(product, 1);
    }
  };

  const handlePayment = async (data: any) => {
    const transactionData = {
      payment_method: data.payment_method,
      payment_amount: data.payment_amount,
      notes: data.notes,
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    createMutation.mutate(transactionData, {
      onSuccess: () => {
        clearCart();
        setPaymentDialogOpen(false);
      },
    });
  };

  const totalAmount = getTotalAmount();
  const totalItems = getTotalItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kasir (POS)</h1>
          <p className="text-muted-foreground">
            Point of Sale - Transaksi Penjualan
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Product Search & Quick Access */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cari Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductSearch onSelectProduct={handleSelectProduct} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produk Populer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-sm text-muted-foreground py-8">
                Fitur produk populer akan ditampilkan di sini
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Cart & Checkout */}
        <div className="space-y-6">
          <Cart />

          {items.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Item:</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Bayar:</span>
                      <span>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Proses Pembayaran
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        totalAmount={totalAmount}
        onSubmit={handlePayment}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}