"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useProductStockHistory } from "../hooks/use-stock";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { StockMovement } from "../types"; // 👈 ADD THIS

interface StockHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName: string;
}

export function StockHistoryDialog({
  open,
  onOpenChange,
  productId,
  productName,
}: StockHistoryDialogProps) {
  const { data, isLoading } = useProductStockHistory(productId);

  // 👇 FIX: Access data correctly
  const movements = data?.movements || [];
  const product = data?.product;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "in":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "out":
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      case "adjustment":
        return <RefreshCw className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
      in: { variant: "default", label: "Masuk" },
      out: { variant: "secondary", label: "Keluar" },
      adjustment: { variant: "outline", label: "Adjustment" },
    };

    const config = variants[type] || { variant: "outline" as const, label: type };

    return (
      <Badge variant={config.variant} className="gap-1">
        {getTypeIcon(type)}
        {config.label}
      </Badge>
    );
  };

  const getQuantityDisplay = (type: string, quantity: number) => {
    const prefix = type === "in" ? "+" : type === "out" ? "-" : "";
    const colorClass = type === "in" ? "text-green-600" : type === "out" ? "text-blue-600" : "text-orange-600";

    return (
      <span className={`font-semibold ${colorClass}`}>
        {prefix}{quantity}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Riwayat Stok: {productName}</DialogTitle>
          <DialogDescription>
            History pergerakan stok produk ini
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : movements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <RefreshCw className="mb-2 h-12 w-12 opacity-50" />
              <p>Belum ada riwayat pergerakan stok</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement: StockMovement) => ( // 👈 FIX: Add type annotation
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {format(new Date(movement.created_at), "dd MMM yyyy", {
                              locale: idLocale,
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(movement.created_at), "HH:mm:ss")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(movement.type)}</TableCell>
                      <TableCell className="text-right">
                        {getQuantityDisplay(movement.type, movement.quantity)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-muted-foreground">
                          {movement.note || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {movement.user_id ? `User #${movement.user_id}` : "-"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {!isLoading && movements.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total: {movements.length} pergerakan</span>
              <span>
                Stok Saat Ini: <span className="font-semibold text-foreground">{product?.stock || 0}</span>
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
