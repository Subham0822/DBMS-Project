import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { AppointmentsList } from "@/components/dashboard/appointments-list";
import { DoctorPatientList } from "@/components/dashboard/doctor-patient-list";

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor's Dashboard</h1>
        <p className="text-muted-foreground">Your daily overview and patient management.</p>
      </div>

      <DashboardStats />

      <div className="grid gap-8 lg:grid-cols-2">
        <AppointmentsList title="Today's Appointments" />
        <DoctorPatientList />
      </div>
    </div>
  );
}
