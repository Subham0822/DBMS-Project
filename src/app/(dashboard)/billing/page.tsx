import { BillingList } from "@/components/dashboard/billing-list";

export default function BillingPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
                <p className="text-muted-foreground">Review your transaction history and manage payments.</p>
            </div>
            <BillingList />
        </div>
    );
}
