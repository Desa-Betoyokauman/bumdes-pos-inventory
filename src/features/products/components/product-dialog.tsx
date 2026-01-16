"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ProductForm } from "./product-form";
import { Product, ProductFormData } from "../types";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading,
}: ProductDialogProps) {
  const handleSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update informasi produk di bawah ini."
              : "Isi form untuk menambahkan produk baru ke inventory."}
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
