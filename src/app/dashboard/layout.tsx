"use client";

import { useState, useEffect, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Archive,
  Folder,
  History,
  FileText,
  Menu,
  X,
  LogOut,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { authService } from "@/features/auth/api/auth.service";
import type { User } from "@/features/auth/types";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean; // 👈 ADD THIS
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Kasir (POS)",
    href: "/dashboard/transactions",
    icon: ShoppingCart,
  },
  {
    title: "Riwayat",
    href: "/dashboard/history",
    icon: History,
  },
  // 👇 ADMIN ONLY ITEMS
  {
    title: "Produk",
    href: "/dashboard/products",
    icon: Package,
    adminOnly: true, // 👈 ADD THIS
  },
  {
    title: "Kategori",
    href: "/dashboard/categories",
    icon: Folder,
    adminOnly: true, // 👈 ADD THIS
  },
  {
    title: "Stok",
    href: "/dashboard/stock",
    icon: Archive,
    adminOnly: true, // 👈 ADD THIS
  },
  {
    title: "Stok Rendah",
    href: "/dashboard/inventory/low-stock",
    icon: AlertTriangle,
    adminOnly: true, // 👈 ADD THIS
  },
  {
    title: "Laporan",
    href: "/dashboard/reports",
    icon: FileText,
    adminOnly: true, // 👈 ADD THIS
  },
  {
    title: "User Management",
    href: "/dashboard/settings/users",
    icon: Settings,
    adminOnly: true, // 👈 ADD THIS
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      const userData = authService.getUser();
      setUser(userData);
      setMounted(true);
    });
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  // 👇 ADD: Filter menu based on role
  const isAdmin = user?.role === "admin";
  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-card transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">BUMDes POS</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(!sidebarOpen && "mx-auto")}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu Items - 👇 USE FILTERED MENU */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !sidebarOpen && "justify-center"
                )}
                title={!sidebarOpen ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t p-4">
          {sidebarOpen ? (
            <div className="space-y-3">
              {mounted ? (
                <div className="text-sm">
                  <p className="font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role || "cashier"}
                  </p>
                </div>
              ) : (
                <div className="text-sm">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="mx-auto"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-card">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <h1 className="text-xl font-bold">BUMDes POS</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu - 👇 USE FILTERED MENU */}
            <nav className="space-y-1 p-2">
              {filteredMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 w-full border-t p-4">
              {mounted ? (
                <>
                  <div className="mb-3 text-sm">
                    <p className="font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role || "cashier"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-8 w-full animate-pulse rounded bg-muted" />
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar Mobile */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">BUMDes POS</h1>
          <div className="w-10" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
