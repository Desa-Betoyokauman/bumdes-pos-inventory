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
  getFilteredRowModel,
  ColumnFiltersState,
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
import { Input } from "@/shared/components/ui/input";
import { Search, AlertTriangle, Package } from "lucide-react";
import { Product } from "../types";
import { Badge } from "@/shared/components/ui/badge";

interface LowStockTableProps {
  data: Product[];
  onRestockClick?: () => void;
}

export function LowStockTable({ data, onRestockClick }: LowStockTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "code",
      header: "Kode",
    },
    {
      accessorKey: "name",
      header: "Nama Produk",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => {
        return <div>{row.original.category?.name || "-"}</div>;
      },
    },
    {
      accessorKey: "stock",
      header: "Stok Saat Ini",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        const minStock = row.original.min_stock;
        const percentage = Math.round((stock / minStock) * 100);

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-destructive">
                {stock} {row.original.unit}
              </span>
              <Badge variant="destructive" className="text-xs">
                {percentage}%
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "min_stock",
      header: "Min. Stok",
      cell: ({ row }) => {
        return (
          <div>
            {row.original.min_stock} {row.original.unit}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Harga",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(price);
        return <div>{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        return (
          <Button
            size="sm"
            onClick={() => onRestockClick?.()} // 👈 UPDATE: Remove parameter
            className="gap-2"
          >
            <Package className="h-4 w-4" />
            Restock
          </Button>
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
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk stok rendah..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>
      </div>

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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="bg-destructive/5">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Package className="h-8 w-8" />
                    <p>Tidak ada produk dengan stok rendah 🎉</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} produk stok rendah
        </div>
        <div className="flex items-center gap-2">
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
    </div>
  );
}
