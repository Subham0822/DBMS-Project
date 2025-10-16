'use client';

import { AppointmentsList } from "@/components/dashboard/appointments-list";
import { AppointmentBooking } from "@/components/dashboard/appointment-booking";
import { useAppContext } from "@/context/app-context";

export default function AppointmentsPage() {
    const { role } = useAppContext();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                <p className="text-muted-foreground">
                    {role === 'patient' ? 'Book new appointments and view your schedule.' : 'View and manage all appointments.'}
                </p>
            </div>
            
            {role === 'patient' && (
                <AppointmentBooking />
            )}

            <AppointmentsList />
        </div>
    );
}
