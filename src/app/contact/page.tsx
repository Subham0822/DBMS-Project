"use client";

import { LandingPageLayout } from "@/components/landing/landing-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <LandingPageLayout>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              We're here to help. Reach out to us with any questions or
              concerns.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Get in Touch
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>
            </div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submitted!");
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Subject of your message"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here."
                  className="min-h-[120px]"
                  required
                />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Our Location
              </h2>
              <p className="text-muted-foreground">
                Find us at our main campus or contact us directly.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">MediSys Hospital</h3>
                  <p className="text-muted-foreground">
                    123 Health St, Wellness City, 12345
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">General Inquiries</h3>
                  <p className="text-muted-foreground">(123) 456-7890</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-muted-foreground">contact@medisys.com</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="https://picsum.photos/seed/map/600/400"
                alt="Map"
                className="w-full h-auto"
                data-ai-hint="map city"
              />
            </div>
          </div>
        </div>
      </section>
    </LandingPageLayout>
  );
}
