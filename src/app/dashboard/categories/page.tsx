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
import { CategoriesTable } from "@/features/categories/components/categories-table";
import { CategoryDialog } from "@/features/categories/components/category-dialog";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/categories/hooks/use-categories";
import { Category, CategoryFormData } from "@/features/categories/types";

export default function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleSubmit = (data: CategoryFormData) => {
    if (selectedCategory) {
      updateMutation.mutate(
        { id: selectedCategory.id, data },
        {
          onSuccess: () => {
            setDialogOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <ProtectedRoute adminOnly> {/* 👈 WRAP */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
            <p className="text-muted-foreground">
              Kelola kategori produk untuk pengelompokan yang lebih baik
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Kategori</CardTitle>
            <CardDescription>
              Total {categories.length} kategori terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <p className="text-muted-foreground">Memuat data...</p>
              </div>
            ) : (
              <CategoriesTable
                data={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>

        <CategoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          category={selectedCategory}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </ProtectedRoute>
  );
}
