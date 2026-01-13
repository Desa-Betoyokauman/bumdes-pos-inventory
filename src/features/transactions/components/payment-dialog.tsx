"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const paymentSchema = z.object({
  payment_method: z.enum(["cash", "transfer"]),
  payment_amount: z.number().min(0, "Jumlah pembayaran minimal 0"),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
}

export function PaymentDialog({
  open,
  onOpenChange,
  totalAmount,
  onSubmit,
  isLoading,
}: PaymentDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: "cash",
      payment_amount: totalAmount,
      notes: "",
    },
  });

  const paymentMethod = watch("payment_method");
  const paymentAmount = watch("payment_amount");
  const changeAmount = paymentAmount - totalAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
          <DialogDescription>
            Total yang harus dibayar: {formatCurrency(totalAmount)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value: "cash" | "transfer") =>
                setValue("payment_method", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_amount">
              {paymentMethod === "cash" ? "Uang Diterima" : "Jumlah Transfer"}
            </Label>
            <Input
              id="payment_amount"
              type="number"
              {...register("payment_amount", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.payment_amount && (
              <p className="text-sm text-destructive">
                {errors.payment_amount.message}
              </p>
            )}
          </div>

          {paymentMethod === "cash" && paymentAmount >= totalAmount && (
            <div className="rounded-lg bg-muted p-3">
              <div className="flex justify-between text-sm">
                <span>Kembalian:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(changeAmount)}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Catatan transaksi..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || paymentAmount < totalAmount}
            >
              {isLoading ? "Memproses..." : "Bayar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}