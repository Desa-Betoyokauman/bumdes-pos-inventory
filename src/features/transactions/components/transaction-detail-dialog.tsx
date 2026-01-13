"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { Transaction } from "../types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Printer, User, Calendar, CreditCard } from "lucide-react";

interface TransactionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onPrint?: () => void;
}

export function TransactionDetailDialog({
  open,
  onOpenChange,
  transaction,
  onPrint,
}: TransactionDetailDialogProps) {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
          <DialogDescription>
            Invoice: {transaction.invoice_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Tanggal & Waktu</span>
              </div>
              <p className="text-sm font-medium">
                {format(new Date(transaction.created_at), "dd MMMM yyyy, HH:mm", {
                  locale: localeId,
                })}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Kasir</span>
              </div>
              <p className="text-sm font-medium">
                {transaction.user?.name || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Metode Pembayaran</span>
              </div>
              <Badge
                variant={
                  transaction.payment_method === "cash" ? "default" : "secondary"
                }
              >
                {transaction.payment_method === "cash" ? "Tunai" : "Transfer"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Items List */}
          <div className="space-y-3">
            <h4 className="font-semibold">Item Transaksi</h4>
            <div className="space-y-2">
              {transaction.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.product?.code}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        #{index + 1}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(item.price)} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        = {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-3">
            <h4 className="font-semibold">Ringkasan Pembayaran</h4>
            <div className="space-y-2 rounded-lg bg-muted p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Item:</span>
                <span className="font-medium">
                  {transaction.items.reduce((sum, item) => sum + item.quantity, 0)} item
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(transaction.total_amount)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total Bayar:</span>
                <span className="text-lg">
                  {formatCurrency(transaction.total_amount)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dibayar:</span>
                <span className="font-medium">
                  {formatCurrency(transaction.payment_amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kembali:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(transaction.change_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Catatan</h4>
                <p className="text-sm text-muted-foreground">
                  {transaction.notes}
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
            {onPrint && (
              <Button onClick={onPrint}>
                <Printer className="mr-2 h-4 w-4" />
                Cetak Struk
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
