'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CrimeStatus = 'submitted' | 'in-progress' | 'solved' | 'pending-review'

export interface Crime {
  id: string
  caseId: string
  reporterId: string
  reporterRole: string
  crimeDate: string
  venue: string
  personCommitted: string
  personDesignation: string
  culpritOrganisation: string
  incidentDescription: string
  category: string
  evidence: Array<{
    name: string
    type: string
    size: number
    uploadedAt: string
  }>
  informPolice: boolean
  confidentialityType: 'high' | 'low'
  otherDetails: string
  status: CrimeStatus
  createdAt: string
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  notes?: string
  timeline?: Array<{
    date: string
    action: string
  }>
}

interface CrimesContextType {
  crimes: Crime[]
  addCrime: (crime: Omit<Crime, 'id' | 'caseId' | 'createdAt'>) => { caseId: string }
  updateCrime: (id: string, updates: Partial<Crime>) => void
  deleteCrime: (id: string) => void
  getCrimeById: (id: string) => Crime | undefined
  getCrimesByReporter: (reporterId: string) => Crime[]
  getCrimesByOrganisation: () => Crime[]
  filterCrimes: (filters: { status?: CrimeStatus; priority?: string }) => Crime[]
}

const CrimesContext = createContext<CrimesContextType | undefined>(undefined)

const generateCaseId = () => {
  return `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export const CrimesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crimes, setCrimes] = useState<Crime[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const storedCrimes = localStorage.getItem('confideU_crimes')
    if (storedCrimes) {
      try {
        setCrimes(JSON.parse(storedCrimes))
      } catch (error) {
        console.log('[v0] Failed to parse stored crimes')
      }
    } else {
      // Initialize with sample data
      const sampleCrimes: Crime[] = [
        {
          id: '1',
          caseId: 'CASE-001',
          reporterId: 'reporter_1',
          reporterRole: 'citizen',
          crimeDate: '2024-01-15',
          venue: 'Office Building A, Floor 3',
          personCommitted: 'John Smith',
          personDesignation: 'Manager',
          culpritOrganisation: 'Tech Corp Ltd',
          incidentDescription: 'Unauthorized access to confidential financial records',
          category: 'Data Breach',
          evidence: [
            { name: 'screenshot.png', type: 'image', size: 245000, uploadedAt: '2024-01-15' }
          ],
          informPolice: true,
          confidentialityType: 'high',
          otherDetails: 'Evidence suggests systematic access over 3 months',
          status: 'in-progress',
          createdAt: '2024-01-15',
          priority: 'high',
          timeline: [
            { date: '2024-01-15', action: 'Report submitted' },
            { date: '2024-01-16', action: 'Under investigation' }
          ]
        },
        {
          id: '2',
          caseId: 'CASE-002',
          reporterId: 'reporter_2',
          reporterRole: 'citizen',
          crimeDate: '2024-01-10',
          venue: 'School Campus Main Building',
          personCommitted: 'Sarah Johnson',
          personDesignation: 'Administrative Staff',
          culpritOrganisation: 'Central High School',
          incidentDescription: 'Misappropriation of student funds',
          category: 'Fraud',
          evidence: [
            { name: 'financial_records.pdf', type: 'document', size: 512000, uploadedAt: '2024-01-10' }
          ],
          informPolice: true,
          confidentialityType: 'high',
          otherDetails: 'Funds allegedly transferred to personal account',
          status: 'submitted',
          createdAt: '2024-01-10',
          priority: 'high'
        }
      ]
      setCrimes(sampleCrimes)
      localStorage.setItem('confideU_crimes', JSON.stringify(sampleCrimes))
    }
  }, [])

  // Save to localStorage whenever crimes change
  useEffect(() => {
    localStorage.setItem('confideU_crimes', JSON.stringify(crimes))
  }, [crimes])

  const addCrime = (crime: Omit<Crime, 'id' | 'caseId' | 'createdAt'>) => {
    const caseId = generateCaseId()
    const newCrime: Crime = {
      ...crime,
      id: `crime_${Date.now()}`,
      caseId,
      createdAt: new Date().toISOString().split('T')[0],
      timeline: [
        { date: new Date().toISOString().split('T')[0], action: 'Report submitted' }
      ]
    }
    setCrimes([...crimes, newCrime])
    return { caseId }
  }

  const updateCrime = (id: string, updates: Partial<Crime>) => {
    setCrimes(crimes.map(crime =>
      crime.id === id ? { ...crime, ...updates } : crime
    ))
  }

  const deleteCrime = (id: string) => {
    setCrimes(crimes.filter(crime => crime.id !== id))
  }

  const getCrimeById = (id: string) => {
    return crimes.find(crime => crime.id === id)
  }

  const getCrimesByReporter = (reporterId: string) => {
    return crimes.filter(crime => crime.reporterId === reporterId)
  }

  const getCrimesByOrganisation = () => {
    return crimes
  }

  const filterCrimes = (filters: { status?: CrimeStatus; priority?: string }) => {
    return crimes.filter(crime => {
      if (filters.status && crime.status !== filters.status) return false
      if (filters.priority && crime.priority !== filters.priority) return false
      return true
    })
  }

  return (
    <CrimesContext.Provider value={{
      crimes,
      addCrime,
      updateCrime,
      deleteCrime,
      getCrimeById,
      getCrimesByReporter,
      getCrimesByOrganisation,
      filterCrimes
    }}>
      {children}
    </CrimesContext.Provider>
  )
}

export const useCrimes = () => {
  const context = useContext(CrimesContext)
  if (!context) {
    throw new Error('useCrimes must be used within CrimesProvider')
  }
  return context
}
