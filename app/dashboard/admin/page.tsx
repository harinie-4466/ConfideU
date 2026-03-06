'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useCrimeReports } from '@/app/context/CrimeReportsContext';
import { useOrganizations } from '@/app/context/OrganizationsContext';
import { useNotifications } from '@/app/context/NotificationsContext';
import { Button } from '@/components/ui/button';
import { LogOut, TrendingUp, Users, CheckCircle, AlertCircle, Send, Search, Filter, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { reports } = useCrimeReports();
  const { organizations } = useOrganizations();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'analytics' | 'organizations' | 'notifications'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-6">To access the admin dashboard, you need special permissions.</p>
          <Button onClick={() => router.push('/')} className="bg-primary hover:bg-primary/90 w-full">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const filteredOrganizations = (organizations || []).filter(org =>
    (org.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (org.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalReports = reports.length;
  const solvedCases = reports.filter(r => r.status === 'solved').length;
  const inProgressCases = reports.filter(r => r.status === 'in-progress').length;
  const highConfidentialityReports = reports.filter(r => r.confidentialityType === 'high').length;
  const resolutionRate = totalReports > 0 ? ((solvedCases / totalReports) * 100).toFixed(1) : 0;

  const handleSendNotification = () => {
    if (!selectedOrg || !notificationMessage) {
      alert('Please select an organisation and enter a message');
      return;
    }

    const org = organizations.find(o => o.id === selectedOrg);
    if (!org) return;

    addNotification({
      recipientRole: 'as-organisation',
      recipientId: selectedOrg,
      title: 'Admin Notification',
      message: notificationMessage,
      type: 'info',
      read: false
    });

    alert(`Notification sent to ${org.name}`);
    setNotificationMessage('');
    setSelectedOrg('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ConfideU Admin</h1>
            <p className="text-sm text-muted-foreground">System Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/admin/organizations')}
              className="bg-accent hover:bg-accent/90 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Organizations
            </Button>
            <Button
              onClick={() => {
                logout();
                router.push('/');
              }}
              variant="outline"
              className="border-border hover:bg-card flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          {['analytics', 'organizations', 'notifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 font-medium border-b-2 transition-colors ${activeTab === tab
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm text-muted-foreground">Total Reports</h3>
                  <AlertCircle className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground">{totalReports}</p>
                <p className="text-xs text-muted-foreground mt-2">All submitted reports</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm text-muted-foreground">Resolved Cases</h3>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-400">{solvedCases}</p>
                <p className="text-xs text-muted-foreground mt-2">{resolutionRate}% resolution rate</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm text-muted-foreground">In Progress</h3>
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-blue-400">{inProgressCases}</p>
                <p className="text-xs text-muted-foreground mt-2">Active investigations</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm text-muted-foreground">High Priority</h3>
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-3xl font-bold text-destructive">{highConfidentialityReports}</p>
                <p className="text-xs text-muted-foreground mt-2">Confidential reports</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Report Status Distribution</h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Submitted', value: reports.filter(r => r.status === 'submitted').length, fill: '#ef4444' }, // red
                        { name: 'In Progress', value: reports.filter(r => r.status === 'in-progress').length, fill: '#3b82f6' }, // blue
                        { name: 'Solved', value: reports.filter(r => r.status === 'solved').length, fill: '#22c55e' }, // green
                        { name: 'Later', value: reports.filter(r => r.status === 'later').length, fill: '#eab308' }, // yellow
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {
                          [
                            { name: 'Submitted', fill: '#ef4444' },
                            { name: 'In Progress', fill: '#3b82f6' },
                            { name: 'Solved', fill: '#22c55e' },
                            { name: 'Later', fill: '#eab308' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Reports by Category</h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={(() => {
                        const categories = new Map<string, number>();
                        reports.forEach(r => {
                          categories.set(r.category, (categories.get(r.category) || 0) + 1);
                        });
                        return Array.from(categories.entries())
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([category, count]) => ({ name: category, value: count }));
                      })()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                      <XAxis type="number" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} width={100} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Recent Reports</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-2 px-4 text-muted-foreground">Case ID</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Category</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Status</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Confidentiality</th>
                      <th className="text-left py-2 px-4 text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reports.slice(0, 10).map((report) => (
                      <tr key={report.id} className="hover:bg-input/30 transition-colors">
                        <td className="py-2 px-4 text-foreground font-medium">{report.caseId}</td>
                        <td className="py-2 px-4 text-foreground">{report.category}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${report.status === 'solved' ? 'bg-green-500/20 text-green-300' :
                            report.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-yellow-500/20 text-yellow-300'
                            }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${report.confidentialityType === 'high' ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'
                            }`}>
                            {report.confidentialityType}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm text-muted-foreground mb-1">Total Organizations</h3>
                <p className="text-3xl font-bold text-foreground">{organizations.length}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm text-muted-foreground mb-1">Active Organizations</h3>
                <p className="text-3xl font-bold text-green-400">{organizations.filter(o => o.status === 'active').length}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm text-muted-foreground mb-1">Total Investigators</h3>
                <p className="text-3xl font-bold text-accent">{(organizations || []).reduce((sum, o) => sum + (o.investigatorCount || 0), 0)}</p>
              </div>
            </div>

            {/* Search Organizations */}
            <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-4 mb-6">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search organisations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent py-2 text-foreground outline-none placeholder-muted-foreground"
              />
            </div>

            {/* Organizations List */}
            <div className="space-y-4">
              {filteredOrganizations.map((org, index) => (
                <div key={org.id || (org as any)._id || index} className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{org.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{org.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-medium capitalize ${org.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      org.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                      {org.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Reports</p>
                      <p className="font-bold text-foreground">{org.reportsCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Solved Cases</p>
                      <p className="font-bold text-green-400">{org.solvedCasesCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Investigators</p>
                      <p className="font-bold text-accent">{org.investigatorCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Success Rate</p>
                      <p className="font-bold text-foreground">
                        {org.reportsCount > 0 ? ((org.solvedCasesCount / org.reportsCount) * 100).toFixed(0) : 0}%
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex flex-col md:flex-row justify-between items-end gap-4">
                    <div className="text-xs text-muted-foreground">
                      <p className="font-semibold mb-1">Contact Info</p>
                      <p>{org.email} • {org.phone}</p>
                      <p>{org.address}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => alert(`Viewing details for ${org.name}`)}
                      className="border-accent text-accent hover:bg-accent hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="w-full">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Send Notification to Organizations</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Select Organization</label>
                  <select
                    value={selectedOrg}
                    onChange={(e) => setSelectedOrg(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose an organization...</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter your message..."
                    rows={6}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button
                  onClick={handleSendNotification}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
