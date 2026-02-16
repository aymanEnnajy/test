import { useState, useCallback } from 'react';
import type { Notification } from '@/types';

type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

interface NotificationItem extends Omit<Notification, 'id' | 'user_id' | 'created_at'> {
  id: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((
    title: string,
    message: string,
    type: NotificationType = 'INFO',
    link?: string
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: NotificationItem = {
      id,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
    
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
  };
}
