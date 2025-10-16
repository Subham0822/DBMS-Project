'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { Users, Stethoscope, FileText, Calendar, DollarSign, Activity } from 'lucide-react';

export function DashboardStats() {
  const { role, patients, doctors, appointments, bills } = useAppContext();

  const getStats = () => {
    switch (role) {
      case 'admin':
        return [
          { title: 'Total Patients', value: patients.length, icon: Users },
          { title: 'Total Doctors', value: doctors.length, icon: Stethoscope },
          { title: 'Appointments', value: appointments.length, icon: Calendar },
          { title: 'Total Revenue', value: `$${bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.amount, 0).toLocaleString()}`, icon: DollarSign },
        ];
      case 'doctor':
        return [
          { title: 'Total Patients', value: '12', icon: Users },
          { title: 'Today\'s Appointments', value: appointments.filter(a => a.status === 'Upcoming' && new Date(a.date).toDateString() === new Date().toDateString()).length, icon: Calendar },
          { title: 'Open Cases', value: '5', icon: Activity },
          { title: 'Completed Consultations', value: '32', icon: FileText },
        ];
      case 'patient':
        return [
          { title: 'Upcoming Appointments', value: appointments.filter(a => a.status === 'Upcoming').length, icon: Calendar },
          { title: 'Completed Appointments', value: appointments.filter(a => a.status === 'Completed').length, icon: Calendar },
          { title: 'Pending Bills', value: bills.filter(b => b.status === 'Pending').length, icon: FileText },
          { title: 'Total Spent', value: `$${bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.amount, 0).toLocaleString()}`, icon: DollarSign },
        ];
      default:
        return [];
    }
  };

  const stats = getStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
