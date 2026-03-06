'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganizations } from '@/app/context/OrganizationsContext';
import { Button } from '@/components/ui/button';
import { Search, Filter, Building2, Users, TrendingUp, MapPin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function OrganizationsPage() {
  const router = useRouter();
  const { organizations, getOrganizationsByType, searchOrganizations } = useOrganizations();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'school' | 'corporate' | 'ngo' | 'police'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  // Filter organizations
  let filteredOrgs = organizations;

  if (typeFilter !== 'all') {
    filteredOrgs = filteredOrgs.filter(org => org.type === typeFilter);
  }

  if (statusFilter !== 'all') {
    filteredOrgs = filteredOrgs.filter(org => org.status === statusFilter);
  }

  if (searchQuery) {
    filteredOrgs = searchOrganizations(searchQuery);
  }

  const typeIcons: { [key: string]: React.ReactNode } = {
    school: '🏫',
    corporate: '🏢',
    ngo: '🤝',
    police: '👮'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-2xl font-bold text-foreground hover:text-accent">
            ConfideU
          </button>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-border hover:bg-card bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Partner Organizations</h1>
          <p className="text-muted-foreground">Search and connect with registered organizations on ConfideU platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Organizations</p>
            <p className="text-2xl font-bold text-accent">{organizations.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Schools</p>
            <p className="text-2xl font-bold text-foreground">{organizations.filter(o => o.type === 'school').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Corporates</p>
            <p className="text-2xl font-bold text-foreground">{organizations.filter(o => o.type === 'corporate').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Reports</p>
            <p className="text-2xl font-bold text-blue-400">{organizations.reduce((sum, o) => sum + o.reportsCount, 0)}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by organisation name, email or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent py-2 text-foreground outline-none placeholder-muted-foreground"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="flex-1 bg-transparent py-2 text-foreground outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="school">School</option>
                  <option value="corporate">Corporate</option>
                  <option value="ngo">NGO</option>
                  <option value="police">Police</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="flex-1 bg-transparent py-2 text-foreground outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        {filteredOrgs.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No Organizations Found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors group cursor-pointer"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{typeIcons[org.type]}</div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{org.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{org.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                    org.status === 'active' ? 'bg-green-500/20 text-green-300' :
                    org.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {org.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-input/30 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Reports</p>
                    <p className="text-lg font-bold text-accent">{org.reportsCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Solved</p>
                    <p className="text-lg font-bold text-green-400">{org.solvedCasesCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Success</p>
                    <p className="text-lg font-bold text-foreground">
                      {org.reportsCount > 0 ? ((org.solvedCasesCount / org.reportsCount) * 100).toFixed(0) : 0}%
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-border text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{org.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{org.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate text-xs">{org.address}</span>
                  </div>
                </div>

                {/* Investigators */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Users className="w-4 h-4" />
                  <span>{org.investigatorCount} investigator{org.investigatorCount !== 1 ? 's' : ''}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push(`/organizations/${org.id}`)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-sm h-9"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-border hover:bg-card text-sm h-9 bg-transparent"
                  >
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
