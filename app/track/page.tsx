'use client';

import React from "react"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useReports, Report } from '@/app/context/ReportsContext';
import { useState } from 'react';
import { Search, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function TrackPage() {
  const { reports, deleteReport } = useReports();
  const [searchId, setSearchId] = useState('');
  const [foundReports, setFoundReports] = useState<Report[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = reports.filter((report) =>
      report.trackingId.toLowerCase().includes(searchId.toLowerCase())
    );
    setFoundReports(results);
    setSearched(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-primary" />;
      default:
        return <AlertCircle className="w-5 h-5 text-foreground/50" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      'submitted': { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'Submitted' },
      'under-review': { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Under Review' },
      'in-progress': { color: 'bg-primary/20 text-primary border-primary/30', label: 'In Progress' },
      'resolved': { color: 'bg-accent/20 text-accent border-accent/30', label: 'Resolved' },
      'closed': { color: 'bg-foreground/10 text-foreground/60 border-foreground/20', label: 'Closed' },
    };
    const badge = badges[status] || badges.submitted;
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Track Your Report</h1>
              <p className="text-foreground/70 text-lg">
                Check the status of your anonymous report using your tracking ID.
              </p>
            </div>

            {/* Search Form */}
            <Card className="p-8 border border-border bg-card/50">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter your tracking ID (e.g., RPT-001)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <Button type="submit" size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </form>
            </Card>

            {/* Results */}
            {searched && foundReports.length === 0 && (
              <Card className="p-8 border border-border bg-card/50 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto" />
                <p className="text-foreground/70">
                  No reports found with ID "{searchId}". Please check your tracking ID and try again.
                </p>
              </Card>
            )}

            {/* Report Cards */}
            {foundReports.map((report) => (
              <Card key={report.id} className="p-6 border border-border bg-card/50 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(report.status)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-lg text-primary">{report.trackingId}</span>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-foreground/70 text-sm">
                        Submitted on {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="p-2 text-foreground/50 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div>
                    <p className="text-foreground/60 text-xs uppercase tracking-wide font-semibold">Category</p>
                    <p className="text-foreground capitalize font-medium mt-1">{report.category}</p>
                  </div>

                  <div>
                    <p className="text-foreground/60 text-xs uppercase tracking-wide font-semibold">Description</p>
                    <p className="text-foreground/80 mt-1">{report.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-foreground/60 text-xs uppercase tracking-wide font-semibold">Priority</p>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${
                            report.priority === 'high'
                              ? 'bg-destructive/20 text-destructive'
                              : report.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {report.priority}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-xs uppercase tracking-wide font-semibold">Status</p>
                      <p className="text-foreground capitalize font-medium mt-1">{report.status.replace('-', ' ')}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-foreground/60 text-xs uppercase tracking-wide font-semibold">Evidence Summary</p>
                    <p className="text-foreground/80 mt-1 text-sm">{report.evidence}</p>
                  </div>
                </div>

                {report.status === 'resolved' && (
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                    <p className="text-accent font-semibold text-sm">✓ This case has been resolved.</p>
                  </div>
                )}
              </Card>
            ))}

            {/* All Reports View */}
            {!searched && reports.length > 0 && (
              <Card className="p-6 border border-border bg-card/50">
                <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
                <div className="space-y-3">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(report.status)}
                        <div className="flex-1">
                          <p className="font-mono font-semibold text-primary">{report.trackingId}</p>
                          <p className="text-foreground/60 text-xs capitalize">{report.category} • {report.status}</p>
                        </div>
                      </div>
                      <p className="text-foreground/50 text-xs">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
