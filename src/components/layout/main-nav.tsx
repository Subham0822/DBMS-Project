'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Bot,
  Users,
  Bed,
  FlaskConical,
  LineChart,
} from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import type { Role } from '@/lib/types';

const navItems = {
  admin: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/appointments', label: 'Appointments', icon: Calendar },
    { href: '/billing', label: 'Billing', icon: FileText },
    { href: '/rooms', label: 'Rooms', icon: Bed },
    { href: '/lab-tests', label: 'Lab Tests', icon: FlaskConical },
    { href: '/reports', label: 'Reports', icon: LineChart },
  ],
  doctor: [
    { href: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/appointments', label: 'Appointments', icon: Calendar },
    { href: '/patients', label: 'My Patients', icon: Users },
    { href: '/lab-tests', label: 'Lab Results', icon: FlaskConical },
  ],
  patient: [
    { href: '/patient', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/symptom-checker', label: 'Symptom Checker', icon: Bot },
    { href: '/appointments', label: 'Appointments', icon: Calendar },
    { href: '/billing', label: 'Billing', icon: FileText },
    { href: '/lab-tests', label: 'My Lab Tests', icon: FlaskConical },
  ],
};

export function MainNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navItems[role];

  return (
    <SidebarMenu>
      {items.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <Link href={href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === href}
              tooltip={label}
            >
              <Icon />
              <span>{label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
