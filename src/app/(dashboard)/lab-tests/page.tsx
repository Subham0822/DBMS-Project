import { LabTestList } from "@/components/dashboard/lab-test-list";

export default function LabTestsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Lab Tests</h1>
                <p className="text-muted-foreground">View and manage lab test requests and results.</p>
            </div>
            <LabTestList />
        </div>
    );
}
