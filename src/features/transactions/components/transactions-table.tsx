"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Eye, Printer } from "lucide-react";
import { Transaction } from "../types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface TransactionsTableProps {
  data: Transaction[];
  onViewDetail: (transaction: Transaction) => void;
  onPrint?: (transaction: Transaction) => void;
}

export function TransactionsTable({
  data,
  onViewDetail,
  onPrint,
}: TransactionsTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada transaksi
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Transaksi akan muncul di sini setelah checkout
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Invoice</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kasir</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead className="text-right">Bayar</TableHead>
            <TableHead className="text-right">Kembali</TableHead>
            <TableHead className="text-right w-[140px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-mono text-sm font-medium">
                {transaction.invoice_number}
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(transaction.created_at), "dd MMM yyyy HH:mm", {
                  locale: localeId,
                })}
              </TableCell>
              <TableCell className="text-sm">
                {transaction.user?.name || "-"}
              </TableCell>
              <TableCell className="text-right font-medium">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(transaction.total_amount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    transaction.payment_method === "cash"
                      ? "default"
                      : "secondary"
                  }
                >
                  {transaction.payment_method === "cash" ? "Tunai" : "Transfer"}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(transaction.payment_amount)}
              </TableCell>
              <TableCell className="text-right text-sm">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(transaction.change_amount)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail(transaction)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onPrint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPrint(transaction)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
