'use client';

import React from "react"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Shield, Lock, Eye, CheckCircle, Users, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
  
      <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 md:py-32 border-b border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none" />
            <div className="container mx-auto px-4 md:px-6 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left side - Text content */}
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                  REPORT! <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> Misconduct with Complete Anonymity</span>
                  </h1>
                  <p className="text-xl text-foreground/80 text-balance leading-relaxed">
                    ConfideU provides a secure, encrypted platform for safely reporting corruption, fraud, harassment, and misconduct. Protect your identity while exposing wrongdoing.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/report">
                      <Button size="lg" className="w-full sm:w-auto">
                        Report Anonymously
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                        Book a Call
                      </Button>
                    </Link>
                  </div>
                </div>
        
                {/* Right side - Image placeholder */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative w-full h-96 bg-card border border-border rounded-lg flex items-center justify-center">
                    {/* Replace this div with your image */}
                    <img 
                      src="/front.jpg" 
                      alt="Hero illustration" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
       

        {/* Who Can Use Section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Every Organization</h2>
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Users, title: 'Corporations', desc: 'Manage compliance and internal investigations' },
                { icon: TrendingUp, title: 'Educational Institutions', desc: 'Protect students and staff safety' },
                { icon: Shield, title: 'NGOs', desc: 'Ensure accountability and transparency' },
                { title: 'Government Agencies', desc: 'Investigate public misconduct' },
              ].map((item, i) => (
                <Card key={i} className="p-6 border border-border bg-card/50 hover:bg-card transition-colors group">
          
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-foreground/70 text-sm">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How We Provide Confidentiality */}
        <section className="py-16 md:py-24 border-b border-border bg-card/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Protect Your Identity</h2>
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Lock, title: 'End-to-End Encryption', desc: 'All evidence is encrypted with AES-256 encryption standard' },
                { icon: Eye, title: 'Complete Anonymity', desc: 'No IP logs, no metadata, no way to trace your identity' },
                { icon: Shield, title: 'Data Integrity', desc: 'Digital signatures and hashing verify evidence hasn\'t been tampered with' },
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                Comprehensive solutions for secure reporting and investigation management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Anonymous Reporting', icon: '📝', desc: 'Submit detailed reports with evidence without revealing your identity' },
                { title: 'Secure Evidence Upload', icon: '📎', desc: 'Upload documents, images, and videos with encrypted storage' },
                { title: 'Tracked Investigation', icon: '🔍', desc: 'Monitor case status and receive updates without compromising anonymity' },
                { title: 'Compliance Management', icon: '✅', desc: 'Meet SOX, GDPR, ISO 27001, and other regulatory requirements' },
              ].map((item, i) => (
                <Card key={i} className="p-8 border border-border bg-card/50 hover:border-accent transition-colors">
                
                  <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-foreground/70">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Before & After Section */}
        <section className="py-16 md:py-24 border-b border-border bg-card/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">The ConfideU Difference</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Before */}
              <Card className="p-8 border border-border bg-destructive/5">
                <h3 className="text-2xl font-bold text-destructive mb-6">Before ConfideU</h3>
                <ul className="space-y-4">
                  {[
                    'Lost or scattered evidence across systems',
                    'Fear of retaliation prevents reporting',
                    'Identity exposure puts whistleblowers at risk',
                    'No unified investigation management',
                    'Compliance violations and audit failures',
                    'Weak anonymity guarantees',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-foreground/80">
                      <span className="text-destructive font-bold">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* After */}
              <Card className="p-8 border border-border bg-accent/5">
                <h3 className="text-2xl font-bold text-accent mb-6">With ConfideU</h3>
                <ul className="space-y-4">
                  {[
                    'Centralized, encrypted evidence repository',
                    'Complete anonymity encourages reporting',
                    'Advanced security protects whistleblower identity',
                    'Unified dashboard for case management',
                    'Full compliance with regulations',
                    'Military-grade encryption and hashing',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-foreground/80">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-foreground/70 text-lg">
                Join hundreds of organizations protecting their people and upholding integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ConfideU?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '🔐', title: 'Enterprise Security', desc: 'ISO 27001 certified, SOC 2 compliant, GDPR ready' },
                { icon: '⚡', title: 'Lightning Fast', desc: 'Real-time evidence processing and instant notifications' },
                { icon: '🌍', title: 'Global Reach', desc: 'Support for 50+ languages and international compliance' },
                { icon: '🎯', title: 'Easy Integration', desc: 'Seamless integration with your existing systems' },
                { icon: '📊', title: 'Advanced Analytics', desc: 'Detailed insights on reporting patterns and case outcomes' },
                { icon: '🤝', title: '24/7 Support', desc: 'Dedicated support team ready to help anytime' },
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                  
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-foreground/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Certifications */}
        <section className="py-16 md:py-24 border-b border-border bg-card/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Security Certifications</h2>
            
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <img src="/iso.png" alt="ISO 27001 Certification" className="w-20 h-20 object-contain"/>
                
                </div>
                <p className="text-sm text-foreground/70">Information Security</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-3 bg-accent/10 rounded-full flex items-center justify-center">
                  <img src="/soc.jpg" alt="ISO 27001 Certification" className="w-20 h-20 object-contain"/>
                </div>
                <p className="text-sm text-foreground/70">Compliance</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <img src="/gdpr.png" alt="ISO 27001 Certification" className="w-20 h-20 object-contain"/>
                </div>
                <p className="text-sm text-foreground/70">Data Protection</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { label: 'Reports Received', value: '15,000+', icon: '📊' },
                { label: 'Cases Resolved', value: '94%', icon: '✅' },
                { label: 'Countries', value: '45+', icon: '🌍' },
                { label: 'Organizations', value: '300+', icon: '🏢' },
                { label: 'Anonymity Rate', value: '100%', icon: '🔒' },
              ].map((stat, i) => (
                <Card key={i} className="p-6 border border-border bg-card/50 text-center hover:bg-card transition-colors">
                  
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-foreground/70 text-sm">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 md:py-24 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Informed</h2>
              <p className="text-foreground/70 text-lg mb-8">
                Get updates on whistleblowing trends, security insights, and ConfideU features.
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
                <Button type="submit" size="lg" className="sm:px-8">
                  {subscribed ? 'Subscribed!' : 'Subscribe'}
                </Button>
              </form>

              {subscribed && (
                <p className="mt-4 text-accent text-sm">
                  ✓ Thank you for subscribing! Check your email for confirmation.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Build a Culture of Trust?</h2>
              <p className="text-foreground/70 text-lg">
                Let's discuss how ConfideU can help your organization protect its people and maintain integrity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/report">
                  <Button size="lg" className="w-full sm:w-auto">
                    Submit an Anonymous Report
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
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
