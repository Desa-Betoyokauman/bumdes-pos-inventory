"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { User } from "../types";

const createUserSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().min(1, "Nama wajib diisi"),
  role: z.enum(["admin", "cashier"], { message: "Role wajib dipilih" }),
});

const updateUserSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  name: z.string().min(1, "Nama wajib diisi"),
  role: z.enum(["admin", "cashier"], { message: "Role wajib dipilih" }),
});

type CreateFormData = z.infer<typeof createUserSchema>;
type UpdateFormData = z.infer<typeof updateUserSchema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateFormData | UpdateFormData) => void;
  user?: User | null;
  isLoading?: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  user,
  isLoading,
}: UserFormDialogProps) {
  const isEdit = !!user;

  return isEdit ? (
    <UpdateUserForm
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      user={user}
      isLoading={isLoading}
    />
  ) : (
    <CreateUserForm
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
}

// Create User Form Component
function CreateUserForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateFormData) => void;
  isLoading?: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      role: "cashier",
    },
  });

  const role = watch("role");

  const handleFormSubmit = (data: CreateFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah User Baru</DialogTitle>
          <DialogDescription>
            Buat akun user baru untuk sistem
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="username"
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nama lengkap"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={role}
              onValueChange={(value: "admin" | "cashier") =>
                setValue("role", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Update User Form Component
function UpdateUserForm({
  open,
  onOpenChange,
  onSubmit,
  user,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateFormData) => void;
  user: User;
  isLoading?: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user.username,
      name: user.name,
      role: user.role,
    },
  });

  const role = watch("role");

  useEffect(() => {
    if (open) {
      setValue("username", user.username);
      setValue("name", user.name);
      setValue("role", user.role);
    }
  }, [user, open, setValue]);

  const handleFormSubmit = (data: UpdateFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update informasi user</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="username"
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nama lengkap"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={role}
              onValueChange={(value: "admin" | "cashier") =>
                setValue("role", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
