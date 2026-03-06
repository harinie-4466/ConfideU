'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Lock } from 'lucide-react';

interface PasswordVerificationProps {
  isVerified: boolean;
  enteredPasswordHash?: string;
  storedPasswordHash?: string;
  showDetails?: boolean;
}

export function PasswordVerification({
  isVerified,
  enteredPasswordHash,
  storedPasswordHash,
  showDetails = false
}: PasswordVerificationProps) {
  if (!showDetails) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Lock className="w-5 h-5 text-accent" />
          Password Verification
        </h3>
        {isVerified ? (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Failed</span>
          </div>
        )}
      </div>

      <div className="bg-input/30 rounded-lg p-3 space-y-2">
        <div className="space-y-1 text-xs">
          <div>
            <p className="text-muted-foreground">Entered Password Hash (PBKDF2-SHA512):</p>
            <p className="text-foreground font-mono break-all text-xs">{enteredPasswordHash?.substring(0, 60)}...</p>
          </div>
          <div>
            <p className="text-muted-foreground mt-2">Stored Password Hash:</p>
            <p className="text-foreground font-mono break-all text-xs">{storedPasswordHash?.substring(0, 60)}...</p>
          </div>
          <div className={`mt-3 ${isVerified ? 'text-green-400' : 'text-destructive'}`}>
            {isVerified ? '✓ Password Hashes Match - Authentication Successful' : '✗ Password Hashes Do Not Match - Authentication Failed'}
          </div>
        </div>
      </div>

      <div className="bg-accent/10 rounded-lg p-3 text-xs text-foreground/70 border border-accent/20">
        <p className="font-semibold text-accent mb-1">Security Info:</p>
        <p>Passwords are hashed using PBKDF2 with 100,000 iterations and SHA-512. Even if our database were compromised, passwords remain secure.</p>
      </div>
    </div>
  );
}
