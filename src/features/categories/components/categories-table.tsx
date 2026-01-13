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
import { Edit, Trash2 } from "lucide-react";
import { Category } from "../types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface CategoriesTableProps {
  data: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoriesTable({ data, onEdit, onDelete }: CategoriesTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada kategori
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Klik tombol &lsquo;Tambah Kategori&rdquo; untuk menambahkan
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
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead>Diperbarui</TableHead>
            <TableHead className="text-right w-[120px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-mono text-sm">
                {category.id}
              </TableCell>
              <TableCell className="font-medium">
                {category.name}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(category.created_at), "dd MMM yyyy", {
                  locale: localeId,
                })}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(category.updated_at), "dd MMM yyyy", {
                  locale: localeId,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Hapus kategori "${category.name}"?`)) {
                        onDelete(category.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
