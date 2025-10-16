import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function LandingPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/95 backdrop-blur">
                <Link href="/" className="flex items-center justify-center gap-2">
                    <Logo />
                    <span className="text-xl font-bold">MediSys</span>
                </Link>
                <nav className="ml-auto hidden lg:flex gap-4 sm:gap-6">
                    <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
                        About
                    </Link>
                    <Link href="/services" className="text-sm font-medium hover:underline underline-offset-4">
                        Services
                    </Link>
                    <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
                        Contact
                    </Link>
                    <Button variant="outline" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/login">Book Appointment</Link>
                    </Button>
                </nav>
                <div className="ml-auto lg:hidden">
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">&copy; 2024 MediSys. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link href="#" className="text-xs hover:underline underline-offset-4">
                    Terms of Service
                </Link>
                <Link href="#" className="text-xs hover:underline underline-offset-4">
                    Privacy
                </Link>
                </nav>
            </footer>
        </div>
    );
}
