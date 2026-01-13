"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle,
  Boxes,
  XCircle
} from "lucide-react";
import { useStockSummary } from "../hooks/use-stock";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function StockSummaryWidget() {
  const { data: summary, isLoading } = useStockSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="mt-1 h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const stockCards = [
    {
      title: "Stok Masuk (Hari Ini)",
      value: summary.total_stock_in_today.toLocaleString("id-ID"),
      icon: TrendingUp,
      description: "Total item masuk",
      color: "text-green-600",
    },
    {
      title: "Stok Keluar (Hari Ini)",
      value: summary.total_stock_out_today.toLocaleString("id-ID"),
      icon: TrendingDown,
      description: "Total item keluar",
      color: "text-blue-600",
    },
    {
      title: "Nilai Total Inventory",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(summary.total_stock_value),
      icon: Boxes,
      description: "Total nilai stok",
      color: "text-purple-600",
    },
    {
      title: "Produk Stok Rendah",
      value: summary.low_stock_count.toString(),
      icon: AlertTriangle,
      description: "Perlu perhatian",
      color: summary.low_stock_count > 0 ? "text-destructive" : "text-muted-foreground",
      alert: summary.low_stock_count > 0,
    },
    {
      title: "Produk Stok Habis",
      value: summary.out_of_stock_count.toString(),
      icon: XCircle,
      description: "Tidak dapat dijual",
      color: summary.out_of_stock_count > 0 ? "text-destructive" : "text-muted-foreground",
      alert: summary.out_of_stock_count > 0,
    },
    {
      title: "Total Produk Aktif",
      value: summary.total_products.toString(),
      icon: Package,
      description: "Produk terdaftar",
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stockCards.map((card) => (
        <Card 
          key={card.title}
          className={card.alert ? "border-destructive" : ""}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.alert ? "text-destructive" : ""}`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
