'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useCrimeReports } from '@/app/context/CrimeReportsContext';
import { useNotifications } from '@/app/context/NotificationsContext';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, CheckCircle, XCircle, Clock, Eye, Bell, LogOut, FileText, Image, Video } from 'lucide-react';

export default function OrganisationDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { reports, updateReportStatus } = useCrimeReports();
  const { notifications, getNotificationsByRecipient, markAsRead, deleteNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'solved' | 'reported' | 'later'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'low'>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const filteredReports = reports.filter((report) => {
    // Filter by status - "reported" means submitted status
    // Filter by status - "reported" means submitted or pending status
    if (activeTab === 'reported') {
      const s = (report.status || '').toLowerCase();
      if (s !== 'submitted' && s !== 'pending') return false;
    } else if (activeTab !== 'all') {
      if ((report.status || '').toLowerCase() !== activeTab.toLowerCase()) return false;
    }
    if (filterPriority !== 'all' && report.confidentialityType !== filterPriority) {
      return false;
    }
    if (searchQuery && !report.caseId.includes(searchQuery) && !report.incidentDescription.includes(searchQuery)) {
      return false;
    }
    // Filter by visibility - only show reports visible to this organization
    if (user?.organisationType && report.visibleTo) {
      const orgKey = user.organisationType === 'school' || user.organisationType === 'corporate' || user.organisationType === 'ngo'
        ? `as-organisation-${user.organisationName}`
        : 'as-organisation-police'
      if (!report.visibleTo.includes(orgKey)) {
        return false;
      }
    }
    return true;
  });

  const handleStatusChange = (reportId: string, newStatus: string) => {
    // Update status with description
    updateReportStatus(reportId, newStatus as any, `Status updated by ${user?.organisationName || 'organization'}`);
    // This change will automatically reflect in the reporter's dashboard through shared context
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-destructive/20 text-destructive';
      case 'in-progress':
        return 'bg-blue-400/20 text-blue-400';
      case 'later':
        return 'bg-warning/20 text-warning';
      case 'solved':
        return 'bg-green-400/20 text-green-400';
      default:
        return 'bg-input text-foreground';
    }
  };

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  if (user.role !== 'as-organisation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You must be logged in as an organisation to access this page</p>
          <Button onClick={() => router.push('/login')} className="bg-primary hover:bg-primary/90">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-b border-border py-4 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organisation Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user.organisationName}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-input rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-accent" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          <Button onClick={logout} variant="outline" className="border-border hover:bg-card flex items-center gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Full-Width Tabs */}
      <div className="bg-card border-b border-border">
        <div className="flex items-center justify-between w-full px-6 py-4">
          {['all', 'reported', 'in-progress', 'later', 'solved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`font-semibold text-sm transition-colors pb-2 border-b-2 ${activeTab === tab
                ? 'text-accent border-accent'
                : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
            >
              {tab === 'reported'
                ? `Reported Crimes (${reports.filter(r => {
                  const s = (r.status || '').toLowerCase();
                  return s === 'submitted' || s === 'pending';
                }).length})`
                : tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-secondary border-2 border-accent rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b-2 border-accent bg-input/30">
              <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="flex justify-between items-center p-3 bg-input rounded-lg">
                      <span className="text-foreground text-sm">{notification.message}</span>
                      <div className="flex gap-2">
                        <button onClick={() => markAsRead(notification.id)} className="text-accent hover:underline text-sm">
                          Mark as Read
                        </button>
                        <button onClick={() => deleteNotification(notification.id)} className="text-destructive hover:underline text-sm">
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No notifications found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
            <p className="text-3xl font-bold text-accent">{reports.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-400">{reports.filter(r => r.status === 'in-progress').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Solved</p>
            <p className="text-3xl font-bold text-green-400">{reports.filter(r => r.status === 'solved').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">High Priority</p>
            <p className="text-3xl font-bold text-destructive">{reports.filter(r => r.confidentialityType === 'high').length}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-input border border-border rounded-lg px-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Case ID or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent py-2 text-foreground outline-none placeholder-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="bg-transparent py-2 text-foreground outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Confidentiality</option>
                <option value="low">Low Confidentiality</option>
              </select>
            </div>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Case ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Confidentiality</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-input/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{report.caseId}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{report.category}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground truncate max-w-xs">
                      {report.incidentDescription ? report.incidentDescription.substring(0, 50) : ''}...
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(report.status)} bg-transparent border-0 cursor-pointer`}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="later">Later</option>
                        <option value="solved">Solved</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-3 py-1 rounded ${report.confidentialityType === 'high'
                        ? 'bg-destructive/20 text-destructive'
                        : 'bg-accent/20 text-accent'
                        }`}>
                        {report.confidentialityType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            // Fetch specific report to trigger backend logs for Case Access
                            try {
                              const token = localStorage.getItem('confideU_token');
                              const res = await fetch(`http://localhost:5000/api/reports/${report.id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              const data = await res.json();
                              if (data.success) {
                                setSelectedReport(data.data); // Triggers modal open with FRESH data containing verification status
                              }
                            } catch (e) {
                              console.error("Failed to fetch report details for logging", e);
                              setSelectedReport(report); // Fallback to local
                            }
                          }}
                          className="text-accent hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        {report.evidenceFiles && report.evidenceFiles.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `http://localhost:5000/api/reports/evidence/${report.evidenceFiles[0].id || report.evidenceFiles[0]._id}`;
                            }}
                            className="text-accent hover:underline flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reports found</p>
            </div>
          )}
        </div>

        {/* Selected Report Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-secondary border-2 border-accent rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b-2 border-accent bg-input/30">
                <h2 className="text-2xl font-bold text-foreground">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              {selectedReport && (
                <div className="p-6 space-y-4">
                  {(() => {
                    const report = selectedReport;
                    return (
                      <>
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Case ID</h3>
                          <p className="text-foreground">{report.caseId}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Category</h3>
                          <p className="text-foreground">{report.category}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Incident Description</h3>
                          <p className="text-foreground">{report.incidentDescription}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Crime Date & Location</h3>
                          <p className="text-foreground">{report.crimeDate} at {report.crimeVenue}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Person Involved</h3>
                          <p className="text-foreground">{report.personCommitted} ({report.personDesignation})</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Evidence Files</h3>
                          {(report.evidenceFiles && report.evidenceFiles.length > 0) ? (
                            <div className="space-y-3">
                              {(report.evidenceFiles || []).map((file) => (
                                <div
                                  key={file.id}
                                  className="flex flex-col p-4 bg-input rounded-lg border border-border"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-muted rounded-md text-foreground">
                                        {file.type?.includes('image') ? <Image className="w-5 h-5 text-blue-400" /> :
                                          file.type?.includes('video') ? <Video className="w-5 h-5 text-red-400" /> :
                                            <FileText className="w-5 h-5 text-gray-400" />}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-foreground text-sm">{file.name}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => window.open(`http://localhost:5000/api/reports/evidence/${file.id || file._id}?inline=true`, '_blank')}
                                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
                                        title="View Evidence"
                                      >
                                        <Eye className="w-4 h-4" /> View
                                      </button>
                                      <button
                                        onClick={() => {
                                          window.location.href = `http://localhost:5000/api/reports/evidence/${file.id || file._id}`;
                                        }}
                                        className="text-accent hover:underline flex items-center gap-1 text-sm font-medium"
                                        title="Download Evidence"
                                      >
                                        <Download className="w-4 h-4" /> Download
                                      </button>
                                    </div>
                                  </div>

                                  {/* Requirement 6: Verification Badges Panel */}
                                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border/50">
                                    {/* Encrypted Badge */}
                                    <span title="File is encrypted with AES-256 and Key is RSA encrypted" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-900/50">
                                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5 animate-pulse"></div>
                                      Encrypted
                                    </span>

                                    {/* Hash Verified Badge */}
                                    {file.verificationStatus?.hashVerified ? (
                                      <span title="Integrity Check Passed (SHA-256)" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                        Hash Verified
                                      </span>
                                    ) : (
                                      <span title="Integrity Check FAILED" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></div>
                                        Hash Integrity Failed
                                      </span>
                                    )}

                                    {/* Signature Verified Badge */}
                                    {file.verificationStatus?.signatureVerified ? (
                                      <span title="Digital Signature Validated" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-900/50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></div>
                                        Sign Verified
                                      </span>
                                    ) : (
                                      <span title="Digital Signature Invalid" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></div>
                                        Sign Invalid
                                      </span>
                                    )}
                                  </div>
                                </div >
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No evidence files attached</p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )
              }
            </div >
          </div >
        )}
      </main >
    </div >
  );
}
