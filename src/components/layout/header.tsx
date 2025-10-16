"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { UserNav } from "@/components/layout/user-nav";
import { useAppContext } from "@/context/app-context";
import { SidebarTrigger } from "../ui/sidebar";

export function Header() {
  const { role } = useAppContext();
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <div className="mr-2 flex md:mr-4">
          <SidebarTrigger />
        </div>
        <div className="flex items-center space-x-4 lg:space-x-6">
          <h1 className="text-lg font-bold capitalize">{role} Dashboard</h1>
          <Badge variant="secondary" className="capitalize">
            {role}
          </Badge>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 hidden dark:block" />
            <Moon className="h-5 w-5 dark:hidden" />
          </Button>
          <UserNav />
        </div>
      </div>
      <div className="border-b"></div>
    </header>
  );
}
