'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useReports } from '@/app/context/ReportsContext';
import { useNewsletter } from '@/app/context/NewsletterContext';
import { useState } from 'react';
import { Edit, Trash2, Eye, TrendingUp, Users, FileText, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react';

export default function AdminDashboard() {
  const { reports, updateReport } = useReports();
  const { subscribers } = useNewsletter();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const filteredReports = reports.filter((report) => {
    if (selectedStatus && report.status !== selectedStatus) return false;
    if (selectedPriority && report.priority !== selectedPriority) return false;
    return true;
  });

  const stats = {
    totalReports: reports.length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    inProgress: reports.filter((r) => r.status === 'in-progress').length,
    subscribers: subscribers.filter((s) => s.status === 'active').length,
    highPriority: reports.filter((r) => r.priority === 'high').length,
  };

  const resolutionRate = stats.totalReports > 0 ? Math.round((stats.resolved / stats.totalReports) * 100) : 0;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'submitted': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'under-review': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'in-progress': 'bg-primary/20 text-primary border-primary/30',
      'resolved': 'bg-accent/20 text-accent border-accent/30',
      'closed': 'bg-foreground/10 text-foreground/60 border-foreground/20',
    };
    return colors[status] || colors.submitted;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-destructive/20 text-destructive',
      'medium': 'bg-yellow-500/20 text-yellow-300',
      'low': 'bg-blue-500/20 text-blue-300',
    };
    return colors[priority] || colors.low;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-foreground/70 text-lg mt-2">
                Manage reports, track statistics, and oversee platform activity
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="p-6 border border-border bg-card/50 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-xs uppercase font-semibold tracking-wide">Total Reports</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stats.totalReports}</p>
                  </div>
                  <FileText className="w-8 h-8 text-foreground/20" />
                </div>
              </Card>

              <Card className="p-6 border border-border bg-card/50 hover:border-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-xs uppercase font-semibold tracking-wide">Resolved</p>
                    <p className="text-3xl font-bold text-accent mt-2">{stats.resolved}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-accent/30" />
                </div>
              </Card>

              <Card className="p-6 border border-border bg-card/50 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-xs uppercase font-semibold tracking-wide">In Progress</p>
                    <p className="text-3xl font-bold text-primary mt-2">{stats.inProgress}</p>
                  </div>
                  <Clock className="w-8 h-8 text-primary/30" />
                </div>
              </Card>

              <Card className="p-6 border border-border bg-card/50 hover:border-destructive/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-xs uppercase font-semibold tracking-wide">High Priority</p>
                    <p className="text-3xl font-bold text-destructive mt-2">{stats.highPriority}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-destructive/30" />
                </div>
              </Card>

              <Card className="p-6 border border-border bg-card/50 hover:border-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-xs uppercase font-semibold tracking-wide">Active Subscribers</p>
                    <p className="text-3xl font-bold text-accent mt-2">{stats.subscribers}</p>
                  </div>
                  <Users className="w-8 h-8 text-accent/30" />
                </div>
              </Card>
            </div>

            {/* Resolution Rate */}
            <Card className="p-6 border border-border bg-card/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm font-semibold uppercase">Overall Resolution Rate</p>
                  <p className="text-4xl font-bold text-primary mt-2">{resolutionRate}%</p>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{resolutionRate}%</p>
                    <p className="text-xs text-foreground/60">of cases</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Filters */}
            <Card className="p-6 border border-border bg-card/50">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-foreground/60" />
                <h3 className="font-semibold">Filters</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStatus(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === null
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground/70 hover:bg-muted/80'
                  }`}
                >
                  All
                </button>
                {['submitted', 'under-review', 'in-progress', 'resolved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      selectedStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground/70 hover:bg-muted/80'
                    }`}
                  >
                    {status.replace('-', ' ')}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPriority(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedPriority === null
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-foreground/70 hover:bg-muted/80'
                  }`}
                >
                  All Priorities
                </button>
                {['low', 'medium', 'high'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setSelectedPriority(priority)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      selectedPriority === priority
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-foreground/70 hover:bg-muted/80'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </Card>

            {/* Reports Table */}
            <Card className="p-6 border border-border bg-card/50 overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">Reports Management</h2>
              {filteredReports.length === 0 ? (
                <p className="text-foreground/70 text-center py-8">No reports match the selected filters.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">Priority</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">Date</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-primary">{report.trackingId}</td>
                        <td className="py-3 px-4 capitalize">{report.category}</td>
                        <td className="py-3 px-4 max-w-xs truncate text-foreground/80">{report.description}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded text-xs font-medium capitalize ${getPriorityColor(report.priority)}`}>
                            {report.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                            {report.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground/70">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button className="inline-flex p-1 text-foreground/50 hover:text-primary transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={report.status}
                            onChange={(e) => updateReport(report.id, { status: e.target.value as any })}
                            className="inline-flex px-2 py-1 text-xs rounded bg-muted border border-border text-foreground hover:bg-muted/80 transition-colors"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="under-review">Under Review</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
