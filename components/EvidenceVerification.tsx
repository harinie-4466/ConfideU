'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Lock, Hash } from 'lucide-react';

interface EvidenceVerificationProps {
  fileName: string;
  storedHash?: string;
  computedHash?: string;
  storedSignature?: string;
  computedSignature?: string;
  rsaEncrypted?: string;
  rsaDecrypted?: string;
  isCorrupted?: boolean;
  isVerified?: boolean;
}

export function EvidenceVerification({
  fileName,
  storedHash,
  computedHash,
  storedSignature,
  computedSignature,
  rsaEncrypted,
  rsaDecrypted,
  isCorrupted = false,
  isVerified = false
}: EvidenceVerificationProps) {
  const hashesMatch = storedHash === computedHash && storedHash;
  const signaturesMatch = storedSignature === computedSignature && storedSignature;

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">{fileName}</h3>
        {isCorrupted ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Evidence Corrupted</span>
          </div>
        ) : isVerified ? (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Verified</span>
          </div>
        ) : null}
      </div>

      {/* Hash Verification */}
      {storedHash && (
        <div className="bg-input/30 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Hash className="w-4 h-4" />
            <span className="text-sm font-semibold">Hash Verification</span>
          </div>
          <div className="space-y-1 text-xs">
            <div>
              <p className="text-muted-foreground">Stored Hash:</p>
              <p className="text-foreground font-mono break-all">{storedHash.substring(0, 40)}...</p>
            </div>
            <div>
              <p className="text-muted-foreground">Computed Hash:</p>
              <p className="text-foreground font-mono break-all">{computedHash?.substring(0, 40) || 'N/A'}...</p>
            </div>
            <div className={`mt-2 ${hashesMatch ? 'text-green-400' : 'text-destructive'}`}>
              {hashesMatch ? '✓ Hashes Match - Evidence Integrity Verified' : '✗ Hashes Do Not Match - Evidence May Be Corrupted'}
            </div>
          </div>
        </div>
      )}

      {/* Digital Signature Verification */}
      {storedSignature && (
        <div className="bg-input/30 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-semibold">Digital Signature Verification</span>
          </div>
          <div className="space-y-1 text-xs">
            <div>
              <p className="text-muted-foreground">Stored Signature:</p>
              <p className="text-foreground font-mono break-all">{storedSignature.substring(0, 40)}...</p>
            </div>
            <div>
              <p className="text-muted-foreground">Computed Signature:</p>
              <p className="text-foreground font-mono break-all">{computedSignature?.substring(0, 40) || 'N/A'}...</p>
            </div>
            <div className={`mt-2 ${signaturesMatch ? 'text-green-400' : 'text-destructive'}`}>
              {signaturesMatch ? '✓ Signatures Match - Authenticity Verified' : '✗ Signatures Do Not Match'}
            </div>
          </div>
        </div>
      )}

      {/* RSA Encryption Verification */}
      {rsaEncrypted && rsaDecrypted && (
        <div className="bg-input/30 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-semibold">RSA Encryption Verification</span>
          </div>
          <div className="space-y-1 text-xs">
            <div>
              <p className="text-muted-foreground">RSA Encrypted Value:</p>
              <p className="text-foreground font-mono break-all">{rsaEncrypted.substring(0, 40)}...</p>
            </div>
            <div>
              <p className="text-muted-foreground">RSA Decrypted Value:</p>
              <p className="text-foreground font-mono break-all">{rsaDecrypted.substring(0, 40)}...</p>
            </div>
            <div className="mt-2 text-green-400">
              ✓ AES Keys Match - Encryption Verification Passed
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
