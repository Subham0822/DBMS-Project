"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Moon, Sun, Menu } from "lucide-react";
import { useEffect, useState } from "react";

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      localStorage.getItem("theme")) as "light" | "dark" | null;
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (typeof window !== "undefined") localStorage.setItem("theme", next);
    const root = document.documentElement;
    if (next === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  };

  return (
    <>
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/95 backdrop-blur">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Logo />
          <span className="text-xl font-bold">MediSys</span>
        </Link>
        <nav className="ml-auto hidden lg:flex items-center gap-4 sm:gap-6">
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Contact
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 hidden dark:block" />
            <Moon className="h-5 w-5 dark:hidden" />
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Book Appointment</Link>
          </Button>
        </nav>
        <div className="ml-auto lg:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 hidden dark:block" />
            <Moon className="h-5 w-5 dark:hidden" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>
      {mobileOpen && (
        <div className="lg:hidden border-b bg-background">
          <nav className="container px-4 py-3 flex flex-col gap-3">
            <Link
              href="/about"
              className="text-sm"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                asChild
                className="flex-1"
                onClick={() => setMobileOpen(false)}
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="flex-1"
                onClick={() => setMobileOpen(false)}
              >
                <Link href="/login">Book Appointment</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
