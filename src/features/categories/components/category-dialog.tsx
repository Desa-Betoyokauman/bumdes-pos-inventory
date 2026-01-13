"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { CategoryForm } from "./category-form";
import { Category, CategoryFormData } from "../types";
import { useEffect } from "react";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading,
}: CategoryDialogProps) {
  // Close dialog on successful submit
  useEffect(() => {
    if (!isLoading && !open) {
      // Dialog closed successfully
    }
  }, [isLoading, open]);

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Kategori" : "Tambah Kategori Baru"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Perbarui informasi kategori produk"
              : "Tambahkan kategori baru untuk mengelompokkan produk"}
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          defaultValues={
            category
              ? {
                  name: category.name,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
