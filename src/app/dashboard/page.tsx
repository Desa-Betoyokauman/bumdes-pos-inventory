"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Archive, AlertTriangle } from "lucide-react";
import { useProducts } from "@/features/products/hooks/use-products";
import { useTodayTransactions } from "@/features/transactions/hooks/use-transactions";
import { StockSummaryWidget } from "@/features/stock/components/stock-summary-widget"; // 👈 ADD THIS
import { Separator } from "@/shared/components/ui/separator"; // 👈 ADD THIS
import Link from "next/link"; // 👈 ADD THIS
import { Button } from "@/shared/components/ui/button"; // 👈 ADD THIS

export default function DashboardPage() {
  const { data: products = [], refetch: refetchProducts } = useProducts();
  const { data: todaySummary, refetch: refetchTransactions } = useTodayTransactions();

  useEffect(() => {
    refetchProducts();
    refetchTransactions();
  }, [refetchProducts, refetchTransactions]);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.min_stock).length;
  
  const todayRevenue = todaySummary?.total_revenue || 0;
  const todayTransactionsCount = todaySummary?.total_transactions || 0;

  const stats = [
    {
      title: "Total Produk",
      value: totalProducts.toString(),
      icon: Package,
      description: "Produk terdaftar",
    },
    {
      title: "Total Stok",
      value: totalStock.toString(),
      icon: Archive,
      description: "Item dalam stok",
      alert: lowStockCount > 0 ? `${lowStockCount} produk stok rendah` : undefined,
    },
    {
      title: "Transaksi Hari Ini",
      value: todayTransactionsCount.toString(),
      icon: ShoppingCart,
      description: "Transaksi berhasil",
    },
    {
      title: "Pendapatan Hari Ini",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(todayRevenue),
      icon: TrendingUp,
      description: "Total penjualan",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview sistem inventory BUMDes POS
        </p>
      </div>

      {/* Today Stats */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Statistik Hari Ini</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                {stat.alert && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    {stat.alert}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 👇 ADD Stock Summary Section */}
      <Separator />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ringkasan Stok</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/stock">Lihat Detail</Link>
          </Button>
        </div>
        <StockSummaryWidget />
      </div>

      {/* Low Stock Warning */}
      {lowStockCount > 0 && (
        <>
          <Separator />
          <Card className="border-destructive">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-destructive">
                ⚠️ Peringatan Stok Rendah
              </CardTitle>
              <Button variant="destructive" size="sm" asChild>
                <Link href="/dashboard/inventory/low-stock">
                  Lihat Semua ({lowStockCount})
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {products
                  .filter((p) => p.stock <= p.min_stock)
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.code}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-destructive">
                          Stok: {product.stock}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Min: {product.min_stock}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {lowStockCount > 5 && (
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  + {lowStockCount - 5} produk lainnya
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
