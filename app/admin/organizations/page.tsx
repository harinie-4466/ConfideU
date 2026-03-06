'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { useOrganizations } from '@/app/context/OrganizationsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Trash2, Edit2, MapPin, Mail, Phone, Users, TrendingUp, ArrowLeft } from 'lucide-react'

export default function AdminOrganizationsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { organizations, addOrganization, deleteOrganization, updateOrganization } = useOrganizations()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'school' | 'corporate' | 'ngo' | 'police'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'corporate' as 'school' | 'corporate' | 'ngo' | 'police',
    email: '',
    phone: '',
    location: '',
    status: 'active' as 'active' | 'inactive' | 'pending'
  })

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You must be logged in as admin to access this page</p>
          <Button onClick={() => router.push('/login')} className="bg-primary hover:bg-primary/90">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  let filteredOrgs = organizations

  if (typeFilter !== 'all') {
    filteredOrgs = filteredOrgs.filter(org => org.type === typeFilter)
  }

  if (statusFilter !== 'all') {
    filteredOrgs = filteredOrgs.filter(org => org.status === statusFilter)
  }

  if (searchQuery) {
    filteredOrgs = filteredOrgs.filter(org =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const handleAddOrUpdate = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in required fields')
      return
    }

    if (editingId) {
      updateOrganization(editingId, formData)
      setEditingId(null)
    } else {
      addOrganization(formData)
    }

    setFormData({
      name: '',
      type: 'corporate',
      email: '',
      phone: '',
      location: '',
      status: 'active'
    })
    setShowForm(false)
  }

  const handleEdit = (org: any) => {
    setFormData(org)
    setEditingId(org.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      deleteOrganization(id)
    }
  }

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300'
      case 'inactive':
        return 'bg-gray-500/20 text-gray-300'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/admin')}
              className="text-muted-foreground hover:text-accent"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Organizations Management</h1>
          </div>
          <Button
            onClick={() => {
              logout()
              router.push('/')
            }}
            variant="outline"
            className="border-border hover:bg-card"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Organizations</p>
            <p className="text-3xl font-bold text-accent">{organizations.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-3xl font-bold text-green-400">{organizations.filter(o => o.status === 'active').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-300">{organizations.filter(o => o.status === 'pending').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Inactive</p>
            <p className="text-3xl font-bold text-gray-400">{organizations.filter(o => o.status === 'inactive').length}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <Button
              onClick={() => {
                setShowForm(true)
                setEditingId(null)
                setFormData({
                  name: '',
                  type: 'corporate',
                  email: '',
                  phone: '',
                  location: '',
                  status: 'active'
                })
              }}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Organization
            </Button>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-4 flex-1 md:flex-none">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent py-2 text-foreground outline-none placeholder-muted-foreground"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-input border border-border rounded-lg px-4 py-2 text-foreground outline-none"
              >
                <option value="all">All Types</option>
                <option value="school">School</option>
                <option value="corporate">Corporate</option>
                <option value="ngo">NGO</option>
                <option value="police">Police</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-input border border-border rounded-lg px-4 py-2 text-foreground outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-input/30 border border-border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{editingId ? 'Edit Organization' : 'Add New Organization'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Organization Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="bg-input border border-border rounded-lg px-4 py-2 text-foreground outline-none"
                >
                  <option value="school">School</option>
                  <option value="corporate">Corporate</option>
                  <option value="ngo">NGO</option>
                  <option value="police">Police</option>
                </select>
                <Input
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full"
                />
                <Input
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full"
                />
                <Input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full"
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="bg-input border border-border rounded-lg px-4 py-2 text-foreground outline-none"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleAddOrUpdate}
                  className="bg-primary hover:bg-primary/90"
                >
                  {editingId ? 'Update' : 'Add'}
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  variant="outline"
                  className="border-border hover:bg-card"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Organizations Vertical Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-all hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{org.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize mt-1">{getTypeLabel(org.type)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                    {org.status}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm text-foreground">{org.email}</p>
                    </div>
                  </div>

                  {org.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm text-foreground">{org.phone}</p>
                      </div>
                    </div>
                  )}

                  {org.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm text-foreground">{org.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(org)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-lg transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredOrgs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No organizations found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
