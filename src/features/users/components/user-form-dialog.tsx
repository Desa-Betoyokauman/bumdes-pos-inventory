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

// 👇 FIX: Separate form types for create and update
type CreateFormData = {
  username: string;
  password: string;
  name: string;
  role: "admin" | "cashier";
};

type UpdateFormData = {
  username: string;
  name: string;
  role: "admin" | "cashier";
};

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

  // 👇 FIX: Use conditional types
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateFormData | UpdateFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema) as any,
    defaultValues: isEdit
      ? {
          username: "",
          name: "",
          role: "cashier" as const,
        }
      : {
          username: "",
          password: "",
          name: "",
          role: "cashier" as const,
        },
  });

  const role = watch("role");

  useEffect(() => {
    if (user && open) {
      setValue("username", user.username);
      setValue("name", user.name);
      setValue("role", user.role);
    } else if (!open) {
      reset();
    }
  }, [user, open, setValue, reset]);

  const handleFormSubmit = (data: CreateFormData | UpdateFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Tambah User Baru"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update informasi user"
              : "Buat akun user baru untuk sistem"}
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

          {!isEdit && (
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
          )}

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
              {isLoading ? "Menyimpan..." : isEdit ? "Update" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
