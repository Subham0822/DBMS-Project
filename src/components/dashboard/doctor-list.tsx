'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreVertical, PlusCircle, Search, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/app-context';

export function DoctorList() {
  const { doctors } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const specialties = useMemo(() => {
    return [...new Set(doctors.map(d => d.specialty))].sort();
  }, [doctors]);

  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'specialty':
          return a.specialty.localeCompare(b.specialty);
        case 'availability':
          return b.availability.length - a.availability.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [doctors, searchQuery, specialtyFilter, sortBy]);

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
      <CardContent className="space-y-4">
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Name
                </div>
              </SelectItem>
              <SelectItem value="specialty">Specialty</SelectItem>
              <SelectItem value="availability">Availability</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedDoctors.length} of {doctors.length} doctors
        </div>

        {/* Doctor Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedDoctors.length > 0 ? (
            filteredAndSortedDoctors.map((doctor) => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No doctors found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
