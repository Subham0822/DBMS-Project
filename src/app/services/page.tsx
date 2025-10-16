import { LandingPageLayout } from "@/components/landing/landing-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { departments } from "@/lib/data";

export default function ServicesPage() {
    return (
        <LandingPageLayout>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Services</h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                           A wide range of specialized medical services to meet your health needs.
                        </p>
                    </div>
                </div>
            </section>

            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {departments.map((dept) => (
                            <Card key={dept.name} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <dept.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <CardTitle>{dept.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground">{dept.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </LandingPageLayout>
    );
}
