import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DoctorList } from "@/components/dashboard/doctor-list";
import { PatientList } from "@/components/dashboard/patient-list";
import { RoomList } from "@/components/dashboard/room-list";
import { AppointmentsList } from "@/components/dashboard/appointments-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Oversee and manage the MediSys platform.</p>
      </div>

      <DashboardStats />

      <Tabs defaultValue="doctors">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>
        <TabsContent value="doctors" className="mt-6">
          <DoctorList />
        </TabsContent>
        <TabsContent value="patients" className="mt-6">
          <PatientList />
        </TabsContent>
        <TabsContent value="appointments" className="mt-6">
          <AppointmentsList />
        </TabsContent>
        <TabsContent value="rooms" className="mt-6">
          <RoomList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
