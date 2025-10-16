'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/app-context';

export function DoctorList() {
  const { doctors } = useAppContext();

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Doctors</CardTitle>
            <CardDescription>Manage doctor profiles and schedules.</CardDescription>
        </div>
        <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Doctor
          </Button>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="group relative transition-shadow hover:shadow-lg">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                    <DropdownMenuItem>View Schedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Avatar className="w-20 h-20 mb-4">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-primary">{doctor.specialty}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {doctor.availability.map((day) => (
                  <Badge key={day} variant="secondary">{day}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
