'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  topics: string[];
  subscribedAt: string;
}

interface NewsletterContextType {
  subscribers: Subscriber[];
  addSubscriber: (email: string, topics?: string[]) => void;
  removeSubscriber: (id: string) => void;
  updateSubscriber: (id: string, updates: Partial<Subscriber>) => void;
  getSubscriber: (id: string) => Subscriber | undefined;
}

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export function NewsletterProvider({ children }: { children: React.ReactNode }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: '1',
      email: 'john@example.com',
      status: 'active',
      topics: ['security', 'trends', 'updates'],
      subscribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      email: 'jane@example.com',
      status: 'active',
      topics: ['updates', 'tips'],
      subscribedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      email: 'bob@example.com',
      status: 'unsubscribed',
      topics: ['all'],
      subscribedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const addSubscriber = useCallback((email: string, topics: string[] = ['updates']) => {
    const existingSubscriber = subscribers.find((sub) => sub.email === email);
    if (existingSubscriber) {
      updateSubscriber(existingSubscriber.id, { status: 'active' });
      return;
    }

    const id = Date.now().toString();
    const newSubscriber: Subscriber = {
      id,
      email,
      status: 'active',
      topics,
      subscribedAt: new Date().toISOString(),
    };
    setSubscribers((prev) => [newSubscriber, ...prev]);
  }, [subscribers]);

  const removeSubscriber = useCallback((id: string) => {
    setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
  }, []);

  const updateSubscriber = useCallback((id: string, updates: Partial<Subscriber>) => {
    setSubscribers((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  }, []);

  const getSubscriber = useCallback((id: string) => {
    return subscribers.find((sub) => sub.id === id);
  }, [subscribers]);

  return (
    <NewsletterContext.Provider value={{ subscribers, addSubscriber, removeSubscriber, updateSubscriber, getSubscriber }}>
      {children}
    </NewsletterContext.Provider>
  );
}

export function useNewsletter() {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error('useNewsletter must be used within NewsletterProvider');
  }
  return context;
}
