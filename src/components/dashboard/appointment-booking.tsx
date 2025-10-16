'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

const appointmentFormSchema = z.object({
  specialty: z.string({ required_error: 'Please select a specialty.' }),
  doctorId: z.string({ required_error: 'Please select a doctor.' }),
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string({ required_error: 'Please select a time.' }),
});

export function AppointmentBooking() {
  const { doctors, user, addAppointment } = useAppContext();
  const { toast } = useToast();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
  });

  const availableSpecialties = [...new Set(doctors.map(d => d.specialty))];
  const availableDoctors = doctors.filter(d => d.specialty === selectedSpecialty);

  function onSubmit(data: z.infer<typeof appointmentFormSchema>) {
    const doctor = doctors.find(d => d.id === data.doctorId);
    if (!doctor) return;

    addAppointment({
      patientId: user.id,
      patientName: user.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      status: 'Upcoming',
    });
    
    toast({
      title: 'Appointment Booked!',
      description: `Your appointment with ${doctor.name} on ${format(data.date, 'PPP')} at ${data.time} is confirmed.`,
      className: 'bg-accent text-accent-foreground',
    });
    form.reset();
    setSelectedSpecialty(null);
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Book a New Appointment</CardTitle>
        <CardDescription>Find a doctor and schedule your visit.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <Select onValueChange={(value) => { field.onChange(value); setSelectedSpecialty(value); form.setValue('doctorId', ''); }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a medical specialty" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSpecialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedSpecialty && (
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDoctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date('1900-01-01')} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a time slot" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                Confirm Appointment
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
