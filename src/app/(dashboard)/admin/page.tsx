import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DoctorList } from "@/components/dashboard/doctor-list";
import { PatientList } from "@/components/dashboard/patient-list";
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
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>
        <TabsContent value="doctors" className="mt-6">
          <DoctorList />
        </TabsContent>
        <TabsContent value="patients" className="mt-6">
          <PatientList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
