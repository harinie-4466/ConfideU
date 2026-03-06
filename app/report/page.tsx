'use client';

import React from "react"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useReports } from '@/app/context/ReportsContext';
import { useState } from 'react';
import { CheckCircle, AlertCircle, FileUp, Info } from 'lucide-react';
import Link from 'next/link';

export default function ReportPage() {
  const { addReport } = useReports();
  const [formData, setFormData] = useState({
    category: 'fraud',
    description: '',
    evidence: '',
    priority: 'medium',
  });
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'fraud', label: 'Fraud' },
    { value: 'corruption', label: 'Corruption' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'discrimination', label: 'Discrimination' },
    { value: 'safety', label: 'Safety Violation' },
    { value: 'other', label: 'Other' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the incident';
    }
    if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    if (!formData.evidence.trim()) {
      newErrors.evidence = 'Please provide some evidence or details';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const id = addReport({
      category: formData.category,
      description: formData.description,
      evidence: formData.evidence,
      priority: formData.priority as 'low' | 'medium' | 'high',
      status: 'submitted',
    });

    setTrackingId(id);
    setSubmitted(true);
    setFormData({
      category: 'fraud',
      description: '',
      evidence: '',
      priority: 'medium',
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <Card className="p-12 border border-border bg-card text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold">Report Submitted Successfully</h1>
                <p className="text-foreground/70 text-lg">
                  Your report has been securely submitted. Your identity has been completely protected.
                </p>

                <div className="bg-card/50 p-6 rounded-lg border border-accent/30 space-y-4">
                  <h3 className="font-semibold text-lg">Your Tracking Information</h3>
                  <div>
                    <p className="text-foreground/60 text-sm">Tracking ID</p>
                    <p className="text-2xl font-mono font-bold text-primary mt-1">{trackingId}</p>
                  </div>
                  <p className="text-foreground/60 text-sm border-t border-border pt-4">
                    Save this ID to check the status of your report. Never share it with anyone.
                  </p>
                </div>

                <div className="space-y-2 text-left bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Next Steps
                  </h4>
                  <ul className="text-foreground/70 space-y-1 text-sm">
                    <li>✓ Your report is now under review by our investigation team</li>
                    <li>✓ Your anonymity is protected with military-grade encryption</li>
                    <li>✓ Updates will be sent securely to your contact method</li>
                    <li>✓ Investigation typically completes within 30 days</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Link href="/">
                    <Button variant="outline">Back to Home</Button>
                  </Link>
                  <Button
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Report
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Report Anonymously</h1>
              <p className="text-foreground/70 text-lg">
                Submit your report securely. Your identity is completely protected.
              </p>
            </div>

            {/* Security Notice */}
            <Card className="p-6 border border-accent/30 bg-accent/5 space-y-3">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Your Report is Completely Secure</h3>
                  <p className="text-foreground/70 text-sm mt-1">
                    All submissions are encrypted end-to-end. We don't log your IP, collect cookies, or store any identifying information. Your anonymity is guaranteed.
                  </p>
                </div>
              </div>
            </Card>

            {/* Form */}
            <Card className="p-8 border border-border bg-card/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block font-semibold mb-2">
                    Type of Misconduct
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold mb-2">
                    Describe the Incident
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide detailed information about what happened, when, where, and who was involved..."
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={5}
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm mt-1">{errors.description}</p>
                  )}
                  <p className="text-foreground/50 text-xs mt-1">
                    {formData.description.length} characters
                  </p>
                </div>

                {/* Evidence */}
                <div>
                  <label className="block font-semibold mb-2">
                    Evidence & Supporting Documents
                  </label>
                  <textarea
                    value={formData.evidence}
                    onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                    placeholder="Describe any documents, emails, screenshots, or other evidence. For security, you can describe files without uploading."
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={4}
                  />
                  {errors.evidence && (
                    <p className="text-destructive text-sm mt-1">{errors.evidence}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block font-semibold mb-2">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['low', 'medium', 'high'].map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority })}
                        className={`px-4 py-2 rounded-lg border font-medium transition-colors capitalize ${
                          formData.priority === priority
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:bg-muted'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full">
                    <FileUp className="w-4 h-4 mr-2" />
                    Submit Report Securely
                  </Button>
                </div>
              </form>
            </Card>

            {/* FAQ Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    q: 'Is my identity truly anonymous?',
                    a: 'Yes. We use advanced encryption and never log IP addresses or identifying information.',
                  },
                  {
                    q: 'What happens to my report?',
                    a: 'Your report goes to authorized investigators who review it confidentially.',
                  },
                  {
                    q: 'Can I track my report?',
                    a: 'Yes, using your tracking ID. You can check status updates without revealing your identity.',
                  },
                  {
                    q: 'Is there a time limit to report?',
                    a: 'No, you can report incidents anytime. The sooner you report, the faster we can investigate.',
                  },
                ].map((item, i) => (
                  <Card key={i} className="p-4 border border-border bg-card/50">
                    <p className="font-semibold text-foreground/90 mb-2">{item.q}</p>
                    <p className="text-foreground/70 text-sm">{item.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
