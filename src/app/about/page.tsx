import { LandingPageLayout } from "@/components/landing/landing-page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialDoctors } from "@/lib/data";
import { Building2, Heart, Lightbulb, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <LandingPageLayout>
             <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About MediSys</h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            Leading the way in advanced, compassionate healthcare for our community.
                        </p>
                    </div>
                </div>
            </section>
            
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 lg:gap-24">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter">Our Mission</h2>
                        <p className="text-muted-foreground">
                            To provide outstanding patient care based on the principles of quality, accessibility, and respect. We are committed to fostering a healthy community by delivering a comprehensive range of services with a focus on medical excellence and innovation.
                        </p>
                         <div className="grid grid-cols-2 gap-6 mt-6">
                            <div className="flex items-start gap-4">
                                <Heart className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Patient-First Approach</h3>
                                    <p className="text-sm text-muted-foreground">Your health and well-being are at the center of everything we do.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Lightbulb className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Innovation in Medicine</h3>
                                    <p className="text-sm text-muted-foreground">Leveraging technology to provide cutting-edge treatments.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Users className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Community Focus</h3>
                                    <p className="text-sm text-muted-foreground">Dedicated to improving the health of our local community.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <Building2 className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">State-of-the-Art Facility</h3>
                                    <p className="text-sm text-muted-foreground">Modern infrastructure designed for comfort and efficiency.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <img
                        src="https://picsum.photos/seed/about-us/550/310"
                        width="550"
                        height="310"
                        alt="Hospital Interior"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                        data-ai-hint="hospital interior modern"
                    />
                </div>
            </section>

             <section id="doctors" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Team</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet Our Expert Doctors</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                            A team of dedicated, experienced, and compassionate medical professionals.
                        </p>
                    </div>
                    <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {initialDoctors.map((doctor) => (
                        <div key={doctor.id} className="flex flex-col items-center text-center">
                            <Avatar className="h-32 w-32 mb-4">
                                <AvatarImage src={doctor.avatar} alt={doctor.name} className="object-cover"/>
                                <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-lg font-bold">{doctor.name}</h3>
                            <p className="text-primary">{doctor.specialty}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </section>

        </LandingPageLayout>
    );
}
