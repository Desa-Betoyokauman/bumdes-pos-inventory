"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
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
import { Edit, Trash2, AlertCircle } from "lucide-react";
import { Product } from "../types";

interface ProductsTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({ data, onEdit, onDelete }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "code",
      header: "Kode",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("code")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nama Produk",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div>
            <div className="font-medium">{product.name}</div>
            {product.category && (
              <div className="text-xs text-muted-foreground">
                {product.category.name}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "purchase_price",
      header: "Harga Beli",
      cell: ({ row }) => (
        <div className="text-right text-sm text-muted-foreground">
          {formatCurrency(row.getValue("purchase_price"))}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Harga Jual",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("price"))}
        </div>
      ),
    },
    {
      id: "profit",
      header: "Profit/Unit",
      cell: ({ row }) => {
        const product = row.original;
        const profit = product.price - product.purchase_price;
        const margin =
          product.purchase_price > 0
            ? ((profit / product.purchase_price) * 100).toFixed(1)
            : "0";

        return (
          <div className="text-right">
            <div
              className={`font-semibold text-sm ${
                profit > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(profit)}
            </div>
            <div className="text-xs text-muted-foreground">{margin}%</div>
          </div>
        );
      },
    },
    {
      accessorKey: "stock",
      header: "Stok",
      cell: ({ row }) => {
        const product = row.original;
        const isLowStock = product.stock <= product.min_stock;

        return (
          <div className="text-center">
            <Badge
              variant={
                product.stock === 0
                  ? "destructive"
                  : isLowStock
                  ? "outline"
                  : "secondary"
              }
            >
              {product.stock} {product.unit}
            </Badge>
            {isLowStock && product.stock > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                <AlertCircle className="h-3 w-3" />
                <span>Low</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Belum ada produk</p>
          <p className="text-xs text-muted-foreground mt-1">
            Klik &ldquo;Tambah Produk&rdquo; untuk mulai
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
