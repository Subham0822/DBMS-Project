'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserNav } from '@/components/layout/user-nav';
import { useAppContext } from '@/context/app-context';
import type { Role } from '@/lib/types';
import { SidebarTrigger } from '../ui/sidebar';

export function Header() {
  const { role, setRole } = useAppContext();

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <SidebarTrigger />
        </div>
        <div className="flex items-center space-x-4 lg:space-x-6">
          <h1 className="text-lg font-bold capitalize">{role} Dashboard</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Select onValueChange={(value) => handleRoleChange(value as Role)} defaultValue={role}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
            </Select>
            <UserNav />
        </div>
      </div>
      <div className="border-b"></div>
    </header>
  );
}
