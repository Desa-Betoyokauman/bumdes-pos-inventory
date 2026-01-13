"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import { useLowStockProducts } from "@/features/products/hooks/use-products";
import { LowStockTable } from "@/features/products/components/low-stock-table";
import { Product } from "@/features/products/types";
import { StockFormDialog } from "@/features/stock/components/stock-form-dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useCreateStockMovement } from "@/features/stock/hooks/use-stock"; // 👈 ADD THIS
import { StockMovementFormData } from "@/features/stock/types"; // 👈 ADD THIS

export default function LowStockPage() {
  const { data: lowStockProducts = [], isLoading } = useLowStockProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const createStockMovement = useCreateStockMovement(); // 👈 ADD THIS

  // 👇 UPDATE handleRestockClick
  const handleRestockClick = () => {
    setDialogOpen(true);
  };

  // 👇 ADD handleStockSubmit
  const handleStockSubmit = (data: StockMovementFormData) => {
    createStockMovement.mutate(data);
  };

  const totalStockValue = lowStockProducts.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  const criticalCount = lowStockProducts.filter(
    (p) => p.stock === 0
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Produk Stok Rendah
        </h1>
        <p className="text-muted-foreground">
          Monitor dan kelola produk dengan stok di bawah minimum
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Produk Stok Rendah
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Perlu perhatian segera
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produk Stok Habis
            </CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {criticalCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Tidak dapat dijual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Nilai Stok
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(totalStockValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Nilai stok tersisa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <LowStockTable
            data={lowStockProducts}
            onRestockClick={handleRestockClick}
          />
        </CardContent>
      </Card>

      {/* Restock Dialog - 👇 UPDATE INI */}
      <StockFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleStockSubmit}
        isLoading={createStockMovement.isPending}
      />
    </div>
  );
}
