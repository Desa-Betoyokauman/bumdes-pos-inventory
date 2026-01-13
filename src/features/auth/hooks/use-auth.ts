import { useState, useEffect } from "react";
import { authService } from "../api/auth.service";
import type { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
  }, []);

  const isAdmin = user?.role === "admin";
  const isCashier = user?.role === "cashier";

  return {
    user,
    isAdmin,
    isCashier,
    isAuthenticated: !!user,
  };
};
