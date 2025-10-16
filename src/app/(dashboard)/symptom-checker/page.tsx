import { SymptomCheckerForm } from '@/components/dashboard/symptom-checker-form';

export default function SymptomCheckerPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Symptom Checker</h1>
        <p className="text-muted-foreground">Describe your symptoms to get an AI-powered analysis.</p>
      </div>
      <SymptomCheckerForm />
    </div>
  );
}
