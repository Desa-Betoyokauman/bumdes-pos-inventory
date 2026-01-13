import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/users.service";
import { UserFormData, UpdateUserFormData, ChangePasswordFormData } from "../types";
import toast from "react-hot-toast";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil ditambahkan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan user");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserFormData }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil diupdate");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengupdate user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChangePasswordFormData }) =>
      usersApi.changePassword(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Password berhasil diubah");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengubah password");
    },
  });
};
