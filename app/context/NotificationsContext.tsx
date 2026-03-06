'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Notification {
  id: string;
  recipientRole: 'as-organisation' | 'admin';
  recipientId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  relatedCaseId?: string;
  createdAt: string;
  read: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: (recipientId: string) => number;
  getNotificationsByRecipient: (recipientId: string) => Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('confideU_token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
    // Optional: Poll every 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('confideU_token');
      const res = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(notification)
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => [data.data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add notification', err);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('confideU_token');
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const getUnreadCount = useCallback((recipientId: string) => {
    return notifications.filter((notif) => notif.recipientId === recipientId && !notif.read).length;
  }, [notifications]);

  const getNotificationsByRecipient = useCallback((recipientId: string) => {
    return notifications.filter((notif) => notif.recipientId === recipientId);
  }, [notifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        deleteNotification,
        getUnreadCount,
        getNotificationsByRecipient
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
}
