import { DoctorPatientList } from "@/components/dashboard/doctor-patient-list";

export default function DoctorPatientsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Patients</h1>
                <p className="text-muted-foreground">Access medical histories and details for your patients.</p>
            </div>
            <DoctorPatientList />
        </div>
    );
}
