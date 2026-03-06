'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)
  const [role, setRole] = useState<'citizen' | 'in-organisation' | 'as-organisation' | 'admin' | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    privateKey: '',
    organisationName: '',
    organisationType: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return

    // Validate Fields based on Auth Mode
    if (authMode === 'login') {
      if (role === 'in-organisation') {
        if (!formData.privateKey || !formData.password || !formData.organisationName || !formData.organisationType) {
          alert('Please enter Organisation Name, Type, Private Key and Password');
          return;
        }
      } else if (role === 'citizen' && (!formData.privateKey || !formData.password)) {
        alert('Please enter Private Key and Password')
        return
      }
    } else {
      // Register Mode
      if ((role === 'citizen' || role === 'in-organisation') && (!formData.email || !formData.password)) {
        alert('Please enter Email and Password');
        return;
      }
    }

    if ((role === 'as-organisation' || role === 'admin') && (!formData.email || !formData.password)) {
      alert('Please enter email and password')
      return
    }

    // Prepare API Body
    const body: any = { role, password: formData.password };

    if (role === 'citizen' || role === 'in-organisation') {
      body.privateKey = formData.privateKey;
    } else {
      body.email = formData.email;
    }

    if (role === 'in-organisation') {
      body.organisationName = formData.organisationName;
      body.organisationType = formData.organisationType;
    }

    try {
      // Direct API Call to initiate Login/MFA
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.error || 'Login failed');
        return;
      }

      // Check MFA
      if (data.mfaRequired) {
        // Store Temp Token for Next Step
        localStorage.setItem('confideU_mfa_token', data.tempToken);
        localStorage.setItem('confideU_mfa_email', formData.email); // Optional for validaton

        if (role === 'admin') {
          router.push('/auth/admin-login-mfa');
        } else {
          router.push('/auth/org-login-mfa');
        }
      } else {
        // Regular Login (Citizen / No MFA)
        // We can use the data returned directly or call login() from context to set state
        login({
          ...data.data,
          isLoggedIn: true
        });

        if (role === 'citizen' || role === 'in-organisation') {
          router.push('/dashboard/reporter');
        }
      }

    } catch (err) {
      console.error(err);
      alert('Connection error');
    }
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegisterNext = async () => {
    if (!role) {
      alert('Please select a role')
      return
    }

    // Common Validation
    // Password Policy: Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if ((role === 'citizen' || role === 'in-organisation' || role === 'admin' || role === 'as-organisation')) {
      if (!passwordRegex.test(formData.password)) {
        alert('Password must be at least 8 characters long and include:\n- One Uppercase Letter\n- One Lowercase Letter\n- One Number\n- One Special Character (@$!%*?&)');
        return;
      }
    }

    let payload: any = { role, password: formData.password };
    let privateKeyGenerated = '';

    if (role === 'citizen') {
      if (!formData.email || !formData.password) {
        alert('Please fill in all fields');
        return;
      }
      if (!isValidEmail(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }
      privateKeyGenerated = `PK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      payload.email = formData.email;
      payload.privateKey = privateKeyGenerated;

    } else if (role === 'in-organisation') {
      if (!formData.organisationName || !formData.password || !formData.organisationType) {
        alert('Please fill in all fields');
        return;
      }
      privateKeyGenerated = `PK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      payload.email = formData.email || `inorg-${Date.now()}@temp.com`;
      payload.organisationName = formData.organisationName;
      payload.organisationType = formData.organisationType;
      payload.privateKey = privateKeyGenerated;

    } else if (role === 'as-organisation') {
      if (!formData.organisationName || !formData.organisationType || !formData.email || !formData.password) {
        alert('Please fill in all fields')
        return
      }
      if (!isValidEmail(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }
      payload.email = formData.email;
      payload.organisationName = formData.organisationName;
      payload.organisationType = formData.organisationType;
    } else if (role === 'admin') {
      if (!formData.email || !formData.password) {
        alert('Please fill in all fields');
        return;
      }
      if (!isValidEmail(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }
      payload.email = formData.email;
    }

    // Direct Register API Call (No Auto-Login)
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        let msg = 'Registration Successful! Please Login.';
        if (privateKeyGenerated) {
          msg += `\n\nIMPORTANT: Your Private Key is: ${privateKeyGenerated}\nPlease save this key securely immediately. You will need it to login.`;
        }
        alert(msg);

        // Redirect to Login View
        setAuthMode('login');
        // Reset Form (keep generated key in clipboard concept or just clear? safe to clear as user saw alert)
        setFormData({ email: '', password: '', privateKey: '', organisationName: '', organisationType: '' });
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed. Server connection error.');
    }
  }

  if (!authMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        <button
          onClick={() => router.push('/')}
          className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-accent hover:bg-card rounded-lg transition-colors"
          title="Back to Home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">ConfideU</h1>
            <p className="text-center text-muted-foreground mb-8">Secure Whistleblower Platform</p>

            <div className="space-y-4">
              <Button
                onClick={() => setAuthMode('login')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
              >
                Login
              </Button>
              <Button
                onClick={() => setAuthMode('register')}
                variant="outline"
                className="w-full border-border hover:bg-card h-12 text-base"
              >
                Register
              </Button>
              <Link href="/report-anonymous">
                <Button
                  variant="outline"
                  className="w-full border-border hover:bg-card h-12 text-base bg-transparent"
                >
                  Report Without Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            {authMode === 'login' ? 'Login to ConfideU' : 'Register with ConfideU'}
          </h1>

          <form onSubmit={authMode === 'login' ? handleLogin : (e) => { e.preventDefault(); handleRegisterNext() }}>
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Select Role</label>
              <select
                value={role || ''}
                onChange={(e) => {
                  setRole(e.target.value as any)
                  setFormData({ email: '', password: '', privateKey: '', organisationName: '', organisationType: '' })
                }}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a role...</option>
                <option value="citizen">Citizen</option>
                <option value="in-organisation">In Organisation</option>
                <option value="as-organisation">As Organisation</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Citizen Role */}
            {role === 'citizen' && (
              <>
                {authMode === 'register' ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">Private Key</label>
                    <Input
                      type="text"
                      name="privateKey"
                      value={formData.privateKey}
                      onChange={handleInputChange}
                      placeholder="PK_xxxxxxxxxxxx"
                      className="w-full"
                    />
                  </div>
                )}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* In Organisation Role */}
            {role === 'in-organisation' && (
              <>
                {authMode === 'register' ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">Private Key</label>
                    <Input
                      type="text"
                      name="privateKey"
                      value={formData.privateKey}
                      onChange={handleInputChange}
                      placeholder="PK_xxxxxxxxxxxx"
                      className="w-full"
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Organisation Name</label>
                  <Input
                    type="text"
                    name="organisationName"
                    value={formData.organisationName}
                    onChange={handleInputChange}
                    placeholder="Your Organisation"
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Organisation Type</label>
                  <select
                    name="organisationType"
                    value={formData.organisationType}
                    onChange={handleInputChange}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select type...</option>
                    <option value="school">School</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
                {authMode === 'register' && (
                  <div className="hidden">
                    {/* Hidden Duplicate from previous logic adjustment if needed, but safe to remove if we make input always visible or conditional properly */}
                  </div>
                )}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Admin Role */}
            {role === 'admin' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Admin Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@confideU.com"
                    className="w-full"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Admin Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* As Organisation Role */}
            {role === 'as-organisation' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Organisation Name</label>
                  <Input
                    type="text"
                    name="organisationName"
                    value={formData.organisationName}
                    onChange={handleInputChange}
                    placeholder="Your Organisation Name"
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Organisation Type</label>
                  <select
                    name="organisationType"
                    value={formData.organisationType}
                    onChange={handleInputChange}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select type...</option>
                    <option value="school">School</option>
                    <option value="corporate">Corporate</option>
                    <option value="ngo">NGO</option>
                    <option value="police">Police</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="org@email.com"
                    className="w-full"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 mb-4"
            >
              {authMode === 'login' ? 'Login' : 'Continue'}
            </Button>
          </form>

          <button
            onClick={() => {
              setAuthMode(null)
              setRole(null)
              setFormData({ email: '', password: '', privateKey: '', organisationName: '', organisationType: '' })
            }}
            className="w-full text-center text-sm text-muted-foreground hover:text-accent"
          >
            Back to Options
          </button>
        </div>
      </div>
    </div>
  )
}
