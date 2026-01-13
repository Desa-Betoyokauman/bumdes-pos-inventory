"use client";

import { ProtectedRoute } from "@/shared/components/protected-route";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { StockMovementsTable } from "@/features/stock/components/stock-movements-table";
import { StockFormDialog } from "@/features/stock/components/stock-form-dialog";
import {
  useStockMovements,
  useCreateStockMovement,
} from "@/features/stock/hooks/use-stock";
import { StockMovementFormData } from "@/features/stock/types";

export default function StockPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: stockMovements = [], isLoading } = useStockMovements();
  const createMutation = useCreateStockMovement();

  const handleSubmit = (data: StockMovementFormData) => {
    createMutation.mutate(data);
  };

  const totalIn = stockMovements
    .filter((m) => m.type === "in")
    .reduce((sum, m) => sum + m.quantity, 0);

  const totalOut = stockMovements
    .filter((m) => m.type === "out")
    .reduce((sum, m) => sum + m.quantity, 0);

  return (
    <ProtectedRoute adminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stok</h1>
            <p className="text-muted-foreground">
              Kelola pergerakan stok produk
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Input Stok
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Masuk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{totalIn}</div>
              <p className="text-xs text-muted-foreground">Item masuk</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keluar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-{totalOut}</div>
              <p className="text-xs text-muted-foreground">Item keluar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pergerakan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockMovements.length}</div>
              <p className="text-xs text-muted-foreground">Total transaksi</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pergerakan Stok</CardTitle>
            <CardDescription>
              Daftar semua pergerakan stok masuk dan keluar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <p className="text-muted-foreground">Memuat data...</p>
              </div>
            ) : (
              <StockMovementsTable data={stockMovements} />
            )}
          </CardContent>
        </Card>

        <StockFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      </div>
    </ProtectedRoute>
  );
}