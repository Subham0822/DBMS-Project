
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { initialDoctors, departments } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import { TextType } from '@/components/visuals/text-type';
import { AuroraBackground } from '../visuals/aurora';

export function LandingPage() {
  return (
    <>
      <AuroraBackground>
        <section className="relative w-full h-[80vh] flex items-center justify-center text-center overflow-hidden">
          <div className="container px-4 md:px-6 z-10">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
                <TextType
                  words={[
                    'Your Health, Our Priority',
                    'Care You Can Trust',
                    'Book. Track. Heal.',
                  ]}
                  className="text-primary"
                />
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                MediSys provides world-class healthcare with a compassionate
                touch. Book appointments, manage your health records, and
                connect with expert doctors seamlessly.
              </p>
              <div className="space-x-4">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </AuroraBackground>

      <section
        id="services"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold text-primary">
                Our Services
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Comprehensive Medical Departments
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We offer a wide range of specializations to cater to all your
                health needs.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3">
            {departments.map(dept => (
              <Card
                key={dept.name}
                className="group relative flex flex-col items-center justify-center p-6 text-center overflow-hidden rounded-xl border-border/20 hover:border-primary/50 shadow-sm hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <dept.icon className="h-12 w-12 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-xl font-bold z-10">{dept.name}</h3>
                <p className="text-sm text-muted-foreground z-10">
                  {dept.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="doctors" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold text-primary">
                Our Experts
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Meet Our Doctors
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our team of highly qualified and experienced doctors is here to
                provide you with the best care.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12 bg-transparent">
            {initialDoctors.map(doctor => (
              <div
                key={doctor.id}
                className="group relative flex flex-col items-center text-center"
              >
                <Avatar className="h-40 w-40 mb-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/30 rounded-full">
                  <AvatarImage
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="object-cover"
                  />
                  <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{doctor.name}</h3>
                  <p className="text-primary">{doctor.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
      >
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl mb-12">
            What Our Patients Say
          </h2>
          <div className="mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card
                key={i}
                className="bg-background shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={`https://picsum.photos/seed/p${i}/100/100`}
                        alt="Patient"
                        data-ai-hint="person happy"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {['John D.', 'Sarah S.', 'Mike B.'][i - 1]}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {
                      [
                        '"The care I received at MediSys was exceptional. The doctors were knowledgeable and the staff was incredibly friendly. Highly recommend!"',
                        '"Booking an appointment was so easy through their website. The whole process was smooth and efficient from start to finish."',
                        '"A wonderful experience. The facilities are top-notch and every interaction I had was positive. I felt genuinely cared for."',
                      ][i - 1]
                    }
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
