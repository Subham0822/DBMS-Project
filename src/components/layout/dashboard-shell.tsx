'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { MainNav } from '@/components/layout/main-nav';
import { useAppContext } from '@/context/app-context';
import { Logo } from '@/components/logo';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { role } = useAppContext();
  
  return (
    <div className="flex">
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center gap-2">
           <Logo />
           <span className="text-lg font-semibold">MediSys</span>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <MainNav role={role} />
        </SidebarContent>
        <SidebarFooter>
          {/* Footer content if any */}
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
