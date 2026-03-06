'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function OTPVerifyPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isExpired, setIsExpired] = useState(false)
  const [verified, setVerified] = useState(false)
  const [pendingOrgData, setPendingOrgData] = useState<any>(null)

  useEffect(() => {
    const pending = localStorage.getItem('confideU_pending_org')
    if (pending) {
      setPendingOrgData(JSON.parse(pending))
    } else {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !verified) {
      setIsExpired(true)
    }
  }, [timeLeft, verified])

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP')
      return
    }

    if (isExpired) {
      alert('OTP has expired. Please request a new one.')
      return
    }

    // Simulate OTP verification
    setVerified(true)
    
    if (pendingOrgData) {
      const privateKey = `PK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      login({
        role: 'as-organisation',
        email: pendingOrgData.email,
        organisationName: pendingOrgData.organisationName,
        organisationType: pendingOrgData.organisationType as any,
        privateKey
      })
      localStorage.removeItem('confideU_pending_org')
      setTimeout(() => router.push('/dashboard/organisation'), 1500)
    }
  }

  const handleResendOTP = () => {
    setOtp('')
    setTimeLeft(300)
    setIsExpired(false)
    alert('OTP has been resent to your email')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!pendingOrgData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Verified Successfully</h1>
            <p className="text-muted-foreground mb-6">Your organisation has been registered successfully.</p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Verify Email</h1>
          <p className="text-center text-muted-foreground mb-6">
            We've sent a verification code to<br />
            <span className="font-medium text-foreground">{pendingOrgData?.email}</span>
          </p>

          <form onSubmit={handleVerifyOTP}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Enter 6-Digit OTP</label>
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                disabled={isExpired}
                className="w-full text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <div className={`flex items-center justify-center gap-2 text-sm font-medium mb-6 ${
              isExpired ? 'text-destructive' : 'text-accent'
            }`}>
              <Clock className="w-4 h-4" />
              {isExpired ? 'OTP Expired' : `Time remaining: ${formatTime(timeLeft)}`}
            </div>

            <Button
              type="submit"
              disabled={otp.length !== 6 || isExpired}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 mb-4 disabled:opacity-50"
            >
              Verify OTP
            </Button>
          </form>

          <div className="pt-4 border-t border-border text-center">
            {isExpired ? (
              <button
                onClick={handleResendOTP}
                className="text-accent hover:underline font-medium text-sm"
              >
                Resend OTP
              </button>
            ) : (
              <div className="text-sm text-muted-foreground">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  className="text-accent hover:underline font-medium"
                >
                  Resend
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-input/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Demo OTP:</strong> Enter any 6 digits to proceed.
            </p>
          </div>

          <button
            onClick={() => {
              router.push('/login')
              localStorage.removeItem('confideU_pending_org')
            }}
            className="w-full mt-4 text-center text-sm text-muted-foreground hover:text-accent"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}
