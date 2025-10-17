'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import {
  Users,
  Stethoscope,
  FileText,
  Calendar,
  DollarSign,
  Activity,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function DashboardStats() {
  const { role, patients, doctors, appointments, bills } = useAppContext();

  const getStats = () => {
    switch (role) {
      case 'admin':
        return [
          {
            title: 'Total Patients',
            value: patients.length,
            icon: Users,
            color: 'text-sky-500',
            bg: 'bg-sky-500/10',
          },
          {
            title: 'Total Doctors',
            value: doctors.length,
            icon: Stethoscope,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            title: 'Appointments',
            value: appointments.length,
            icon: Calendar,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
          },
          {
            title: 'Total Revenue',
            value: `$${bills
              .filter(b => b.status === 'Paid')
              .reduce((acc, b) => acc + b.amount, 0)
              .toLocaleString()}`,
            icon: DollarSign,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
        ];
      case 'doctor':
        return [
          {
            title: 'Total Patients',
            value: '12',
            icon: Users,
            color: 'text-sky-500',
            bg: 'bg-sky-500/10',
          },
          {
            title: "Today's Appointments",
            value: appointments.filter(
              a =>
                a.status === 'Upcoming' &&
                new Date(a.date).toDateString() === new Date().toDateString()
            ).length,
            icon: Calendar,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
          },
          {
            title: 'Open Cases',
            value: '5',
            icon: Activity,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
          },
          {
            title: 'Completed Consultations',
            value: '32',
            icon: FileText,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
        ];
      case 'patient':
        return [
          {
            title: 'Upcoming Appointments',
            value: appointments.filter(a => a.status === 'Upcoming').length,
            icon: Calendar,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
          },
          {
            title: 'Completed Appointments',
            value: appointments.filter(a => a.status === 'Completed').length,
            icon: Calendar,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            title: 'Pending Bills',
            value: bills.filter(b => b.status === 'Pending').length,
            icon: FileText,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
          },
          {
            title: 'Total Spent',
            value: `$${bills
              .filter(b => b.status === 'Paid')
              .reduce((acc, b) => acc + b.amount, 0)
              .toLocaleString()}`,
            icon: DollarSign,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
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
          <div
            className={`absolute -top-4 -right-4 h-24 w-24 rounded-full opacity-10 blur-xl transition-all duration-500 group-hover:scale-[10] ${stat.bg.replace(
              'bg-',
              'bg-opacity-20 '
            )}`}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon
              className={`h-4 w-4 text-muted-foreground ${stat.color}`}
            />
          </CardHeader>
          <CardContent>
            <AnimatedCount target={stat.value} className={stat.color} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AnimatedCount({
  target,
  className,
}: {
  target: number | string;
  className?: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (typeof target === 'string') {
      return;
    }

    const duration = 1200;
    const frameRate = 60;
    const totalFrames = duration / (1000 / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = Math.pow(frame / totalFrames - 1, 5) + 1;
      const current = Math.round(target * progress);

      setValue(current);

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, 1000 / frameRate);

    return () => clearInterval(counter);
  }, [target]);

  if (typeof target === 'string') {
    return <div className={`text-2xl font-bold ${className}`}>{target}</div>;
  }

  return <div className={`text-2xl font-bold ${className}`}>{value}</div>;
}
