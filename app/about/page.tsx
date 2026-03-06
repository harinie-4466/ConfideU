'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Users, Target, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">About ConfideU</h1>
              <p className="text-xl text-foreground/80 leading-relaxed">
                We believe that truth-telling and ethical courage should never require personal sacrifice. ConfideU exists to change that.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24 border-b border-border bg-card/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
              <div className="prose prose-invert max-w-none space-y-4">
                <p className="text-foreground/80 text-lg leading-relaxed">
                  ConfideU was founded in 2020 by a group of technologists, legal experts, and ethics advocates who recognized a critical gap in how organizations handle sensitive reports of misconduct. We watched as brave individuals who spoke up about wrongdoing faced retaliation, had their evidence lost in bureaucratic processes, and found themselves unsupported by the institutions they trusted.
                </p>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  We knew there had to be a better way. A way that truly protects whistleblowers. A way that makes organizations more accountable. A way that turns evidence into action and justice into outcomes.
                </p>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  ConfideU was built on core principles: absolute anonymity, military-grade security, transparent processes, and unwavering commitment to protecting those who report wrongdoing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
                <p className="text-foreground/80 text-lg">
                  To build a world where exposing wrongdoing is safe, effective, and leads to meaningful change.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border border-border bg-card/50 space-y-4">
                  
                  <h3 className="text-xl font-bold">Protect Whistleblowers</h3>
                  <p className="text-foreground/80">
                    We guarantee complete anonymity through encryption, zero IP logging, and secure digital signatures that verify evidence without compromising identity.
                  </p>
                </Card>

                <Card className="p-8 border border-border bg-card/50 space-y-4">
                 
                  <h3 className="text-xl font-bold">Build Organizational Trust</h3>
                  <p className="text-foreground/80">
                    By creating safe channels for reporting and addressing issues transparently, organizations strengthen their culture and prevent crises.
                  </p>
                </Card>

                <Card className="p-8 border border-border bg-card/50 space-y-4">
                  
                  <h3 className="text-xl font-bold">Enable Investigation</h3>
                  <p className="text-foreground/80">
                    Streamlined case management tools help investigators track reports, manage evidence, and resolve issues efficiently while maintaining confidentiality.
                  </p>
                </Card>

                <Card className="p-8 border border-border bg-card/50 space-y-4">
                  
                  <h3 className="text-xl font-bold">Serve All Sectors</h3>
                  <p className="text-foreground/80">
                    From Fortune 500 companies to schools and NGOs, ConfideU provides scalable solutions tailored to any organization's needs.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-16 md:py-24 border-b border-border bg-card/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Who We Are</h2>
              
              <p className="text-foreground/80 text-lg leading-relaxed">
                Our team includes world-class security experts, compliance specialists, former investigators, and ethics advocates. We bring together diverse backgrounds united by a single purpose: making the world safer for truth-tellers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Security Experts', desc: '25+ years combined cryptography and systems security experience' },
                  { title: 'Compliance Specialists', desc: 'Deep knowledge of SOX, GDPR, ISO 27001, and industry-specific regulations' },
                  { title: 'Investigators', desc: 'Former law enforcement and corporate investigators understanding real investigation workflows' },
                  { title: 'Legal Advisors', desc: 'Employment law, whistleblower protection, and international regulations expertise' },
                  { title: 'Ethics Advocates', desc: 'Commitment to human rights and organizational accountability' },
                  { title: 'Technologists', desc: 'Full-stack builders passionate about secure, scalable systems' },
                ].map((item, i) => (
                  <Card key={i} className="p-6 border border-border bg-background/50">
                    <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                    <p className="text-foreground/70 text-sm">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">What We Do</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">Provide Secure Channels</h3>
                  <p className="text-foreground/80">
                    We operate a global anonymous reporting platform accessible from anywhere, anytime, across any device.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">Protect Evidence</h3>
                  <p className="text-foreground/80">
                    Military-grade encryption, digital signatures, and hashing ensure that evidence remains confidential and tamper-proof throughout the investigation process.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">Manage Investigations</h3>
                  <p className="text-foreground/80">
                    Our dashboard gives investigators the tools they need to track cases, manage evidence, and communicate securely with reporters.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">Ensure Compliance</h3>
                  <p className="text-foreground/80">
                    We help organizations meet their legal and regulatory obligations while building a culture of integrity and accountability.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">Support Organizations</h3>
                  <p className="text-foreground/80">
                    From implementation to training to ongoing support, we partner with organizations every step of the way.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Join the Movement</h2>
              <p className="text-foreground/70 text-lg">
                Whether you're an organization committed to ethical culture or an individual with something important to report, we're here to support you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/report">
                  <Button size="lg">Report Anonymously</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
