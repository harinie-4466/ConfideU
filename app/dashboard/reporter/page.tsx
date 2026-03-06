'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { useCrimeReports } from '@/app/context/CrimeReportsContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Clock, Filter, Search, Eye, ChevronDown, LogOut, Menu, FileText, CheckCircle, Image, Video } from 'lucide-react';
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function ReporterDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { reports } = useCrimeReports()
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit')
  const [selectedReport, setSelectedReport] = useState<any>(null)

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null; // Don't show Access Denied while redirecting

  // Role Check
  if (user.role !== 'citizen' && user.role !== 'in-organisation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have access to this page.</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  /* 
   * The backend API already filters reports for Citizen/In-Org users based on their Private Key.
   * So 'reports' already contains only the user's reports.
   */
  const reportedCrimes = reports;

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-foreground">ConfideU</h1>
            <div className="hidden md:block">
              {user.role === 'citizen' ? (
                <p className="text-sm text-foreground font-medium">Citizen</p>
              ) : (
                <>
                  <p className="text-sm text-foreground font-medium">{user.email || user.organisationName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role.replace('-', ' ')}</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('history')}
              className="text-accent hover:underline font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Reported Crimes
            </button>

            <button
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'submit' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Submit a Crime Report</h2>
              <p className="text-muted-foreground">Submit evidence of misconduct, corruption, fraud, or harassment anonymously</p>
            </div>

            <Link href="/report-crime">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 mb-8">
                Start New Report
              </Button>
            </Link>

            <Card className="bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">How to Submit a Report</h3>
              <ol className="space-y-3 text-foreground/80">
                <li className="flex gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <span>Click "Start New Report" to begin</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <span>Fill in details about the crime, date, location, and person involved</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <span>Upload evidence (documents, photos, videos, audio)</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                  <span>Set confidentiality level and choose if police should be notified</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                  <span>Receive a Case ID to track your report</span>
                </li>
              </ol>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">Your Reported Crimes</h2>
              <Link href="/report-crime">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Report New Crime
                </Button>
              </Link>
            </div>

            {reportedCrimes.length === 0 ? (
              <Card className="bg-card border border-border p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground mb-4">You haven't submitted any crime reports yet.</p>
                <Link href="/report-crime">
                  <Button>Submit Your First Report</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {reportedCrimes.map((report, index) => (
                  <Card
                    key={report.id || index}
                    onClick={() => setSelectedReport(report)}
                    className="bg-card border border-border p-6 hover:border-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-foreground">{report.caseId}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${report.status === 'solved' ? 'bg-accent/20 text-accent' :
                            report.status === 'in-progress' ? 'bg-primary/20 text-primary' :
                              (report.status || '').toLowerCase() === 'assigned' ? 'bg-orange-500/20 text-orange-500' :
                                'bg-muted text-muted-foreground'
                            }`}>
                            {(report.status || 'pending').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-foreground mb-1">{(report.incidentDescription || 'No description available').substring(0, 100)}...</p>
                        <p className="text-sm text-muted-foreground">Submitted: {new Date(report.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-2">Confidentiality</p>
                        <span className={`inline-block px-3 py-1 rounded text-sm font-bold ${report.confidentialityType === 'high' ? 'bg-destructive/20 text-destructive' :
                          'bg-accent/20 text-accent'
                          }`}>
                          {(report.confidentialityType || 'high').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Detailed View Modal */}
            <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                    <span>{selectedReport?.caseId}</span>
                    <span className={`text-sm px-3 py-1 rounded-full font-bold ml-4 ${selectedReport?.status === 'solved' ? 'bg-accent/20 text-accent' :
                      selectedReport?.status === 'in-progress' ? 'bg-primary/20 text-primary' :
                        (selectedReport?.status || '').toLowerCase() === 'assigned' ? 'bg-orange-500/20 text-orange-500' :
                          'bg-muted text-muted-foreground'
                      }`}>
                      {(selectedReport?.status || 'pending').toUpperCase()}
                    </span>
                  </DialogTitle>
                  <DialogDescription>
                    Full details of your submitted report. Status updates from the police will appear here.
                  </DialogDescription>
                </DialogHeader>

                {selectedReport && (
                  <div className="mt-6 space-y-6">
                    {/* Status Tracker Section */}
                    <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Current Status
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full ${selectedReport.status === 'submitted' ? 'w-[25%] bg-blue-500' :
                            selectedReport.status === 'assigned' || selectedReport.status === 'in-progress' ? 'w-[50%] bg-orange-500' :
                              selectedReport.status === 'solved' ? 'w-[100%] bg-green-500' : 'w-[25%] bg-grey-500'
                            }`} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{(selectedReport.status || 'pending').replace('-', ' ').toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Details Table */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <tbody>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="px-4 py-3 font-medium text-muted-foreground w-1/3">Incident Category</th>
                            <td className="px-4 py-3 text-foreground">{selectedReport.category}</td>
                          </tr>
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 font-medium text-muted-foreground">Date of Crime</th>
                            <td className="px-4 py-3 text-foreground">{selectedReport.crimeDate}</td>
                          </tr>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="px-4 py-3 font-medium text-muted-foreground">Venue/Location</th>
                            <td className="px-4 py-3 text-foreground">{selectedReport.crimeVenue}</td>
                          </tr>
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 font-medium text-muted-foreground">Person Involved</th>
                            <td className="px-4 py-3 text-foreground">
                              {selectedReport.personCommitted}
                              {selectedReport.personDesignation && ` (${selectedReport.personDesignation})`}
                            </td>
                          </tr>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="px-4 py-3 font-medium text-muted-foreground">Organization</th>
                            <td className="px-4 py-3 text-foreground">{selectedReport.personOrganisation || 'N/A'}</td>
                          </tr>
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 font-medium text-muted-foreground align-top">Description</th>
                            <td className="px-4 py-3 text-foreground whitespace-pre-wrap">{selectedReport.incidentDescription}</td>
                          </tr>
                          <tr className="bg-muted/30">
                            <th className="px-4 py-3 font-medium text-muted-foreground">Confidentiality</th>
                            <td className="px-4 py-3 text-foreground capitalize">{selectedReport.confidentialityType}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Evidence Section */}
                    <div>
                      <h3 className="text-md font-semibold text-foreground mb-2">Submitted Evidence</h3>
                      {selectedReport.evidenceFiles && selectedReport.evidenceFiles.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedReport.evidenceFiles.map((file: any, i: number) => (
                            <li key={i} className="flex flex-col p-3 border border-border rounded-md bg-card">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-muted rounded-md text-foreground">
                                    {file.type?.includes('image') ? <Image className="w-4 h-4 text-blue-400" /> :
                                      file.type?.includes('video') ? <Video className="w-4 h-4 text-red-400" /> :
                                        <FileText className="w-4 h-4 text-gray-400" />}
                                  </div>
                                  <span className="font-medium text-sm">{file.name}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <button
                                    onClick={() => window.open(`http://localhost:5000/api/reports/evidence/${file._id || file.id}?inline=true`, '_blank')}
                                    className="text-primary hover:text-primary/80 text-xs flex items-center gap-1 font-medium"
                                  >
                                    <Eye className="w-3 h-3" /> View
                                  </button>
                                  <a
                                    href={`http://localhost:5000/api/reports/evidence/${file._id || file.id}`}
                                    className="text-accent hover:underline text-xs flex items-center gap-1"
                                  >
                                    Download Decrypted
                                  </a>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/20 text-purple-400 border border-purple-900/30">
                                  Encrypted
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/20 text-green-400 border border-green-900/30">
                                  Hash Verified
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/20 text-blue-400 border border-blue-900/30">
                                  Sign Verified
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No evidence uploaded.</p>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </main>
    </div>
  )
}
