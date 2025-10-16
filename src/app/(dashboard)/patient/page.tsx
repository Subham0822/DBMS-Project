import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { AppointmentsList } from '@/components/dashboard/appointments-list';
import { Bot, ArrowRight } from 'lucide-react';

export default function PatientDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">Here's a summary of your health dashboard.</p>
      </div>
      
      <DashboardStats />
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AppointmentsList title="Recent Appointments" limit={5} />
        </div>
        
        <Card className="flex flex-col bg-primary/10 border-primary/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="text-primary" />
              AI Symptom Checker
            </CardTitle>
            <CardDescription>
              Have a health concern? Get an instant analysis of your symptoms.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Our AI tool can help you understand potential causes for your symptoms. This is not a substitute for professional medical advice.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/symptom-checker">
                Start Checker
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
