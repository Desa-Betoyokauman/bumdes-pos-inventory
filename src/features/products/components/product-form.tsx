"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { Product, ProductFormData } from "../types";
import { Separator } from "@/shared/components/ui/separator";

const productSchema = z.object({
  code: z.string().min(1, "Kode produk wajib diisi"),
  name: z.string().min(1, "Nama produk wajib diisi"),
  description: z.string().optional(),
  unit: z.string().min(1, "Satuan wajib diisi"),
  purchase_price: z.number().min(0, "Harga beli minimal 0"),
  price: z.number().min(1, "Harga jual minimal 1"),
  stock: z.number().min(0, "Stok minimal 0"),
  min_stock: z.number().min(0, "Min stok minimal 0"),
  category_id: z.number().min(1, "Kategori wajib dipilih"),
});

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ProductForm({
  product,
  onSubmit,
  isLoading,
  onCancel,
}: ProductFormProps) {
  const { data: categories = [] } = useCategories();
  const isEdit = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      unit: "pcs",
      purchase_price: 0,
      price: 0,
      stock: 0,
      min_stock: 5,
      category_id: 0,
    },
  });

  // Watch for price changes to calculate profit
  const purchasePrice = form.watch("purchase_price");
  const price = form.watch("price");
  
  // Calculate profit
  const profitAmount = price - purchasePrice;
  const profitMargin = purchasePrice > 0 
    ? ((profitAmount / purchasePrice) * 100).toFixed(1) 
    : "0";

  useEffect(() => {
    if (product) {
      form.reset({
        code: product.code,
        name: product.name,
        description: product.description || "",
        unit: product.unit,
        purchase_price: product.purchase_price,
        price: product.price,
        stock: product.stock,
        min_stock: product.min_stock,
        category_id: product.category_id,
      });
    }
  }, [product, form]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Produk *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="BRS-001"
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nama produk" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Deskripsi produk (opsional)"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satuan *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="pcs, kg, liter, dll" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Pricing Section */}
        <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
          <div>
            <h4 className="font-semibold text-sm mb-1">Pricing & Profitability</h4>
            <p className="text-xs text-muted-foreground">
              Set harga beli dan harga jual untuk menghitung profit
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="purchase_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Beli (Kulakan) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormDescription>Harga saat beli dari supplier</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Jual *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormDescription>Harga jual ke customer</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Profit Preview */}
          {purchasePrice > 0 && price > 0 && (
            <div className="rounded-lg bg-background border p-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Profit per unit:</span>
                <span className={`font-semibold text-base ${profitAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profitAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Margin:</span>
                <span className={`font-semibold ${parseFloat(profitMargin) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitMargin}%
                </span>
              </div>
              {profitAmount <= 0 && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Harga jual harus lebih besar dari harga beli
                </p>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Stock Section */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Awal *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      disabled={isEdit}
                    />
                  </FormControl>
                  {isEdit && (
                    <FormDescription>
                      Update stok melalui menu Stock Management
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="min_stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Stok *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      placeholder="5"
                    />
                  </FormControl>
                  <FormDescription>
                    Notifikasi saat stok mencapai batas ini
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : isEdit ? "Update" : "Tambah"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
