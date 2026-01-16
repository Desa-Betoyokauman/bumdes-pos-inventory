"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ProductsTable } from "@/features/products/components/products-table";
import { ProductDialog } from "@/features/products/components/product-dialog";
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from "@/features/products/hooks/use-products";
import { Product, ProductFormData } from "@/features/products/types";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleAddNew = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  // 👇 FIX: Accept Product object, not number
  const handleDelete = async (product: Product) => {
    if (confirm(`Hapus produk "${product.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(product.id);
        toast.success("Produk berhasil dihapus");
      } catch (error: any) {
        const message = error.response?.data?.error || "Gagal menghapus produk";
        toast.error(message);
      }
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (selectedProduct) {
        // Update existing product
        await updateMutation.mutateAsync({
          id: selectedProduct.id,
          data,
        });
        toast.success("Produk berhasil diupdate");
      } else {
        // Create new product
        await createMutation.mutateAsync(data);
        toast.success("Produk berhasil ditambahkan");
      }
      setDialogOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      const message = error.response?.data?.error || "Gagal menyimpan produk";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produk</h1>
          <p className="text-muted-foreground">Kelola produk inventory</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <ProductsTable
              data={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
