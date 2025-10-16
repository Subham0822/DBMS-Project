import { ReportCharts } from "@/components/dashboard/report-charts";

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                <p className="text-muted-foreground">Visual summary of hospital operations.</p>
            </div>
            <ReportCharts />
        </div>
    );
}
