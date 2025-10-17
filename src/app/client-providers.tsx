"use client";

import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/context/app-context";
import { ThemeProvider } from "@/components/theme-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        {children}
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  );
}
