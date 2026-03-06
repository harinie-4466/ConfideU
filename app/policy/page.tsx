'use client';


import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { User, Shield, Building2, Settings, CheckCircle2, XCircle, Info } from 'lucide-react';

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Compliance & Policy</h1>
              <p className="text-foreground/70 text-lg">
                ConfideU operates under the highest standards of security, privacy, and regulatory compliance.
              </p>
            </div>

            {/* Roles, Access & Justification */}
            <Card className="p-8 border border-border bg-card/50 space-y-8">
              <h2 className="text-2xl font-bold">Roles, Access & Justification</h2>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Anonymous Reporter */}
                <div className="bg-background/50 p-6 rounded-lg border border-border space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                      <User className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg">Anonymous Reporter</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-green-500 mb-1 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Access Rights
                      </div>
                      <ul className="list-disc list-inside text-foreground/70 pl-1 space-y-1">
                        <li>Submit reports</li>
                        <li>Upload evidence</li>
                        <li>Track only their own case using Case ID + Private Key</li>
                      </ul>
                    </div>

                    <div>
                      <div className="font-semibold text-red-500 mb-1 flex items-center gap-2">
                        <XCircle className="h-4 w-4" /> Restrictions
                      </div>
                      <p className="text-foreground/70 pl-1">Cannot view other reports or evidence</p>
                    </div>

                    <div className="bg-muted/50 p-3 rounded text-xs border border-border/50">
                      <p className="font-medium mb-1">Justification</p>
                      <p className="text-foreground/60">Protects whistleblower anonymity and prevents misuse of public access.</p>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-blue-500 bg-blue-500/5 p-2 rounded border border-blue-500/10">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>On submit page: “You can only access reports created using your private case key.”</p>
                    </div>
                  </div>
                </div>

                {/* Investigator */}
                <div className="bg-background/50 p-6 rounded-lg border border-border space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg">Investigator</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-green-500 mb-1 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Access Rights
                      </div>
                      <ul className="list-disc list-inside text-foreground/70 pl-1 space-y-1">
                        <li>View cases assigned to them</li>
                        <li>Decrypt and view evidence</li>
                        <li>Communicate with reporter anonymously</li>
                        <li>Update case status</li>
                      </ul>
                    </div>

                    <div>
                      <div className="font-semibold text-red-500 mb-1 flex items-center gap-2">
                        <XCircle className="h-4 w-4" /> Restrictions
                      </div>
                      <ul className="list-disc list-inside text-foreground/70 pl-1 space-y-1">
                        <li>Cannot modify original evidence</li>
                        <li>Cannot view reporter identity</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 p-3 rounded text-xs border border-border/50">
                      <p className="font-medium mb-1">Justification</p>
                      <p className="text-foreground/60">Investigators require evidence access to act, but identity protection prevents retaliation.</p>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-orange-500 bg-orange-500/5 p-2 rounded border border-orange-500/10">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>Dashboard banner: “Access limited to assigned cases. Evidence access is logged.”</p>
                    </div>
                  </div>
                </div>

                {/* Organization Admin */}
                <div className="bg-background/50 p-6 rounded-lg border border-border space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg">Organization Admin</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-green-500 mb-1 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Access Rights
                      </div>
                      <ul className="list-disc list-inside text-foreground/70 pl-1 space-y-1">
                        <li>Manage organization users</li>
                        <li>Assign investigators to cases</li>
                        <li>View case metadata (not evidence)</li>
                      </ul>
                    </div>

                    <div>
                      <div className="font-semibold text-red-500 mb-1 flex items-center gap-2">
                        <XCircle className="h-4 w-4" /> Restrictions
                      </div>
                      <ul className="list-disc list-inside text-foreground/70 pl-1 space-y-1">
                        <li>Cannot view evidence content</li>
                        <li>Cannot decrypt files</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 p-3 rounded text-xs border border-border/50">
                      <p className="font-medium mb-1">Justification</p>
                      <p className="text-foreground/60">Prevents insider threats and conflicts of interest.</p>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-purple-500 bg-purple-500/5 p-2 rounded border border-purple-500/10">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>Admin panel note: “Admins manage workflow but do not access evidence content.”</p>
                    </div>
                  </div>
                </div>

                {/* System Admin */}
                <div className="bg-background/50 p-6 rounded-lg border border-border space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-slate-500/10 text-slate-500">
                      <Settings className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg">System Admin</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-green-500 mb-1 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Access Rights
                      </div>
                      <ul className="list-disc list-inside text-foreground/70 pl-1 space-y-1">
                        <li>System configuration</li>
                        <li>User role management</li>
                        <li>Audit logs</li>
                      </ul>
                    </div>

                    <div>
                      <div className="font-semibold text-red-500 mb-1 flex items-center gap-2">
                        <XCircle className="h-4 w-4" /> Restrictions
                      </div>
                      <ul className="list-disc list-inside text-foreground/70 pl-1 space-y-1">
                        <li>Cannot view or decrypt evidence</li>
                        <li>Cannot access report content</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 p-3 rounded text-xs border border-border/50">
                      <p className="font-medium mb-1">Justification</p>
                      <p className="text-foreground/60">Separation of duties ensures platform operators cannot misuse sensitive data.</p>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-500/5 p-2 rounded border border-slate-500/10">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>How They Are Informed: Security policy page</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Privacy Policy */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">Privacy Policy</h2>

              <div className="space-y-4 text-foreground/80">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Data Collection</h3>
                  <p>
                    ConfideU collects minimal personal data. We do not log IP addresses, collect cookies, or store device information. The only information we collect is what you voluntarily provide in your report.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Data Protection</h3>
                  <p>
                    All data is encrypted end-to-end using AES-256 encryption. We use industry-standard protocols to protect your information. Our systems are regularly audited by third-party security experts.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Data Retention</h3>
                  <p>
                    We retain report data only as long as necessary for investigation purposes. Users can request deletion of their data subject to legal requirements and ongoing investigations.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Data Sharing</h3>
                  <p>
                    Your data is only shared with authorized investigators within your organization. We never share data with third parties except where legally required or with your explicit consent.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">International Compliance</h3>
                  <p>
                    ConfideU complies with GDPR, CCPA, and other international privacy regulations. We maintain data residency options for organizations with specific requirements.
                  </p>
                </div>
              </div>
            </Card>

            {/* Security Standards */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">Security Standards</h2>

              <div className="space-y-4 text-foreground/80">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Certifications</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>ISO 27001 - Information Security Management</li>
                    <li>SOC 2 Type II - Security and Privacy Controls</li>
                    <li>GDPR Compliant - Data Protection Regulation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Encryption Standards</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>AES-256 for data at rest</li>
                    <li>TLS 1.3 for data in transit</li>
                    <li>RSA-4096 for digital signatures</li>
                    <li>SHA-256 for evidence hashing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Access Controls</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Role-based access control (RBAC)</li>
                    <li>Multi-factor authentication (MFA)</li>
                    <li>Session management with automatic timeouts</li>
                    <li>Comprehensive audit logging of all access</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Infrastructure Security</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Hosted on secure, dedicated servers</li>
                    <li>DDoS protection and rate limiting</li>
                    <li>Regular penetration testing</li>
                    <li>Automated vulnerability scanning</li>
                    <li>Disaster recovery and business continuity</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Regulatory Compliance */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">Regulatory Compliance</h2>

              <div className="space-y-4 text-foreground/80">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Dodd-Frank Act (SOX)</h3>
                  <p>
                    ConfideU complies with Sarbanes-Oxley requirements for public companies, including Section 806 whistleblower protections and audit trail requirements.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">GDPR (EU)</h3>
                  <p>
                    We ensure full compliance with General Data Protection Regulation including data subject rights, breach notification, and lawful basis for processing.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">CCPA (California)</h3>
                  <p>
                    California Consumer Privacy Act compliance includes transparent privacy policies, opt-out rights, and data deletion provisions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">PIPEDA (Canada)</h3>
                  <p>
                    Personal Information Protection and Electronic Documents Act compliance for organizations operating in Canada.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Industry-Specific Standards</h3>
                  <p>
                    Compliance with HIPAA, FERPA, and other industry regulations depending on your organization's sector.
                  </p>
                </div>
              </div>
            </Card>

            {/* Business Practices */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">Business Practices</h2>

              <div className="space-y-4 text-foreground/80">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Incident Response</h3>
                  <p>
                    In case of a security breach, we have established protocols to detect, contain, and remediate incidents within hours. All affected parties are notified within 72 hours as required by law.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Whistleblower Protection</h3>
                  <p>
                    We strictly protect the identity of reporters and comply with all whistleblower protection laws. Our platform is designed to provide the strongest possible protection against retaliation.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Transparency</h3>
                  <p>
                    We provide regular transparency reports on requests for data, government orders, and our security practices. Organizations can verify our compliance status at any time.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Vendor Management</h3>
                  <p>
                    All third-party vendors undergo security assessments and sign Data Processing Agreements. We maintain strict vendor accountability for data protection.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Training & Awareness</h3>
                  <p>
                    Our team undergoes regular security training, including OWASP Top 10, secure coding practices, and data protection principles.
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact */}
            <Card className="p-8 border border-border bg-card/50 space-y-4">
              <h2 className="text-2xl font-bold">Questions or Concerns?</h2>
              <p className="text-foreground/80">
                If you have questions about our compliance, security, or privacy practices, please contact our legal and compliance team.
              </p>
              <div className="space-y-2">
                <p className="text-foreground/70">
                  <strong>Email:</strong> compliance@confideu.com
                </p>
                <p className="text-foreground/70">
                  <strong>Security Issues:</strong> security@confideu.com
                </p>
                <p className="text-foreground/70">
                  <strong>Data Subject Requests:</strong> privacy@confideu.com
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
