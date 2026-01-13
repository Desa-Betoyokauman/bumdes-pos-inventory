"use client";

import { ProtectedRoute } from "@/shared/components/protected-route";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Plus, Users as UsersIcon, Shield, UserCircle } from "lucide-react";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useChangePassword } from "@/features/users/hooks/use-users";
import { UsersTable } from "@/features/users/components/users-table";
import { UserFormDialog } from "@/features/users/components/user-form-dialog";
import { ChangePasswordDialog } from "@/features/users/components/change-password-dialog";
import { User } from "@/features/users/types";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { authService } from "@/features/auth/api/auth.service";

export default function UsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const changePassword = useChangePassword();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const currentUser = authService.getUser();
  const currentUserId = currentUser?.id;

  const handleCreate = () => {
    setSelectedUser(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormDialogOpen(true);
  };

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setPasswordDialogOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedUser) {
      updateUser.mutate({ id: selectedUser.id, data });
    } else {
      createUser.mutate(data);
    }
  };

  const handlePasswordSubmit = (data: { password: string }) => {
    if (selectedUser) {
      changePassword.mutate({ id: selectedUser.id, data });
    }
  };

  const handleDelete = (id: number) => {
    deleteUser.mutate(id);
  };

  const adminCount = users.filter((u) => u.role === "admin").length;
  const cashierCount = users.filter((u) => u.role === "cashier").length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Kelola akun pengguna sistem
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah User
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Pengguna terdaftar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminCount}</div>
              <p className="text-xs text-muted-foreground">
                Role administrator
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cashier</CardTitle>
              <UserCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cashierCount}</div>
              <p className="text-xs text-muted-foreground">
                Role kasir
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar User</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable
              data={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChangePassword={handleChangePassword}
              currentUserId={currentUserId}
            />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <UserFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          onSubmit={handleFormSubmit}
          user={selectedUser}
          isLoading={createUser.isPending || updateUser.isPending}
        />

        {selectedUser && (
          <ChangePasswordDialog
            open={passwordDialogOpen}
            onOpenChange={setPasswordDialogOpen}
            onSubmit={handlePasswordSubmit}
            userName={selectedUser.name}
            isLoading={changePassword.isPending}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
