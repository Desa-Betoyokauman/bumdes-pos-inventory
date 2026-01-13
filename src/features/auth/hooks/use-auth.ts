import { useState } from "react";
import { authService } from "../api/auth.service";
import type { User } from "../types";

export const useAuth = () => {
  // 👇 FIX: Initialize state directly instead of useEffect
  const [user] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    return authService.getUser();
  });

  const isAdmin = user?.role === "admin";
  const isCashier = user?.role === "cashier";

  return {
    user,
    isAdmin,
    isCashier,
    isAuthenticated: !!user,
  };
};
