"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useTodayTransactions } from "@/features/transactions/hooks/use-transactions";
import { useLowStockProducts } from "@/features/products/hooks/use-products"; // 👈 ADD
import { Badge } from "@/shared/components/ui/badge";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  AlertTriangle, // 👈 ADD
} from "lucide-react";

export default function DashboardPage() {
  const { data: summary, isLoading } = useTodayTransactions();
  const { data: lowStockProducts = [], isLoading: lowStockLoading } = useLowStockProducts(); // 👈 ADD

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview penjualan hari ini
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.total_revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari {summary?.total_transactions || 0} transaksi
            </p>
          </CardContent>
        </Card>

        {/* Net Profit - Only show if available */}
        {summary?.total_profit !== undefined && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Laba Bersih
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.total_profit)}
              </div>
              <p className="text-xs text-muted-foreground">
                Margin: {summary.profit_margin?.toFixed(1) || 0}%
              </p>
            </CardContent>
          </Card>
        )}

        {/* Total Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transaksi
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_transactions || 0}
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
              <span>💵 Tunai: {summary?.cash_payments || 0}</span>
              <span>💳 Transfer: {summary?.transfer_payments || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Items Sold */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Item Terjual
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_items_sold || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Unit produk terjual hari ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 👇 ADD: Low Stock Alerts + Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Peringatan Stok Rendah
              {lowStockProducts.length > 0 && (
                <Badge variant="destructive">{lowStockProducts.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.code}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={product.stock === 0 ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {product.stock === 0 ? "Habis" : `${product.stock} ${product.unit}`}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: {product.min_stock}
                      </p>
                    </div>
                  </div>
                ))}
                
                {lowStockProducts.length > 5 && (
                  <a
                    href="/dashboard/products?filter=low-stock"
                    className="block text-center text-sm text-primary hover:underline mt-2"
                  >
                    Lihat {lowStockProducts.length - 5} produk lainnya →
                  </a>
                )}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Semua stok aman
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="/dashboard/pos" 
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Point of Sale</p>
                <p className="text-xs text-muted-foreground">Mulai transaksi baru</p>
              </div>
            </a>
            
            <a 
              href="/dashboard/products" 
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Kelola Produk</p>
                <p className="text-xs text-muted-foreground">Update inventory & harga</p>
              </div>
            </a>

            <a 
              href="/dashboard/stock" 
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <TrendingUp className="h-5 w-5 text-primary" />
              <div className="flex items-center gap-2">
                <p className="font-medium">Stock Management</p>
                {lowStockProducts.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {lowStockProducts.length}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Kelola stok produk</p>
            </a>

            <a 
              href="/dashboard/reports" 
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Laporan Penjualan</p>
                <p className="text-xs text-muted-foreground">Lihat analisis lengkap</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
