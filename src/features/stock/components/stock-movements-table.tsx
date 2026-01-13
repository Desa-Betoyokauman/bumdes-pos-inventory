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
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { StockMovement } from "../types";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface StockMovementsTableProps {
  data: StockMovement[];
}

export function StockMovementsTable({ data }: StockMovementsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<StockMovement>[] = [
    {
      accessorKey: "created_at",
      header: "Waktu",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString("id-ID")}</div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true, locale: localeId })}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "product",
      header: "Produk",
      cell: ({ row }) => {
        const product = row.original.product;
        return (
          <div>
            <div className="font-medium">{product?.name}</div>
            <div className="text-xs text-muted-foreground">{product?.code}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Tipe",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const isIn = type === "in";
        return (
          <div className="flex items-center gap-2">
            {isIn ? (
              <>
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Masuk</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 text-red-600" />
                <span className="text-red-600 font-medium">Keluar</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Jumlah",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const quantity = row.getValue("quantity") as number;
        const isIn = type === "in";
        return (
          <div className={isIn ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
            {isIn ? "+" : "-"}{quantity}
          </div>
        );
      },
    },
    {
      accessorKey: "note",
      header: "Catatan",
      cell: ({ row }) => {
        const note = row.getValue("note") as string;
        return <div className="text-sm text-muted-foreground">{note || "-"}</div>;
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            value={(table.getColumn("product")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("product")?.setFilterValue(event.target.value)
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
                  Tidak ada riwayat pergerakan stok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} pergerakan
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