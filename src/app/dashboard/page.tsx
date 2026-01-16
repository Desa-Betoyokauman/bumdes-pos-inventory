"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useTodaySummary } from "@/features/transactions/hooks/use-transactions";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Percent
} from "lucide-react";

export default function DashboardPage() {
  const { data: summary, isLoading } = useTodaySummary();

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

        {/* 👇 ADD: Net Profit Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Laba Bersih
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary?.total_profit || 0)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Percent className="h-3 w-3" />
              <span>Margin: {summary?.profit_margin?.toFixed(1) || 0}%</span>
            </div>
          </CardContent>
        </Card>

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

      {/* 👇 ADD: Profit Breakdown Card */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analisis Profitabilitas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Pendapatan
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(summary?.total_revenue || 0)}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-blue-600" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 bg-green-50">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Laba Bersih
                </p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(summary?.total_profit || 0)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <Percent className="h-4 w-4" />
                  <span>{summary?.profit_margin?.toFixed(1) || 0}%</span>
                </div>
                <p className="text-xs text-muted-foreground">Margin</p>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              💡 <strong>Info:</strong> Laba dihitung dari (Harga Jual - Harga Beli) × Qty Terjual
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Recent Activity */}
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
