"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/app-context";
import type { Appointment } from "@/lib/types";
import { MoreHorizontal, Search, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const getStatusVariant = (status: Appointment["status"]) => {
  switch (status) {
    case "Upcoming":
      return "default";
    case "Completed":
      return "secondary";
    case "Cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export function AppointmentsList({
  title = "Appointments",
  limit,
}: {
  title?: string;
  limit?: number;
}) {
  const { appointments, role, user } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  const baseFiltered = appointments.filter((a) => {
    if (role === "admin") return true;
    if (role === "doctor" && a.doctorName === user.name) return true;
    if (role === "patient" && a.patientName === user.name) return true;
    return false;
  });

  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = baseFiltered.filter(appointment => {
      const matchesSearch = appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || appointment.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'doctor':
          return a.doctorName.localeCompare(b.doctorName);
        case 'patient':
          return a.patientName.localeCompare(b.patientName);
        case 'specialty':
          return a.specialty.localeCompare(b.specialty);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    if (limit) {
      return filtered.slice(0, limit);
    }

    return filtered;
  }, [baseFiltered, searchQuery, statusFilter, sortBy, limit]);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {role === "patient"
            ? "Your upcoming and past appointments."
            : "A list of scheduled appointments."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Date (Newest)
                </div>
              </SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="specialty">Specialty</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedAppointments.length} of {baseFiltered.length} appointments
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>
                  {role === "patient" ? "Doctor" : "Patient"}
                </TableHead>
                {role !== "doctor" && (
                  <TableHead className="hidden sm:table-cell">
                    Specialty
                  </TableHead>
                )}
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedAppointments.length > 0 ? (
                filteredAndSortedAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {role === "patient"
                        ? appointment.doctorName
                        : appointment.patientName}
                    </TableCell>
                    {role !== "doctor" && (
                      <TableCell className="hidden sm:table-cell">
                        {appointment.specialty}
                      </TableCell>
                    )}
                    <TableCell>
                      {format(new Date(appointment.date), "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right w-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          {appointment.status === "Upcoming" && (
                            <DropdownMenuItem>Cancel</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={role === "doctor" ? 4 : 5}
                    className="h-24 text-center"
                  >
                    No appointments found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
