'use client';

import React from "react"

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNewsletter } from '@/app/context/NewsletterContext';
import { useState } from 'react';
import { Mail, Trash2, MailOpen, Plus, X } from 'lucide-react';

export default function NewsletterPage() {
  const { subscribers, addSubscriber, removeSubscriber, updateSubscriber } = useNewsletter();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['updates']);
  const [error, setError] = useState('');

  const topics = [
    { id: 'security', label: 'Security Updates' },
    { id: 'trends', label: 'Whistleblowing Trends' },
    { id: 'tips', label: 'Best Practices & Tips' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'webinars', label: 'Webinars & Events' },
    { id: 'updates', label: 'Product Updates' },
  ];

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    addSubscriber(email, selectedTopics);
    setEmail('');
    setSelectedTopics(['updates']);
    setShowForm(false);
  };

  const handleToggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((t) => t !== topicId) : [...prev, topicId]
    );
  };

  const activeCount = subscribers.filter((sub) => sub.status === 'active').length;
  const unsubscribedCount = subscribers.filter((sub) => sub.status === 'unsubscribed').length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold">Newsletter Subscribers</h1>
                <p className="text-foreground/70 text-lg mt-2">
                  Manage your newsletter subscribers and mailing lists
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Subscriber
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border border-border bg-card/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm font-semibold uppercase">Total Subscribers</p>
                    <p className="text-3xl font-bold text-primary mt-2">{subscribers.length}</p>
                  </div>
                  <Mail className="w-8 h-8 text-primary/50" />
                </div>
              </Card>
              <Card className="p-6 border border-border bg-card/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm font-semibold uppercase">Active</p>
                    <p className="text-3xl font-bold text-accent mt-2">{activeCount}</p>
                  </div>
                  <MailOpen className="w-8 h-8 text-accent/50" />
                </div>
              </Card>
              <Card className="p-6 border border-border bg-card/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm font-semibold uppercase">Unsubscribed</p>
                    <p className="text-3xl font-bold text-foreground/50 mt-2">{unsubscribedCount}</p>
                  </div>
                  <X className="w-8 h-8 text-foreground/30" />
                </div>
              </Card>
            </div>

            {/* Form */}
            {showForm && (
              <Card className="p-8 border border-border bg-card/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Add New Subscriber</h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEmail('');
                      setError('');
                      setSelectedTopics(['updates']);
                    }}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="subscriber@example.com"
                    />
                    {error && <p className="text-destructive text-sm mt-1">{error}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">Topics of Interest</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {topics.map((topic) => (
                        <label key={topic.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic.id)}
                            onChange={() => handleToggleTopic(topic.id)}
                            className="w-4 h-4 rounded border-border cursor-pointer"
                          />
                          <span className="text-foreground">{topic.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Add Subscriber
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        setShowForm(false);
                        setEmail('');
                        setError('');
                        setSelectedTopics(['updates']);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Subscribers Table */}
            <Card className="p-6 border border-border bg-card/50 overflow-x-auto">
              <h2 className="text-xl font-bold mb-4">All Subscribers</h2>
              {subscribers.length === 0 ? (
                <p className="text-foreground/70 text-center py-8">No subscribers yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">Topics</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground/60">Subscribed</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                        <td className="py-3 px-4">{subscriber.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              subscriber.status === 'active'
                                ? 'bg-accent/20 text-accent border border-accent/30'
                                : 'bg-foreground/10 text-foreground/60 border border-foreground/20'
                            }`}
                          >
                            {subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {subscriber.topics.map((topic) => (
                              <span key={topic} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground/70">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {subscriber.status === 'active' ? (
                            <button
                              onClick={() =>
                                updateSubscriber(subscriber.id, { status: 'unsubscribed' })
                              }
                              className="px-3 py-1 text-xs rounded bg-foreground/10 text-foreground/60 hover:bg-destructive/20 hover:text-destructive transition-colors"
                            >
                              Unsubscribe
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                updateSubscriber(subscriber.id, { status: 'active' })
                              }
                              className="px-3 py-1 text-xs rounded bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                            >
                              Resubscribe
                            </button>
                          )}
                          <button
                            onClick={() => removeSubscriber(subscriber.id)}
                            className="p-1 inline-flex text-foreground/50 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
