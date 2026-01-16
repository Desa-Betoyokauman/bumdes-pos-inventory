"use client";

import { useState, useRef, useEffect, startTransition } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import { TransactionDetailDialog } from "@/features/transactions/components/transaction-detail-dialog";
import { InvoicePreview } from "@/features/transactions/components/invoice-preview";
import { DateRangePicker } from "@/features/transactions/components/date-range-picker";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { transactionsApi } from "@/features/transactions/api/transactions.service";
import { Transaction, TransactionFilters } from "@/features/transactions/types";
import { Search, Filter, Download, RefreshCw, X } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { ReceiptPrinter } from "@/features/transactions/components/receipt-printer";

export default function TransactionHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 20,
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<Transaction[]>([]);
  const [searching, setSearching] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  // Regular transaction list query
  const { data, isLoading, refetch } = useTransactions(
    searchMode ? undefined : filters
  );

  // Determine which data to display
  const transactions = searchMode ? searchResults : (data?.transactions || []);
  const pagination = searchMode ? undefined : data?.pagination;
  const loading = searchMode ? searching : isLoading;

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: selectedTransaction?.invoice_number 
      ? `Invoice-${selectedTransaction.invoice_number}` 
      : "Invoice",
  });

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailOpen(true);
  };

  const handlePrintInvoice = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    
    setTimeout(() => {
      // Create new window for print
      const printWindow = window.open("", "_blank");
      
      if (printWindow && invoiceRef.current) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Struk ${transaction.invoice_number}</title>
            <style>
              @page {
                size: 58mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: 'Courier New', 'Consolas', monospace;
              }
              @media print {
                body {
                  width: 58mm;
                }
              }
            </style>
          </head>
          <body>
            ${invoiceRef.current.innerHTML}
          </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }, 100);
  };

  const handleSearch = async () => {
    const trimmedInput = searchInput.trim();
    
    if (!trimmedInput) {
      toast.error("Masukkan invoice number untuk mencari");
      return;
    }

    try {
      setSearching(true);
      
      // Call API to search by invoice
      const transaction = await transactionsApi.getByInvoice(trimmedInput);
      
      // Success - found transaction
      setSearchMode(true);
      setSearchResults([transaction]);
      toast.success("Invoice ditemukan!");
      
    } catch (error: any) {
      // Error - invoice not found
      const message = error.response?.data?.error || "Invoice tidak ditemukan";
      toast.error(message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchMode(false);
    setSearchResults([]);
    setSearchInput("");
    refetch();
  };

  const handleDateRangeApply = () => {
    if (searchMode) {
      handleClearSearch();
    }
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 20 });
    setSearchInput("");
    setSearchMode(false);
    setSearchResults([]);
  };

  const handleExportCSV = () => {
    if (!mounted || transactions.length === 0) return;

    const headers = ["Invoice", "Tanggal", "Kasir", "Total", "Pembayaran", "Bayar", "Kembali"];
    const rows = transactions.map((t) => [
      t.invoice_number,
      format(new Date(t.created_at), "dd/MM/yyyy HH:mm"),
      t.user?.name || "-",
      t.total_amount,
      t.payment_method === "cash" ? "Tunai" : "Transfer",
      t.payment_amount,
      t.change_amount,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${format(new Date(), "yyyyMMdd")}.csv`;
    link.click();
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Transaksi</h1>
          <p className="text-muted-foreground">
            Lihat dan kelola semua transaksi penjualan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search Active Badge */}
      {searchMode && (
        <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 p-4">
          <Search className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              Hasil pencarian untuk: <span className="font-mono">{searchInput}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {searchResults.length > 0 ? "Transaksi ditemukan" : "Tidak ada hasil"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      )}

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range Filter */}
          <DateRangePicker
            startDate={filters.start_date}
            endDate={filters.end_date}
            onStartDateChange={(date) =>
              setFilters((prev) => ({ ...prev, start_date: date }))
            }
            onEndDateChange={(date) =>
              setFilters((prev) => ({ ...prev, end_date: date }))
            }
            onApply={handleDateRangeApply}
            onClear={handleClearFilters}
          />

          {/* Search & Payment Method Filter */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search Input */}
            <div className="flex flex-1 gap-2">
              <Input
                placeholder="Cari invoice number..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchInput.trim()) {
                    handleSearch();
                  }
                }}
                disabled={searching}
              />
              <Button 
                onClick={handleSearch} 
                disabled={!searchInput.trim() || searching}
              >
                {searching ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Payment Method Select */}
            <Select
              value={filters.payment_method || "all"}
              onValueChange={(value) => {
                const newValue = value === "all" ? undefined : (value as "cash" | "transfer");
                setFilters((prev) => ({
                  ...prev,
                  payment_method: newValue,
                  page: 1,
                }));
                // Exit search mode when filtering
                if (searchMode) {
                  handleClearSearch();
                }
              }}
              disabled={searchMode}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Semua Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
          <CardDescription>
            {searchMode ? (
              `Hasil pencarian: ${searchResults.length} transaksi`
            ) : pagination ? (
              <>
                Menampilkan {transactions.length} dari {pagination.total} transaksi
                {filters.start_date && filters.end_date && (
                  <> · {format(new Date(filters.start_date), "dd MMM")} - {format(new Date(filters.end_date), "dd MMM yyyy")}</>
                )}
              </>
            ) : (
              "Memuat data..."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="text-center">
                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                <p className="text-muted-foreground">
                  {searching ? "Mencari invoice..." : "Memuat data..."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <TransactionsTable
                data={transactions}
                onViewDetail={handleViewDetail}
                onPrint={handlePrintInvoice}
              />

              {/* Pagination - Hide in search mode */}
              {!searchMode && pagination && pagination.total_page > 1 && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Halaman {pagination.page} dari {pagination.total_page}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: (prev.page || 1) - 1,
                        }))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.total_page}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: (prev.page || 1) + 1,
                        }))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      <TransactionDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        transaction={selectedTransaction}
        onPrint={selectedTransaction ? () => handlePrintInvoice(selectedTransaction) : undefined}
      />

      {/* Hidden Receipt for Print */}
      <div className="hidden">
        {selectedTransaction && (
          <div ref={invoiceRef}>
            <ReceiptPrinter
              transaction={selectedTransaction}
              storeName="BUMDes Desa Betoyokauman"
              storeAddress="Desa Betoyokauman, Jawa Timur"
            />
          </div>
        )}
      </div>
    </div>
  );
}
