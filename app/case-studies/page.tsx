'use client';

import React from "react"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCaseStudies } from '@/app/context/CaseStudiesContext';
import { useState } from 'react';
import { Plus, Edit, Trash2, Star, X } from 'lucide-react';

export default function CaseStudiesPage() {
  const { caseStudies, addCaseStudy, updateCaseStudy, deleteCaseStudy } = useCaseStudies();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    industry: '',
    challenge: '',
    solution: '',
    outcome: '',
    featured: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Non-Profit',
    'Retail',
    'Other',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.challenge.trim()) newErrors.challenge = 'Challenge description is required';
    if (!formData.solution.trim()) newErrors.solution = 'Solution description is required';
    if (!formData.outcome.trim()) newErrors.outcome = 'Outcome description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      updateCaseStudy(editingId, formData);
      setEditingId(null);
    } else {
      addCaseStudy({ ...formData, featured: formData.featured, id: '', createdAt: '' });
    }

    setFormData({
      title: '',
      company: '',
      industry: '',
      challenge: '',
      solution: '',
      outcome: '',
      featured: false,
    });
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const study = caseStudies.find((cs) => cs.id === id);
    if (study) {
      setFormData({
        title: study.title,
        company: study.company,
        industry: study.industry,
        challenge: study.challenge,
        solution: study.solution,
        outcome: study.outcome,
        featured: study.featured,
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      company: '',
      industry: '',
      challenge: '',
      solution: '',
      outcome: '',
      featured: false,
    });
    setErrors({});
  };

  const featuredStudies = caseStudies.filter((cs) => cs.featured);
  const otherStudies = caseStudies.filter((cs) => !cs.featured);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold">Case Studies</h1>
                <p className="text-foreground/70 text-lg mt-2">
                  Real-world success stories from organizations using ConfideU
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Case Study
              </Button>
            </div>

            {/* Form */}
            {showForm && (
              <Card className="p-8 border border-border bg-card/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {editingId ? 'Edit Case Study' : 'Create New Case Study'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Case study title"
                      />
                      {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Company name"
                      />
                      {errors.company && <p className="text-destructive text-sm mt-1">{errors.company}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select industry...</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Challenge</label>
                    <textarea
                      value={formData.challenge}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      rows={3}
                      placeholder="Describe the challenge the organization faced"
                    />
                    {errors.challenge && <p className="text-destructive text-sm mt-1">{errors.challenge}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Solution</label>
                    <textarea
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      rows={3}
                      placeholder="Describe how ConfideU solved the problem"
                    />
                    {errors.solution && <p className="text-destructive text-sm mt-1">{errors.solution}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Outcome</label>
                    <textarea
                      value={formData.outcome}
                      onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      rows={3}
                      placeholder="Describe the results and impact"
                    />
                    {errors.outcome && <p className="text-destructive text-sm mt-1">{errors.outcome}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-border cursor-pointer"
                    />
                    <label htmlFor="featured" className="font-semibold cursor-pointer">
                      Featured case study
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingId ? 'Update Case Study' : 'Create Case Study'}
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Featured Case Studies */}
            {featuredStudies.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  <h2 className="text-2xl font-bold">Featured Case Studies</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredStudies.map((study) => (
                    <Card key={study.id} className="p-6 border border-accent/30 bg-card/50 space-y-4 hover:border-accent transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{study.title}</h3>
                          <p className="text-foreground/70 text-sm">{study.company}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(study.id)}
                            className="p-2 text-foreground/50 hover:text-primary transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCaseStudy(study.id)}
                            className="p-2 text-foreground/50 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-foreground/60 text-xs font-semibold uppercase">Industry</p>
                          <p className="text-foreground text-sm">{study.industry}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs font-semibold uppercase">Challenge</p>
                          <p className="text-foreground/80 text-sm">{study.challenge}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs font-semibold uppercase">Solution</p>
                          <p className="text-foreground/80 text-sm">{study.solution}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs font-semibold uppercase">Outcome</p>
                          <p className="text-accent font-semibold text-sm">{study.outcome}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Other Case Studies */}
            {otherStudies.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">More Case Studies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherStudies.map((study) => (
                    <Card key={study.id} className="p-6 border border-border bg-card/50 space-y-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{study.title}</h3>
                          <p className="text-foreground/70 text-sm">{study.company}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(study.id)}
                            className="p-2 text-foreground/50 hover:text-primary transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCaseStudy(study.id)}
                            className="p-2 text-foreground/50 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-foreground/60 text-xs font-semibold uppercase">Industry</p>
                          <p className="text-foreground text-sm">{study.industry}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60 text-xs font-semibold uppercase">Outcome</p>
                          <p className="text-accent font-semibold text-sm">{study.outcome}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {caseStudies.length === 0 && !showForm && (
              <Card className="p-12 border border-border bg-card/50 text-center space-y-4">
                <p className="text-foreground/70 text-lg">No case studies yet.</p>
                <Button onClick={() => setShowForm(true)}>Create the first one</Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
