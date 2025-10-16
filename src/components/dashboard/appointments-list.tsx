"use client";

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
import { useAppContext } from "@/context/app-context";
import type { Appointment } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
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

  const filteredAppointments = appointments
    .filter((a) => {
      if (role === "admin") return true;
      if (role === "doctor" && a.doctorName === user.name) return true;
      if (role === "patient" && a.patientName === user.name) return true;
      return false;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

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
      <CardContent>
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
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
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
                    No appointments found.
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
