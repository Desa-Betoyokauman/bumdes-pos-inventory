"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { DateRangePicker } from "@/features/transactions/components/date-range-picker";
import {
  useSalesReport,
  useTopProducts,
} from "@/features/transactions/hooks/use-transactions";
import { Badge } from "@/shared/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Package,
  Award,
  Download,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { TopProduct } from "@/features/transactions/types";

export default function ReportsPage() {
  // Default: Last 30 days
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: salesReport, isLoading: reportLoading } = useSalesReport(
    startDate,
    endDate
  );
  const { data: topProducts, isLoading: topProductsLoading } = useTopProducts(
    10,
    startDate,
    endDate
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportReport = () => {
    if (!salesReport) return;

    const reportData = [
      ["LAPORAN PENJUALAN"],
      [`Periode: ${format(new Date(startDate), "dd MMM yyyy")} - ${format(new Date(endDate), "dd MMM yyyy")}`],
      [""],
      ["RINGKASAN"],
      ["Total Transaksi", salesReport.total_transactions.toString()],
      ["Total Pendapatan", salesReport.total_revenue.toString()],
      ["Total Item Terjual", salesReport.total_items_sold.toString()],
      ["Rata-rata Transaksi", salesReport.average_transaction.toString()],
      ["Pendapatan Tunai", salesReport.cash_revenue.toString()],
      ["Pendapatan Transfer", salesReport.transfer_revenue.toString()],
      [""],
      ["PRODUK TERLARIS"],
      ["Nama Produk", "Kode", "Qty Terjual", "Total Pendapatan"],
      ...(topProducts || []).map((p: TopProduct) => [
        p.product_name,
        p.product_code,
        p.total_quantity.toString(),
        p.total_revenue.toString(),
      ]),
    ];

    const csvContent = reportData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `laporan_penjualan_${format(new Date(), "yyyyMMdd")}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Penjualan</h1>
          <p className="text-muted-foreground">
            Analisis performa penjualan dan produk terlaris
          </p>
        </div>
        <Button onClick={handleExportReport} disabled={!salesReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Laporan
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Periode Laporan</CardTitle>
          <CardDescription>
            Pilih rentang tanggal untuk melihat laporan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </CardContent>
      </Card>

      {reportLoading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Memuat laporan...</p>
        </div>
      ) : salesReport ? (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pendapatan
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(salesReport.total_revenue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(startDate), "dd MMM", { locale: localeId })} -{" "}
                  {format(new Date(endDate), "dd MMM yyyy", { locale: localeId })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Transaksi
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesReport.total_transactions}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Transaksi berhasil
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Item Terjual
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesReport.total_items_sold}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total produk terjual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rata-rata Transaksi
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(salesReport.average_transaction)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per transaksi
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Breakdown Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge>Tunai</Badge>
                    <span className="text-sm text-muted-foreground">
                      Cash Payment
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatCurrency(salesReport.cash_revenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {salesReport.total_revenue > 0
                        ? (
                            (salesReport.cash_revenue / salesReport.total_revenue) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Transfer</Badge>
                    <span className="text-sm text-muted-foreground">
                      Bank Transfer
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatCurrency(salesReport.transfer_revenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {salesReport.total_revenue > 0
                        ? (
                            (salesReport.transfer_revenue /
                              salesReport.total_revenue) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="mt-4">
                  <div className="h-8 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${
                          salesReport.total_revenue > 0
                            ? (salesReport.cash_revenue /
                                salesReport.total_revenue) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Tunai</span>
                    <span>Transfer</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Ringkasan Periode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between rounded-lg bg-muted p-3">
                  <span className="text-sm text-muted-foreground">
                    Periode Laporan
                  </span>
                  <span className="text-sm font-medium">
                    {format(new Date(startDate), "dd MMM", { locale: localeId })} -{" "}
                    {format(new Date(endDate), "dd MMM yyyy", { locale: localeId })}
                  </span>
                </div>

                <div className="flex justify-between rounded-lg bg-muted p-3">
                  <span className="text-sm text-muted-foreground">
                    Total Hari
                  </span>
                  <span className="text-sm font-medium">
                    {Math.ceil(
                      (new Date(endDate).getTime() -
                        new Date(startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) + 1}{" "}
                    hari
                  </span>
                </div>

                <div className="flex justify-between rounded-lg bg-muted p-3">
                  <span className="text-sm text-muted-foreground">
                    Rata-rata per Hari
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      salesReport.total_revenue /
                        (Math.ceil(
                          (new Date(endDate).getTime() -
                            new Date(startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) + 1)
                    )}
                  </span>
                </div>

                <div className="flex justify-between rounded-lg bg-muted p-3">
                  <span className="text-sm text-muted-foreground">
                    Produk Terlaris
                  </span>
                  <span className="text-sm font-medium">
                    {topProducts && topProducts.length > 0
                      ? topProducts[0].product_name
                      : "-"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Produk Terlaris
              </CardTitle>
              <CardDescription>
                10 produk dengan penjualan tertinggi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topProductsLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <p className="text-muted-foreground">Memuat data...</p>
                </div>
              ) : topProducts && topProducts.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Rank</TableHead>
                        <TableHead>Produk</TableHead>
                        <TableHead>Kode</TableHead>
                        <TableHead className="text-right">Qty Terjual</TableHead>
                        <TableHead className="text-right">Total Pendapatan</TableHead>
                        <TableHead className="text-right">Kontribusi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((product, index) => (
                        <TableRow key={product.product_id}>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              {index === 0 ? (
                                <Badge className="bg-yellow-500">🥇</Badge>
                              ) : index === 1 ? (
                                <Badge className="bg-gray-400">🥈</Badge>
                              ) : index === 2 ? (
                                <Badge className="bg-orange-600">🥉</Badge>
                              ) : (
                                <span className="text-muted-foreground">
                                  #{index + 1}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.product_name}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {product.product_code}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {product.total_quantity}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(product.total_revenue)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {(
                                (product.total_revenue / salesReport.total_revenue) *
                                100
                              ).toFixed(1)}
                              %
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Tidak ada data produk
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex h-48 items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Pilih periode untuk melihat laporan
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
