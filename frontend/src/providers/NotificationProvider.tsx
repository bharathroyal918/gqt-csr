"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { DatabaseNotification } from "@/types";
import { notificationService } from "@/services/notification.service";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: DatabaseNotification[];
  unreadCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { role, user } = useAuth();
  const [notifications, setNotifications] = useState<DatabaseNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifs = useCallback(async () => {
    const list = await notificationService.getNotifications(role, user?.id);
    setNotifications(list);
  }, [role, user?.id]);

  useEffect(() => {
    fetchNotifs();

    const sub = notificationService.subscribeToNotifications((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      toast.info(newNotif.title, {
        description: newNotif.message,
      });
    }, role);

    return () => {
      sub.unsubscribe();
    };
  }, [role, user?.id]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await notificationService.markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await notificationService.markAllAsRead(role, user?.id);
    toast.success("All notifications marked as read");
  }, [role, user?.id]);

  const archiveNotification = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await notificationService.archiveNotification(id);
    toast.success("Notification archived");
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        refreshNotifications: fetchNotifs,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
