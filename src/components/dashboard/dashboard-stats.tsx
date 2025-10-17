"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/app-context";
import {
  Users,
  Stethoscope,
  FileText,
  Calendar,
  DollarSign,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardStats() {
  const { role, patients, doctors, appointments, bills } = useAppContext();

  const getStats = () => {
    switch (role) {
      case "admin":
        return [
          { title: "Total Patients", value: patients.length, icon: Users, color: "text-sky-500" },
          { title: "Total Doctors", value: doctors.length, icon: Stethoscope, color: "text-emerald-500" },
          { title: "Appointments", value: appointments.length, icon: Calendar, color: "text-purple-500" },
          {
            title: "Total Revenue",
            value: `$${bills
              .filter((b) => b.status === "Paid")
              .reduce((acc, b) => acc + b.amount, 0)
              .toLocaleString()}`,
            icon: DollarSign,
            color: "text-amber-500"
          },
        ];
      case "doctor":
        return [
          { title: "Total Patients", value: "12", icon: Users, color: "text-sky-500" },
          {
            title: "Today's Appointments",
            value: appointments.filter(
              (a) =>
                a.status === "Upcoming" &&
                new Date(a.date).toDateString() === new Date().toDateString()
            ).length,
            icon: Calendar,
            color: "text-purple-500"
          },
          { title: "Open Cases", value: "5", icon: Activity, color: "text-red-500" },
          { title: "Completed Consultations", value: "32", icon: FileText, color: "text-emerald-500" },
        ];
      case "patient":
        return [
          {
            title: "Upcoming Appointments",
            value: appointments.filter((a) => a.status === "Upcoming").length,
            icon: Calendar,
            color: "text-purple-500"
          },
          {
            title: "Completed Appointments",
            value: appointments.filter((a) => a.status === "Completed").length,
            icon: Calendar,
            color: "text-emerald-500"
          },
          {
            title: "Pending Bills",
            value: bills.filter((b) => b.status === "Pending").length,
            icon: FileText,
            color: "text-red-500"
          },
          {
            title: "Total Spent",
            value: `$${bills
              .filter((b) => b.status === "Paid")
              .reduce((acc, b) => acc + b.amount, 0)
              .toLocaleString()}`,
            icon: DollarSign,
            color: "text-amber-500"
          },
        ];
      default:
        return [];
    }
  };

  const stats = getStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className={`absolute -top-4 -right-4 h-24 w-24 rounded-full opacity-10 blur-xl transition-all duration-500 group-hover:scale-[10] ${stat.color.replace('text-', 'bg-')}`}></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <AnimatedCount target={stat.value} className={stat.color}/>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AnimatedCount({ target, className }: { target: number | string, className?: string }) {
  if (typeof target === "string") {
    return <div className={`text-2xl font-bold ${className}`}>{target}</div>;
  }
  const [value, setValue] = useState(0);
  useEffect(() => {
    const duration = 1000; // Slower for a nicer effect
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(Math.ceil(current));
      }
    }, (duration / steps) * (1 - Math.pow(1 - (current / target), 4))); // Ease out
    return () => clearInterval(interval);
  }, [target]);
  return <div className={`text-2xl font-bold ${className}`}>{value}</div>;
}