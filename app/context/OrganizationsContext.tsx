'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Organization {
  id: string;
  name: string;
  type: 'school' | 'corporate' | 'ngo' | 'police';
  email: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  contactPerson: string;
  phone: string;
  address: string;
  reportsCount: number;
  solvedCasesCount: number;
  investigatorCount: number;
}

interface OrganizationsContextType {
  organizations: Organization[];
  addOrganization: (org: Omit<Organization, 'id' | 'registrationDate'>) => Promise<string>;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
  getOrganizationById: (id: string) => Organization | undefined;
  searchOrganizations: (query: string) => Organization[];
  getOrganizationsByType: (type: Organization['type']) => Organization[];
}

const OrganizationsContext = createContext<OrganizationsContextType | undefined>(undefined);

export function OrganizationsProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const fetchOrganizations = useCallback(async () => {
    try {
      // Organizations can be public or protected depending on requirement. 
      // Assuming public for listing (like on landing page) or protected for admin.
      // Let's send token if available.
      const token = localStorage.getItem('confideU_token');
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch('http://localhost:5000/api/organizations', { headers });
      const data = await res.json();
      if (data.success) {
        setOrganizations(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch organizations', err);
    }
  }, []);

  React.useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const addOrganization = useCallback(async (org: Omit<Organization, 'id' | 'registrationDate'>) => {
    try {
      const token = localStorage.getItem('confideU_token');
      const res = await fetch('http://localhost:5000/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(org)
      });
      const data = await res.json();

      if (data.success) {
        setOrganizations((prev) => [data.data, ...prev]);
        return data.data.id; // Ensure backend returns 'id' or map '_id' to 'id'
      }
      return '';
    } catch (err) {
      console.error('Failed to add organization', err);
      return '';
    }
  }, []);

  const updateOrganization = useCallback((id: string, updates: Partial<Organization>) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, ...updates } : org))
    );
  }, []);

  const deleteOrganization = useCallback((id: string) => {
    setOrganizations((prev) => prev.filter((org) => org.id !== id));
  }, []);

  const getOrganizationById = useCallback((id: string) => {
    return organizations.find((org) => org.id === id);
  }, [organizations]);

  const searchOrganizations = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(lowerQuery) ||
        org.email.toLowerCase().includes(lowerQuery) ||
        org.contactPerson.toLowerCase().includes(lowerQuery)
    );
  }, [organizations]);

  const getOrganizationsByType = useCallback((type: Organization['type']) => {
    return organizations.filter((org) => org.type === type);
  }, [organizations]);

  const value = {
    organizations,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganizationById,
    searchOrganizations,
    getOrganizationsByType,
  };

  return (
    <OrganizationsContext.Provider value={value}>
      {children}
    </OrganizationsContext.Provider>
  );
}

export function useOrganizations() {
  const context = useContext(OrganizationsContext);
  if (!context) {
    throw new Error('useOrganizations must be used within OrganizationsProvider');
  }
  return context;
}
