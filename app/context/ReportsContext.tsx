'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Report {
  id: string;
  category: string;
  description: string;
  evidence: string;
  priority: 'low' | 'medium' | 'high';
  status: 'submitted' | 'under-review' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  trackingId: string;
}

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'trackingId'>) => string;
  updateReport: (id: string, report: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReport: (id: string) => Report | undefined;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      category: 'Fraud',
      description: 'Financial discrepancy found in Q3 reports',
      evidence: 'Document files submitted',
      priority: 'high',
      status: 'in-progress',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      trackingId: 'RPT-001',
    },
    {
      id: '2',
      category: 'Harassment',
      description: 'Workplace harassment incident',
      evidence: 'Email correspondence and witness statements',
      priority: 'high',
      status: 'under-review',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      trackingId: 'RPT-002',
    },
  ]);

  const addReport = useCallback((report: Omit<Report, 'id' | 'createdAt' | 'trackingId'>) => {
    const id = Date.now().toString();
    const trackingId = `RPT-${String(reports.length + 1).padStart(3, '0')}`;
    const newReport: Report = {
      ...report,
      id,
      createdAt: new Date().toISOString(),
      trackingId,
    };
    setReports((prev) => [newReport, ...prev]);
    return trackingId;
  }, [reports.length]);

  const updateReport = useCallback((id: string, updates: Partial<Report>) => {
    setReports((prev) =>
      prev.map((report) => (report.id === id ? { ...report, ...updates } : report))
    );
  }, []);

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  }, []);

  const getReport = useCallback((id: string) => {
    return reports.find((report) => report.id === id);
  }, [reports]);

  return (
    <ReportsContext.Provider value={{ reports, addReport, updateReport, deleteReport, getReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within ReportsProvider');
  }
  return context;
}
