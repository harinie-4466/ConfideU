'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EvidenceVerification } from '@/components/EvidenceVerification';
import { PasswordVerification } from '@/components/PasswordVerification';
import { hashData, generateSignature, hashPassword, encryptAES, generateAESKey } from '@/lib/crypto';
import { ArrowLeft, Lock, Hash, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SecurityDemoPage() {
  const [activeSection, setActiveSection] = useState<'password' | 'evidence' | 'hashing'>('password');
  const [showDetails, setShowDetails] = useState(false);
  const [testPassword, setTestPassword] = useState('MySecurePassword123');
  const [testData, setTestData] = useState('Important Evidence File');

  // Generate demo password hash
  const { hash: demoPasswordHash, salt: demoSalt } = hashPassword(testPassword);

  // Generate demo evidence hash
  const evidenceHash = hashData(testData);
  const evidenceSignature = generateSignature(testData, 'demo-private-key');

  // Generate AES key
  const aesKey = generateAESKey();
  const { iv, encrypted } = encryptAES(testData, aesKey);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ConfideU Security Demo</h1>
            <p className="text-sm text-muted-foreground">Cryptographic Features Showcase</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-border hover:bg-card flex items-center gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 flex-wrap border-b border-border pb-4">
          {[
            { id: 'password', label: 'Password Hashing', icon: '🔐' },
            { id: 'evidence', label: 'Evidence Verification', icon: '📎' },
            { id: 'hashing', label: 'Data Hashing', icon: '#️⃣' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeSection === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:border-accent'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Password Hashing Section */}
        {activeSection === 'password' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-accent" />
                PBKDF2-SHA512 Password Hashing
              </h2>

              <div className="space-y-4">
                <div className="bg-input/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Test Password:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                      className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground"
                    />
                    <Button
                      onClick={() => setShowDetails(!showDetails)}
                      variant="outline"
                      className="border-border hover:bg-card flex items-center gap-2"
                    >
                      {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-input/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">Generated Hash:</p>
                    <p className="text-xs text-foreground font-mono break-all">{demoPasswordHash}</p>
                  </div>

                  <div className="bg-input/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">Salt (hex):</p>
                    <p className="text-xs text-foreground font-mono break-all">{demoSalt}</p>
                  </div>

                  <div className="bg-accent/10 rounded-lg p-4 text-sm text-foreground/70 border border-accent/20 space-y-2">
                    <p className="font-semibold text-accent">Security Info:</p>
                    <ul className="space-y-1 text-xs">
                      <li>✓ Algorithm: PBKDF2 with SHA-512</li>
                      <li>✓ Iterations: 100,000</li>
                      <li>✓ Salt: 16 bytes (randomly generated)</li>
                      <li>✓ Output: 64 bytes (512 bits)</li>
                      <li>✓ Resistant to: Rainbow tables, brute force attacks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {showDetails && (
              <PasswordVerification
                isVerified={true}
                enteredPasswordHash={demoPasswordHash}
                storedPasswordHash={demoPasswordHash}
                showDetails={true}
              />
            )}
          </div>
        )}

        {/* Evidence Verification Section */}
        {activeSection === 'evidence' && (
          <div className="space-y-6">
            <EvidenceVerification
              fileName="evidence_document.pdf"
              storedHash={evidenceHash}
              computedHash={evidenceHash}
              storedSignature={evidenceSignature}
              computedSignature={evidenceSignature}
              rsaEncrypted={encrypted.substring(0, 60) + '...'}
              rsaDecrypted={testData.substring(0, 30) + '...'}
              isVerified={true}
              isCorrupted={false}
            />

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">AES-256-CBC Encryption Details</h3>
              <div className="space-y-3">
                <div className="bg-input/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Encryption Key (hex):</p>
                  <p className="text-xs text-foreground font-mono break-all">{aesKey}</p>
                </div>
                <div className="bg-input/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">IV (hex):</p>
                  <p className="text-xs text-foreground font-mono break-all">{iv}</p>
                </div>
                <div className="bg-input/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Encrypted Data (hex):</p>
                  <p className="text-xs text-foreground font-mono break-all">{encrypted.substring(0, 100)}...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Hashing Section */}
        {activeSection === 'hashing' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Hash className="w-6 h-6 text-accent" />
                SHA-256 & HMAC-SHA256 Hashing
              </h2>

              <div className="space-y-4">
                <div className="bg-input/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Test Data:</p>
                  <textarea
                    value={testData}
                    onChange={(e) => setTestData(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground text-sm"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-input/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">SHA-256 Hash:</p>
                    <p className="text-xs text-foreground font-mono break-all">{hashData(testData)}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ✓ 256-bit output, deterministic, collision-resistant
                    </p>
                  </div>

                  <div className="bg-input/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">HMAC-SHA256 Signature:</p>
                    <p className="text-xs text-foreground font-mono break-all">
                      {generateSignature(testData, 'evidence-key')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ✓ Authenticated message, proves integrity & authenticity
                    </p>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4 text-sm text-foreground/70 border border-primary/20 space-y-2">
                  <p className="font-semibold text-primary">Use Cases:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Evidence Integrity: Detect if files have been modified</li>
                    <li>✓ Digital Signatures: Prove authenticity of submitted evidence</li>
                    <li>✓ Chain of Custody: Maintain audit trail of evidence handling</li>
                    <li>✓ Forensic Verification: Validate evidence in legal proceedings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Client-Side Security</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>End-to-end encryption protects data in transit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>Password hashing with salt prevents rainbow tables</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>Evidence verification ensures data integrity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">⚠</span>
                <span>Move cryptographic operations to backend for production</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Production Recommendations</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Implement TLS/HTTPS for all communications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Use HSM or key vault for key management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Encrypt sensitive data at rest in database</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">→</span>
                <span>Implement comprehensive audit logging</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
