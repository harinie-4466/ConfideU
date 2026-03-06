'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { hashPassword, verifyPasswordHash } from '@/lib/crypto'

export type UserRole = 'citizen' | 'in-organisation' | 'as-organisation' | 'admin'

export interface User {
  id: string
  role: UserRole
  email?: string
  organisationName?: string
  organisationType?: 'school' | 'corporate' | 'ngo' | 'police'
  privateKey?: string
  passwordHash?: string
  passwordSalt?: string
  isLoggedIn: boolean
  isPasswordVerified?: boolean
  lastPasswordVerification?: {
    enteredHash: string
    storedHash: string
    timestamp: string
  }
  token?: string
}

interface AuthContextType {
  user: User | null
  login: (userData: Partial<User>) => void
  register: (userData: Partial<User>) => void
  logout: () => void
  isAuthenticated: boolean
  verifyOtp: (tempToken: string, otp: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('confideU_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(parsedUser.isLoggedIn)
      } catch (error) {
        console.log('[v0] Failed to parse stored user')
      }
    }
  }, [])

  const login = async (userData: Partial<User>) => {
    // If we're passing a User object directly (from direct API calls in page), skip the fetch
    if (userData.isLoggedIn && userData.token) {
      const newUser = userData as User;
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('confideU_user', JSON.stringify(newUser));
      localStorage.setItem('confideU_token', newUser.token || '');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error);
        return;
      }

      // Identify if MFA is required
      if (data.mfaRequired) {
        // This path should ideally be handled by the caller (LoginPage)
        // But if called here, we can't easily return the tempToken without changing interface.
        // For now, assuming standard login via page handles this.
        return;
      }

      const newUser: User = {
        id: data.data._id,
        role: data.data.role,
        email: data.data.email,
        organisationName: data.data.organisationName,
        organisationType: data.data.organisationType,
        isLoggedIn: true,
        token: data.data.token
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('confideU_user', JSON.stringify(newUser));
      localStorage.setItem('confideU_token', data.data.token);
    } catch (err: any) {
      console.error(err);
      alert('Login failed');
    }
  }

  const verifyOtp = async (tempToken: string, otp: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, otp })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error);
        return false;
      }

      const newUser: User = {
        id: data.data._id,
        role: data.data.role,
        email: data.data.email,
        organisationName: data.data.organisationName,
        organisationType: data.data.organisationType,
        isLoggedIn: true,
        token: data.data.token
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('confideU_user', JSON.stringify(newUser));
      localStorage.setItem('confideU_token', data.data.token);
      return true;

    } catch (err) {
      console.error(err);
      alert('OTP Verification Failed');
      return false;
    }
  }

  const register = async (userData: Partial<User>) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error);
        return;
      }

      const newUser: User = {
        id: data.data._id,
        role: data.data.role,
        email: data.data.email,
        organisationName: data.data.organisationName,
        organisationType: data.data.organisationType,
        isLoggedIn: true,
        token: data.data.token
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('confideU_user', JSON.stringify(newUser));
      localStorage.setItem('confideU_token', data.data.token);
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('confideU_user')
    localStorage.removeItem('confideU_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
