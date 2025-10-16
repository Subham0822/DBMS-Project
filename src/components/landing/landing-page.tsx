"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { initialDoctors, departments } from "@/lib/data";
import { HeartPulse, Stethoscope, Users, Moon, Sun, Menu } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuroraBackground } from "@/components/visuals/aurora";
import { TextType } from "@/components/visuals/text-type";
import { useEffect, useState } from "react";

export function LandingPage() {
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
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/95 backdrop-blur">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Logo />
            <span className="text-xl font-bold">MediSys</span>
          </Link>
          <nav className="ml-auto hidden lg:flex items-center gap-4 sm:gap-6">
            <Link
              href="#about"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              About
            </Link>
            <Link
              href="#services"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Services
            </Link>
            <Link
              href="#contact"
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
                href="#about"
                className="text-sm"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <Link
                href="#services"
                className="text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#contact"
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
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <AuroraBackground>
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                        <TextType
                          words={[
                            "Your Health, Our Priority",
                            "Care You Can Trust",
                            "Book. Track. Heal.",
                          ]}
                        />
                      </h1>
                      <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        MediSys provides world-class healthcare with a
                        compassionate touch. Book appointments, manage your
                        health records, and connect with expert doctors
                        seamlessly.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Button asChild size="lg">
                        <Link href="/login">Book an Appointment</Link>
                      </Button>
                      <Button asChild variant="secondary" size="lg">
                        <Link href="/about">Learn More</Link>
                      </Button>
                    </div>
                  </div>
                  <img
                    src="https://picsum.photos/seed/hero/600/400"
                    width="600"
                    height="400"
                    alt="Hero"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                    data-ai-hint="hospital building exterior"
                  />
                </div>
              </AuroraBackground>
            </div>
          </section>

          <section id="services" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                    Our Services
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Comprehensive Medical Departments
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We offer a wide range of specializations to cater to all
                    your health needs.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3">
                {departments.map((dept) => (
                  <Card
                    key={dept.name}
                    className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <dept.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dept.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section
            id="doctors"
            className="w-full py-12 md:py-24 lg:py-32 bg-muted"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                    Our Experts
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Meet Our Doctors
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our team of highly qualified and experienced doctors is here
                    to provide you with the best care.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12">
                {initialDoctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="text-center overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
                  >
                    <CardContent className="p-0">
                      <Avatar className="h-48 w-full rounded-none">
                        <AvatarImage
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="object-cover"
                        />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="p-4">
                        <h3 className="font-bold">{doctor.name}</h3>
                        <p className="text-sm text-primary">
                          {doctor.specialty}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl mb-12">
                What Our Patients Say
              </h2>
              <div className="mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src="https://picsum.photos/seed/p1/100/100"
                          alt="Patient"
                          data-ai-hint="person happy"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>John D.</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      "The care I received at MediSys was exceptional. The
                      doctors were knowledgeable and the staff was incredibly
                      friendly. Highly recommend!"
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src="https://picsum.photos/seed/p2/100/100"
                          alt="Patient"
                          data-ai-hint="person smiling"
                        />
                        <AvatarFallback>SS</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>Sarah S.</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      "Booking an appointment was so easy through their website.
                      The whole process was smooth and efficient from start to
                      finish."
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src="https://picsum.photos/seed/p3/100/100"
                          alt="Patient"
                          data-ai-hint="person content"
                        />
                        <AvatarFallback>MB</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>Mike B.</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      "A wonderful experience. The facilities are top-notch and
                      every interaction I had was positive. I felt genuinely
                      cared for."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">
            &copy; 2024 MediSys. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </ThemeProvider>
  );
}
