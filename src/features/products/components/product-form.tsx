"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { ProductFormData } from "../types";

const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  code: z.string().min(3, "Kode produk minimal 3 karakter"),
  category_id: z.number().min(1, "Kategori wajib dipilih"),
  price: z.number().min(0, "Harga minimal 0"),
  stock: z.number().min(0, "Stok minimal 0"),
  min_stock: z.number().min(0, "Stok minimum minimal 0"),
  unit: z.string().min(1, "Satuan wajib diisi"),
  description: z.string().optional(),
});

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      code: "",
      category_id: 0,
      price: 0,
      stock: 0,
      min_stock: 0,
      unit: "",
      description: "",
    },
  });

  const categoryId = watch("category_id");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Produk *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Misal: Beras Premium"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Kode Produk *</Label>
          <Input
            id="code"
            {...register("code")}
            placeholder="Misal: BRS-001"
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={categoryId?.toString()}
            onValueChange={(value) => setValue("category_id", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Sembako</SelectItem>
              <SelectItem value="2">Minuman</SelectItem>
              <SelectItem value="3">Snack</SelectItem>
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-sm text-destructive">{errors.category_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Satuan *</Label>
          <Select
            value={watch("unit")}
            onValueChange={(value) => setValue("unit", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih satuan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pcs">Pcs</SelectItem>
              <SelectItem value="kg">Kg</SelectItem>
              <SelectItem value="gram">Gram</SelectItem>
              <SelectItem value="liter">Liter</SelectItem>
              <SelectItem value="ml">Ml</SelectItem>
              <SelectItem value="box">Box</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>
          {errors.unit && (
            <p className="text-sm text-destructive">{errors.unit.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Harga *</Label>
          <Input
            id="price"
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stok *</Label>
          <Input
            id="stock"
            type="number"
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="min_stock">Stok Minimum *</Label>
          <Input
            id="min_stock"
            type="number"
            {...register("min_stock", { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.min_stock && (
            <p className="text-sm text-destructive">{errors.min_stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Deskripsi produk (opsional)"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}