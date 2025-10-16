"use client";

import React, { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { MainNav } from "@/components/layout/main-nav";
import { useAppContext } from "@/context/app-context";
import { Logo } from "@/components/logo";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  // Basic guard: redirect to /login if not authenticated (client-side only)
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">MediSys</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <MainNav role={role} />
        </SidebarContent>
        <SidebarFooter>{/* Footer content if any */}</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
