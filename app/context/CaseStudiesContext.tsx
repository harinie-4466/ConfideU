'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  outcome: string;
  image?: string;
  featured: boolean;
  createdAt: string;
}

interface CaseStudiesContextType {
  caseStudies: CaseStudy[];
  addCaseStudy: (study: Omit<CaseStudy, 'id' | 'createdAt'>) => void;
  updateCaseStudy: (id: string, study: Partial<CaseStudy>) => void;
  deleteCaseStudy: (id: string) => void;
  getCaseStudy: (id: string) => CaseStudy | undefined;
}

const CaseStudiesContext = createContext<CaseStudiesContextType | undefined>(undefined);

export function CaseStudiesProvider({ children }: { children: React.ReactNode }) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([
    {
      id: '1',
      title: 'Multinational Corporation Prevents Fraud Ring',
      company: 'Fortune 500 Tech Company',
      industry: 'Technology',
      challenge: 'Multiple accounting irregularities were occurring but employees feared retaliation',
      solution: 'Implemented ConfideU platform allowing confidential reporting',
      outcome: 'Identified $2.3M fraud scheme within 30 days, recovered 95% of losses',
      featured: true,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'University Improves Student Safety',
      company: 'Large Public University',
      industry: 'Education',
      challenge: 'Limited reporting channels for harassment and safety concerns',
      solution: 'Deployed ConfideU for campus-wide anonymous reporting',
      outcome: '340% increase in reports, 12 cases resolved in first semester',
      featured: true,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'NGO Uncovers Human Rights Violations',
      company: 'International NGO',
      industry: 'Non-Profit',
      challenge: 'Workers feared speaking out about abusive practices in field operations',
      solution: 'Secure anonymous reporting system implemented',
      outcome: 'Documented 15 violations, implemented new protection policies',
      featured: false,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const addCaseStudy = useCallback((study: Omit<CaseStudy, 'id' | 'createdAt'>) => {
    const id = Date.now().toString();
    const newStudy: CaseStudy = {
      ...study,
      id,
      createdAt: new Date().toISOString(),
    };
    setCaseStudies((prev) => [newStudy, ...prev]);
  }, []);

  const updateCaseStudy = useCallback((id: string, updates: Partial<CaseStudy>) => {
    setCaseStudies((prev) =>
      prev.map((study) => (study.id === id ? { ...study, ...updates } : study))
    );
  }, []);

  const deleteCaseStudy = useCallback((id: string) => {
    setCaseStudies((prev) => prev.filter((study) => study.id !== id));
  }, []);

  const getCaseStudy = useCallback((id: string) => {
    return caseStudies.find((study) => study.id === id);
  }, [caseStudies]);

  return (
    <CaseStudiesContext.Provider value={{ caseStudies, addCaseStudy, updateCaseStudy, deleteCaseStudy, getCaseStudy }}>
      {children}
    </CaseStudiesContext.Provider>
  );
}

export function useCaseStudies() {
  const context = useContext(CaseStudiesContext);
  if (!context) {
    throw new Error('useCaseStudies must be used within CaseStudiesProvider');
  }
  return context;
}
