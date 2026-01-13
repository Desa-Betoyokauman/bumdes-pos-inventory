"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useCartStore } from "../store/cart-store";

export function Cart() {
  const { items, updateQuantity, removeItem, getTotalAmount } = useCartStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Keranjang</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            Keranjang masih kosong
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keranjang ({items.length} item)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {item.product.code} • {formatCurrency(item.price)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    updateQuantity(item.product_id, value);
                  }}
                  className="h-8 w-16 text-center"
                  min={1}
                  max={item.product.stock}
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeItem(item.product_id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>

              <div className="w-24 text-right font-semibold">
                {formatCurrency(item.subtotal)}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(getTotalAmount())}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}