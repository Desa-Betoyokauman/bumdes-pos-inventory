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
import { useCategories } from "@/features/categories/hooks/use-categories";
import { Loader2 } from "lucide-react";

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

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  // Fetch categories from API
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

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
  const unit = watch("unit");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Nama Produk */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Nama Produk <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Misal: Beras Premium"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Kode Produk */}
        <div className="space-y-2">
          <Label htmlFor="code">
            Kode Produk <span className="text-destructive">*</span>
          </Label>
          <Input
            id="code"
            {...register("code")}
            placeholder="Misal: BRS-001"
            disabled={isLoading}
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        {/* Kategori - Dynamic from API */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Kategori <span className="text-destructive">*</span>
          </Label>
          <Select
            value={categoryId > 0 ? categoryId.toString() : ""}
            onValueChange={(value) => setValue("category_id", parseInt(value), {
              shouldValidate: true,
            })}
            disabled={isLoading || categoriesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm">Memuat...</span>
                </div>
              ) : categories.length === 0 ? (
                <div className="py-2 text-center text-sm text-muted-foreground">
                  Belum ada kategori
                </div>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-sm text-destructive">
              {errors.category_id.message}
            </p>
          )}
        </div>

        {/* Satuan */}
        <div className="space-y-2">
          <Label htmlFor="unit">
            Satuan <span className="text-destructive">*</span>
          </Label>
          <Select
            value={unit || ""}
            onValueChange={(value) => setValue("unit", value, {
              shouldValidate: true,
            })}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih satuan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pcs">Pcs (Pieces)</SelectItem>
              <SelectItem value="kg">Kg (Kilogram)</SelectItem>
              <SelectItem value="gram">Gram</SelectItem>
              <SelectItem value="liter">Liter</SelectItem>
              <SelectItem value="ml">Ml (Mililiter)</SelectItem>
              <SelectItem value="box">Box</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
              <SelectItem value="karton">Karton</SelectItem>
              <SelectItem value="lusin">Lusin</SelectItem>
            </SelectContent>
          </Select>
          {errors.unit && (
            <p className="text-sm text-destructive">{errors.unit.message}</p>
          )}
        </div>

        {/* Harga */}
        <div className="space-y-2">
          <Label htmlFor="price">
            Harga <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              Rp
            </span>
            <Input
              id="price"
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="0"
              className="pl-10"
              disabled={isLoading}
              min="0"
              step="100"
            />
          </div>
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        {/* Stok */}
        <div className="space-y-2">
          <Label htmlFor="stock">
            Stok Awal <span className="text-destructive">*</span>
          </Label>
          <Input
            id="stock"
            type="number"
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
            disabled={isLoading}
            min="0"
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>

        {/* Stok Minimum */}
        <div className="space-y-2">
          <Label htmlFor="min_stock">
            Stok Minimum <span className="text-destructive">*</span>
          </Label>
          <Input
            id="min_stock"
            type="number"
            {...register("min_stock", { valueAsNumber: true })}
            placeholder="0"
            disabled={isLoading}
            min="0"
          />
          {errors.min_stock && (
            <p className="text-sm text-destructive">
              {errors.min_stock.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Alert akan muncul jika stok mencapai jumlah ini
          </p>
        </div>
      </div>

      {/* Deskripsi */}
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Deskripsi produk (opsional)"
          rows={3}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </Button>
      </div>
    </form>
  );
}
