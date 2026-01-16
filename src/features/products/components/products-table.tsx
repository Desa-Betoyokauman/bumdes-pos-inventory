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
import { Edit, Trash2 } from "lucide-react";
import { Product } from "../types";

interface ProductsTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({ data, onEdit, onDelete }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama Produk",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue("name")}</p>
        {row.original.description && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {row.original.description}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => {
      const category = row.original.category;
      return category ? (
        <Badge variant="outline">{category.name}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  // 👇 ADD: Purchase Price Column
  {
    accessorKey: "purchase_price",
    header: "Harga Beli",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("purchase_price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
      return <span className="text-sm text-muted-foreground">{formatted}</span>;
    },
  },
  // 👇 UPDATE: Selling Price Column
  {
    accessorKey: "price",
    header: "Harga Jual",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const purchasePrice = row.original.purchase_price;
      const profit = price - purchasePrice;
      const profitMargin = purchasePrice > 0 ? ((profit / purchasePrice) * 100).toFixed(1) : "0";
      
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
      
      return (
        <div>
          <p className="font-medium">{formatted}</p>
          <p className="text-xs text-green-600">
            +{profitMargin}% margin
          </p>
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
        <div className="flex items-center gap-2">
          <Badge variant={isLowStock ? "destructive" : "default"}>
            {product.stock} {product.unit}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const product = row.original;
      const canDelete = product.stock === 0;
      
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            title="Edit produk"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product)}
            disabled={!canDelete}
            className="disabled:opacity-30 disabled:cursor-not-allowed"
            title={
              canDelete
                ? "Hapus produk"
                : "Produk tidak dapat dihapus (sudah pernah digunakan)"
            }
          >
            <Trash2 
              className={`h-4 w-4 ${canDelete ? 'text-destructive' : 'text-muted-foreground'}`} 
            />
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
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Menampilkan {table.getRowModel().rows.length} dari {data.length} produk
        </div>
        <div className="flex items-center space-x-2">
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
