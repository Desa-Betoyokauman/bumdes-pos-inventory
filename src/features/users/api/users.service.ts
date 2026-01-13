import { api } from "@/shared/lib/api";
import { User, UserFormData, UpdateUserFormData, ChangePasswordFormData } from "../types";

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data.data.users || [];
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data.user;
  },

  create: async (data: UserFormData): Promise<User> => {
    const response = await api.post("/users", data);
    return response.data.data.user;
  },

  update: async (id: number, data: UpdateUserFormData): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data.user;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  changePassword: async (id: number, data: ChangePasswordFormData): Promise<void> => {
    await api.put(`/users/${id}/password`, data);
  },
};
