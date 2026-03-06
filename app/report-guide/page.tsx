'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function ReportGuidePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">How to Report Anonymously</h1>
              <p className="text-foreground/70 text-lg">
                Your guide to safely and effectively reporting misconduct through ConfideU
              </p>
            </div>

            {/* Before You Report */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">Before You Report</h2>
              <p className="text-foreground/80">
                Here are some important things to know before submitting your report:
              </p>

              <ul className="space-y-3">
                {[
                  'Your identity is completely anonymous. We never log your IP address or collect identifying information.',
                  'Your report is encrypted end-to-end. Only authorized investigators within your organization can access it.',
                  'You can report at any time, from any device, from anywhere in the world.',
                  'You are protected by law from retaliation when reporting in good faith.',
                  'Multiple reports can be submitted without creating an account.',
                  'You can track your report status anonymously using a tracking ID.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Step by Step */}
            <Card className="p-8 border border-border bg-card/50 space-y-6">
              <h2 className="text-2xl font-bold">Step-by-Step Guide</h2>

              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Choose Your Organization',
                    description: 'Select the organization where the misconduct occurred. ConfideU supports multiple organizations, departments, and agencies.',
                  },
                  {
                    step: 2,
                    title: 'Select the Issue Category',
                    description:
                      'Choose the type of misconduct you\'re reporting: Fraud, Corruption, Harassment, Discrimination, Safety Violation, or Other.',
                  },
                  {
                    step: 3,
                    title: 'Provide Detailed Information',
                    description:
                      'Describe what happened, when it happened, where it happened, and who was involved. Be as specific as possible without including identifying details about yourself.',
                  },
                  {
                    step: 4,
                    title: 'Submit Evidence',
                    description:
                      'Attach or describe any supporting documents, emails, screenshots, or other evidence. For security, you can describe files without uploading.',
                  },
                  {
                    step: 5,
                    title: 'Set Priority Level',
                    description:
                      'Indicate how urgent the matter is: Low, Medium, or High. High priority reports are reviewed first.',
                  },
                  {
                    step: 6,
                    title: 'Submit & Receive Tracking ID',
                    description:
                      'Submit your report and receive a unique tracking ID. Save this ID to check your report status later.',
                  },
                ].map((item) => (
                  <div key={item.step} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-foreground/80 ml-11">{item.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* What to Include */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">What to Include in Your Report</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    Do Include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                    <li>Specific dates, times, and locations</li>
                    <li>Names of people involved (other than yourself)</li>
                    <li>Detailed descriptions of what happened</li>
                    <li>Any documentary evidence or supporting materials</li>
                    <li>How the misconduct affected you or others</li>
                    <li>Any witnesses to the incident</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Don't Include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                    <li>Your personal name or contact information</li>
                    <li>Information that could identify you</li>
                    <li>Personal opinions unrelated to the facts</li>
                    <li>Hearsay or unverified rumors</li>
                    <li>Threats or violent language</li>
                    <li>Information covered by attorney-client privilege</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* After You Report */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">After You Submit Your Report</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">What Happens Next</h3>
                  <ol className="list-decimal list-inside space-y-2 text-foreground/80">
                    <li>Your report is received and automatically encrypted</li>
                    <li>It's assigned to an investigator within your organization</li>
                    <li>Initial assessment begins within 2-3 business days</li>
                    <li>Investigation proceeds according to your organization's policies</li>
                    <li>You can check status updates using your tracking ID</li>
                    <li>Resolution or closure within 30-90 days typically</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Checking Your Report Status</h3>
                  <p className="text-foreground/80">
                    Use your tracking ID to check your report status anytime without revealing your identity. Visit the Track page to check on your reports anonymously.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Your Rights</h3>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80">
                    <li>Protection from retaliation under law</li>
                    <li>Confidentiality of your identity</li>
                    <li>Fair and impartial investigation</li>
                    <li>Regular updates on your report status</li>
                    <li>Due process in any disciplinary action</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Protection & Legal */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">Your Protection Under Law</h2>

              <div className="space-y-4 text-foreground/80">
                <p>
                  Whistleblower protection laws exist in most countries. You are protected when reporting misconduct in good faith:
                </p>

                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="font-semibold flex-shrink-0">Dodd-Frank Act (US):</span>
                    <span>Protects employees reporting violations of federal laws to SEC, OSHA, or internal channels</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold flex-shrink-0">Sarbanes-Oxley (US):</span>
                    <span>Protects employees from retaliation for reporting accounting violations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold flex-shrink-0">GDPR (EU):</span>
                    <span>Includes whistleblower protections for privacy violations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold flex-shrink-0">Public Interest Disclosure Act (UK):</span>
                    <span>Protects employees reporting health, safety, and legal violations</span>
                  </li>
                </ul>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <p className="flex items-center gap-2 text-foreground mb-2">
                    <Info className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">Important:</span>
                  </p>
                  <p className="text-foreground/80">
                    Retaliation for reporting misconduct is illegal. If you experience retaliation after making a report, document it and report it to relevant authorities.
                  </p>
                </div>
              </div>
            </Card>

            {/* FAQ */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

              <div className="space-y-4">
                {[
                  {
                    q: 'Is my report truly anonymous?',
                    a: 'Yes. We use advanced encryption, never log IP addresses, and don\'t collect any identifying information. Your anonymity is guaranteed.',
                  },
                  {
                    q: 'What if I need to provide updates?',
                    a: 'You can submit additional information using your tracking ID. Each update is encrypted and kept confidential.',
                  },
                  {
                    q: 'How long does an investigation take?',
                    a: 'Investigation timelines vary, but most are completed within 30-90 days. You can check the status using your tracking ID.',
                  },
                  {
                    q: 'Can I retract my report?',
                    a: 'Yes. Contact our support team with your tracking ID if you need to withdraw your report before investigation begins.',
                  },
                  {
                    q: 'What if the person I\'m reporting is my manager?',
                    a: 'Report them anyway. Investigations bypass the chain of command to ensure impartiality and your protection.',
                  },
                  {
                    q: 'Can I include documents with my report?',
                    a: 'Yes. You can describe files or submit evidence securely through our encrypted platform.',
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="font-semibold text-foreground mb-2">{item.q}</p>
                    <p className="text-foreground/80">{item.a}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <div className="space-y-4 text-center">
              <p className="text-foreground/70 text-lg">Ready to report?</p>
              <Link href="/report">
                <Button size="lg" className="w-full sm:w-auto">
                  Submit Your Report Anonymously
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
