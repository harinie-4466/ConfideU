'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useOrganizations } from '@/app/context/OrganizationsContext';
import { useCrimeReports } from '@/app/context/CrimeReportsContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, MapPin, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function OrganizationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getOrganizationById } = useOrganizations();
  const { reports } = useCrimeReports();
  const [contactFormOpen, setContactFormOpen] = useState(false);

  const org = getOrganizationById(params.id as string);
  const orgReports = reports.filter(() => Math.random() > 0.7); // Demo filtering

  if (!org) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Organization Not Found</h1>
          <Button onClick={() => router.push('/organizations')} className="mt-4 bg-primary hover:bg-primary/90">
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  const typeIcons: { [key: string]: string } = {
    school: '🏫',
    corporate: '🏢',
    ngo: '🤝',
    police: '👮'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="flex-1 text-center text-xl font-bold text-foreground">{org.name}</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Organization Header */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{typeIcons[org.type]}</div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{org.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    org.status === 'active' ? 'bg-green-500/20 text-green-300' :
                    org.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {org.status}
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">{org.type}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setContactFormOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Contact Organization
            </Button>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-input/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Reports Received</p>
              <p className="text-2xl font-bold text-accent">{org.reportsCount}</p>
            </div>
            <div className="bg-input/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Cases Solved</p>
              <p className="text-2xl font-bold text-green-400">{org.solvedCasesCount}</p>
            </div>
            <div className="bg-input/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {org.reportsCount > 0 ? ((org.solvedCasesCount / org.reportsCount) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="bg-input/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Investigators</p>
              <p className="text-2xl font-bold text-foreground">{org.investigatorCount}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground break-all">{org.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="text-foreground">{org.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="text-foreground">{org.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Organization Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                <p className="text-foreground">{new Date(org.registrationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contact Person</p>
                <p className="text-foreground">{org.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-foreground capitalize">{org.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Performance Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground">Case Resolution Rate</span>
                <span className="text-sm font-bold text-accent">
                  {org.reportsCount > 0 ? ((org.solvedCasesCount / org.reportsCount) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-input rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-green-400"
                  style={{
                    width: `${org.reportsCount > 0 ? (org.solvedCasesCount / org.reportsCount) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground">Total Reports</span>
                <span className="text-sm font-bold text-accent">{org.reportsCount}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <div className="flex-1 bg-input rounded-lg p-2 text-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <p className="text-muted-foreground">Solved: {org.solvedCasesCount}</p>
                </div>
                <div className="flex-1 bg-input rounded-lg p-2 text-center">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-muted-foreground">In Progress: {Math.max(0, org.reportsCount - org.solvedCasesCount - Math.floor(org.reportsCount * 0.1))}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">About {org.name}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {org.name} is a registered {org.type} on the ConfideU platform dedicated to handling whistleblower reports and ensuring accountability. 
            With {org.investigatorCount} trained investigators and a {org.reportsCount > 0 ? ((org.solvedCasesCount / org.reportsCount) * 100).toFixed(1) : 0}% case resolution rate, 
            they have consistently maintained high standards in investigating reported incidents.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Located in {org.address.split(',').pop()}, they operate with full transparency and commitment to protecting reporter anonymity while ensuring swift and fair resolution of all reported cases.
          </p>
        </div>
      </main>

      {/* Contact Form Modal */}
      {contactFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Send Message to {org.name}</h2>
              <button
                onClick={() => setContactFormOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  placeholder="Type your message..."
                  rows={4}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setContactFormOpen(false)}
                variant="outline"
                className="flex-1 border-border hover:bg-card"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert('Message sent successfully!');
                  setContactFormOpen(false);
                }}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
