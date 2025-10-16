'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import type { Role } from '@/lib/types';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('patient');
  const [password, setPassword] = useState('');
  const { login } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = () => {
    if (login(selectedRole, password)) {
      toast({
        title: 'Login Successful',
        description: `Welcome! Redirecting to ${selectedRole} dashboard...`,
        className: 'bg-accent text-accent-foreground',
      });
      router.push(`/${selectedRole}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid role or password. Please try again.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Logo />
            </div>
          <CardTitle className="text-2xl">Welcome to MediSys</CardTitle>
          <CardDescription>Select your role and login to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value: Role) => setSelectedRole(value)} defaultValue={selectedRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter password..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <p className="text-xs text-muted-foreground">Hint: Use 'patient', 'doctor', or 'admin' as the password.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
