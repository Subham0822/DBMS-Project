"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function AuroraBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-20 h-[40rem] w-[40rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-20 right-0 h-[35rem] w-[35rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-[30rem] w-[30rem] rounded-full bg-purple-500/20 blur-3xl" />
      </div>
      {children}
    </div>
  );
}
