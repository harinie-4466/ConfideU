'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCrimeReports } from '@/app/context/CrimeReportsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, X, CheckCircle, ArrowLeft } from 'lucide-react'

export default function AnonymousReportForm() {
  const router = useRouter()
  const { addReport } = useCrimeReports()
  const [submitted, setSubmitted] = useState(false)
  const [caseId, setCaseId] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string
    type: string
    size: number
    id: string
    fileContent: File
  }>>([])

  const [formData, setFormData] = useState({
    crimeDate: '',
    crimeVenue: '',
    personCommitted: '',
    personDesignation: '',
    personOrganisation: '',
    incidentDescription: '',
    category: 'Fraud',
    informPolice: false,
    confidentialityType: 'high' as 'high' | 'low',
    otherDetails: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const fileType = file.type.startsWith('image/') ? 'image' :
          file.type.startsWith('video/') ? 'video' :
            file.type.startsWith('audio/') ? 'audio' : 'doc'

        setUploadedFiles(prev => [...prev, {
          name: file.name,
          type: fileType,
          size: file.size,
          id: `file_${Date.now()}_${Math.random()}`,
          fileContent: file
        }])
      })
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.crimeDate || !formData.crimeVenue || !formData.personCommitted || !formData.incidentDescription) {
      alert('Please fill in all required fields')
      return
    }

    // Upload files first
    const uploadedEvidence = await Promise.all(uploadedFiles.map(async (fileObj) => {
      try {
        const formData = new FormData()
        formData.append('file', fileObj.fileContent)

        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData
        })
        const uploadData = await uploadRes.json()

        if (uploadData.success && uploadData.encryption) {
          return {
            id: fileObj.id,
            name: fileObj.name,
            type: fileObj.type as 'doc' | 'video' | 'audio' | 'image',
            size: fileObj.size,
            uploadedAt: new Date().toISOString(),
            url: `http://localhost:5000${uploadData.filePath}`,
            // Pass Encryption Metadata to Backend
            encryptedAesKey: uploadData.encryption.encryptedAesKey,
            iv: uploadData.encryption.iv,
            fileHash: uploadData.encryption.fileHash,
            signature: uploadData.encryption.signature
          }
        }
      } catch (err) {
        console.error('File upload failed', err)
      }
      return null
    }))

    const validEvidence = uploadedEvidence.filter((e): e is NonNullable<typeof e> => e !== null)

    const generatedCaseId = await addReport({
      reportedBy: 'anonymous',
      reportedByRole: 'citizen',
      crimeDate: formData.crimeDate,
      crimeVenue: formData.crimeVenue,
      personCommitted: formData.personCommitted,
      personDesignation: formData.personDesignation,
      personOrganisation: formData.personOrganisation,
      incidentDescription: formData.incidentDescription,
      evidenceFiles: validEvidence,
      category: formData.category,
      informPolice: formData.informPolice,
      confidentialityType: formData.confidentialityType,
      otherDetails: formData.otherDetails,
      status: 'submitted',
      assignedTo: undefined
    })

    setCaseId(generatedCaseId)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Report Submitted Successfully</h1>
          <p className="text-muted-foreground mb-6">Your anonymous crime report has been received and will be reviewed by our team.</p>

          <div className="bg-input rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Your Case ID</p>
            <p className="text-2xl font-bold text-accent font-mono">{caseId}</p>
            <p className="text-xs text-muted-foreground mt-2">Save this ID to track your report</p>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            You can use this Case ID to check the status of your report. Complete anonymity and confidentiality are guaranteed.
          </p>

          <Button
            onClick={() => router.push('/')}
            className="w-full bg-primary hover:bg-primary/90 h-11 mb-3"
          >
            Back to Home
          </Button>

          <Button
            onClick={() => {
              setFormData({
                crimeDate: '',
                crimeVenue: '',
                personCommitted: '',
                personDesignation: '',
                personOrganisation: '',
                incidentDescription: '',
                category: 'Fraud',
                informPolice: false,
                confidentialityType: 'high',
                otherDetails: ''
              })
              setUploadedFiles([])
              setSubmitted(false)
            }}
            variant="outline"
            className="w-full border-border hover:bg-card h-11"
          >
            Submit Another Report
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-accent"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Submit Anonymous Report</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground">
            <strong>Complete Anonymity Guaranteed:</strong> Your identity will never be revealed. All information is encrypted and protected.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Crime Details Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Crime Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date of Crime *</label>
                <Input
                  type="date"
                  name="crimeDate"
                  value={formData.crimeDate}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Venue/Location *</label>
                <Input
                  type="text"
                  name="crimeVenue"
                  value={formData.crimeVenue}
                  onChange={handleInputChange}
                  placeholder="e.g., Office Building A, 5th Floor"
                  className="w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Person Details Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Person Involved</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Person Name *</label>
                <Input
                  type="text"
                  name="personCommitted"
                  value={formData.personCommitted}
                  onChange={handleInputChange}
                  placeholder="Full name or description"
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Designation</label>
                <Input
                  type="text"
                  name="personDesignation"
                  value={formData.personDesignation}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Manager, Principal"
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">Organisation/Company</label>
              <Input
                type="text"
                name="personOrganisation"
                value={formData.personOrganisation}
                onChange={handleInputChange}
                placeholder="Organisation name"
                className="w-full"
              />
            </div>
          </div>

          {/* Incident Description */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Incident Description</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
              <textarea
                name="incidentDescription"
                value={formData.incidentDescription}
                onChange={handleInputChange}
                placeholder="Provide detailed description of the incident..."
                rows={6}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">Other Details</label>
              <textarea
                name="otherDetails"
                value={formData.otherDetails}
                onChange={handleInputChange}
                placeholder="Any additional information..."
                rows={3}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Evidence Upload</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4 hover:border-accent transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium mb-2">Drop your evidence files here</p>
              <p className="text-sm text-muted-foreground mb-4">or</p>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3,.wav"
                />
                <span className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium cursor-pointer inline-block">
                  Select Files
                </span>
              </label>
              <p className="text-xs text-muted-foreground mt-4">Supported: PDF, DOC, JPG, PNG, MP4, MP3</p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground mb-2">Uploaded Files ({uploadedFiles.length})</p>
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between bg-input border border-border rounded-lg p-3">
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.type} • {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category and Confidentiality */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Crime Classification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option>Fraud</option>
                  <option>Embezzlement</option>
                  <option>Harassment</option>
                  <option>Discrimination</option>
                  <option>Corruption</option>
                  <option>Abuse of Power</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confidentiality Level *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="confidentialityType"
                      value="high"
                      checked={formData.confidentialityType === 'high'}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">High</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="confidentialityType"
                      value="low"
                      checked={formData.confidentialityType === 'low'}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">Low</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="informPolice"
                  checked={formData.informPolice}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Inform Police Immediately</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-11"
            >
              Submit Anonymous Report
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 border-border hover:bg-card h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
