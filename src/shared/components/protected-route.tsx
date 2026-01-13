"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Skeleton } from "./ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (adminOnly && !isAdmin) {
      router.push("/dashboard");
    }
  }, [user, isAdmin, adminOnly, router]);

  if (!user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            Anda tidak memiliki akses ke halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
