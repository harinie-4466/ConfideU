'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CrimeReport {
  id: string;
  caseId: string;
  reportedBy: string;
  reportedByRole: 'citizen' | 'in-organisation';
  reportedByOrg?: string;
  crimeDate: string;
  crimeVenue: string;
  personCommitted: string;
  personDesignation: string;
  personOrganisation: string;
  incidentDescription: string;
  evidenceFiles: EvidenceFile[];
  category: string;
  informPolice: boolean;
  confidentialityType: 'high' | 'low';
  otherDetails: string;
  status: 'submitted' | 'in-progress' | 'solved' | 'later';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  timeline: TimelineEntry[];
  // Visibility for different organizations
  visibleTo?: string[]; // array of org names/types this report is visible to
}

export interface EvidenceFile {
  id: string;
  name: string;
  type: 'doc' | 'video' | 'audio' | 'image';
  size: number;
  uploadedAt: string;
  url: string;
  // Security verification fields
  storedHash?: string;
  storedSignature?: string;
  aesKey?: string;
  rsaEncrypted?: string;
  rsaDecrypted?: string;
  isVerified?: boolean;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  status: string;
  description: string;
}

interface CrimeReportsContextType {
  reports: CrimeReport[];
  addReport: (report: Omit<CrimeReport, 'id' | 'caseId' | 'createdAt' | 'updatedAt' | 'timeline'>) => Promise<string>;
  updateReport: (id: string, updates: Partial<CrimeReport>) => void;
  deleteReport: (id: string) => void;
  getReportByCaseId: (caseId: string) => CrimeReport | undefined;
  getReportsByReporter: (reportedBy: string) => CrimeReport[];
  updateReportStatus: (id: string, status: CrimeReport['status'], description: string) => void;
  addEvidenceToReport: (reportId: string, file: EvidenceFile) => void;
}

const CrimeReportsContext = createContext<CrimeReportsContextType | undefined>(undefined);

export function CrimeReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<CrimeReport[]>([]);

  const fetchReports = useCallback(async () => {
    try {
      const token = localStorage.getItem('confideU_token');
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // Map backend 'evidence' to frontend 'evidenceFiles'
        const mappedReports = data.data.map((report: any) => ({
          ...report,
          id: report._id, // Ensure frontend 'id' is populated from backend '_id'
          evidenceFiles: report.evidenceFiles || (report.evidence || []).map((e: any) => ({ ...e, id: e._id || e.id })), // Use server-processed evidenceFiles (decoded) if available
          incidentDescription: report.details ? (typeof report.details === 'string' ? JSON.parse(report.details).description : report.details.description) : (report.incidentDescription || '')
        }));
        setReports(mappedReports);
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  }, []);

  // Fetch reports on mount or when auth changes (handled by parent usage usually, but let's add an interval or simple effect)
  const { user } = useAuth();

  // Fetch reports on mount or when user/auth changes
  useEffect(() => {
    if (user) {
      fetchReports();
    } else {
      setReports([]); // Clear reports on logout
    }
  }, [user, fetchReports]);

  const addReport = useCallback(async (reportData: Omit<CrimeReport, 'id' | 'caseId' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
    try {
      const token = localStorage.getItem('confideU_token');
      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });
      const data = await res.json();

      if (data.success) {
        setReports(prev => [data.data, ...prev]);
        return data.data.caseId;
      }
      return '';
    } catch (err) {
      console.error('Failed to add report', err);
      return '';
    }
  }, []);

  const updateReport = useCallback(async (id: string, updates: Partial<CrimeReport>) => {
    // API logic for simple update if needed, currently only status update is backend-supported fully
    // We'll optimistically update state
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, ...updates, updatedAt: new Date().toISOString() }
          : report
      )
    );
  }, []);

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  }, []);

  const getReportByCaseId = useCallback((caseId: string) => {
    return reports.find((report) => report.caseId === caseId);
  }, [reports]);

  const getReportsByReporter = useCallback((reportedBy: string) => {
    return reports.filter((report) => report.reportedBy === reportedBy);
  }, [reports]);

  const updateReportStatus = useCallback(async (id: string, status: CrimeReport['status'], description: string) => {
    try {
      const token = localStorage.getItem('confideU_token');
      const res = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, description })
      });
      const data = await res.json();

      if (data.success) {
        setReports(prev => prev.map(r => r.id === id ? data.data : r));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  }, []);

  const addEvidenceToReport = useCallback((reportId: string, file: EvidenceFile) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
            ...report,
            evidenceFiles: [...report.evidenceFiles, file],
            updatedAt: new Date().toISOString()
          }
          : report
      )
    );
  }, []);

  return (
    <CrimeReportsContext.Provider
      value={{
        reports,
        addReport,
        updateReport,
        deleteReport,
        getReportByCaseId,
        getReportsByReporter,
        updateReportStatus,
        addEvidenceToReport
      }}
    >
      {children}
    </CrimeReportsContext.Provider>
  );
}

export function useCrimeReports() {
  const context = useContext(CrimeReportsContext);
  if (!context) {
    throw new Error('useCrimeReports must be used within CrimeReportsProvider');
  }
  return context;
}
