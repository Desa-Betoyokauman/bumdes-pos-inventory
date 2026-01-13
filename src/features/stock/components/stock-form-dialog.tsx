"use client";

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
import { StockMovementFormData } from "../types";
import { useProducts } from "@/features/products/hooks/use-products";

const stockSchema = z.object({
  product_id: z.number().min(1, "Produk wajib dipilih"),
  type: z.enum(["in", "out"], { message: "Tipe wajib dipilih" }),
  quantity: z.number().min(1, "Jumlah minimal 1"),
  note: z.string().optional(),
});

interface StockFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StockMovementFormData) => void;
  isLoading?: boolean;
}

export function StockFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: StockFormDialogProps) {
  const { data: products = [] } = useProducts();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockMovementFormData>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      product_id: 0,
      type: "in",
      quantity: 0,
      note: "",
    },
  });

  const productId = watch("product_id");
  const type = watch("type");

  const handleFormSubmit = (data: StockMovementFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Input Pergerakan Stok</DialogTitle>
          <DialogDescription>
            Catat stok masuk atau keluar produk
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produk *</Label>
            <Select
              value={productId?.toString()}
              onValueChange={(value) => setValue("product_id", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih produk" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.code} - {product.name} (Stok: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product_id && (
              <p className="text-sm text-destructive">{errors.product_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipe *</Label>
            <Select value={type} onValueChange={(value: "in" | "out") => setValue("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Stok Masuk</SelectItem>
                <SelectItem value="out">Stok Keluar</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Jumlah *</Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Catatan</Label>
            <Textarea
              id="note"
              {...register("note")}
              placeholder="Catatan (opsional)"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}