import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
  currentZoneStatus: {
    status: 'IN_ZONE_PAID' | 'IN_ZONE_UNPAID' | 'OUTSIDE_ZONE';
    lastUpdated: string;
    unpaidEntry: {
      date: string;
      time: string;
      timestamp: string;
    } | null;
  };
  history: {
    [key: string]: {
      date: string;
      time: string;
      status: string;
      timestamp: string;
    };
  };
  notifications: {
    [key: string]: {
      id: number;
      title: string;
      message: string;
      time: string;
      type: string;
      read: boolean;
      timestamp: string;
    };
  };
  settings: {
    alertTone: string;
    notifications: {
      zoneAlerts: boolean;
      proximityAlert: boolean;
      paymentReminders: boolean;
      locationTracking: boolean;
    };
  };
  subscription: {
    planId: string;
    startDate: string;
    endDate: string;
    status: string;
  };
}

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserData);
        } else {
          setError(new Error('User document not found'));
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user data:', error);
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Helper function to format relative time
  const getRelativeTime = useCallback((timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return then.toLocaleDateString();
  }, []);

  // Helper function to get notifications array sorted by timestamp
  const getNotifications = useCallback(() => {
    if (!userData?.notifications) return [];
    
    return Object.values(userData.notifications)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(notification => ({
        ...notification,
        time: getRelativeTime(notification.timestamp)
      }));
  }, [userData, getRelativeTime]);

  // Helper function to get recent activities
  const getRecentActivities = useCallback(() => {
    if (!userData?.notifications) return [];

    return Object.values(userData.notifications)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map(notification => ({
        time: getRelativeTime(notification.timestamp),
        action: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read
      }));
  }, [userData, getRelativeTime]);

  // Function to mark notifications as read
  const markNotificationsAsRead = useCallback(async () => {
    if (!user || !userData?.notifications) return;

    const unreadNotifications = Object.entries(userData.notifications).filter(
      ([_, notification]) => !notification.read
    );

    if (unreadNotifications.length === 0) return;

    const userRef = doc(db, 'users', user.uid);
    const updatedNotifications = { ...userData.notifications };

    unreadNotifications.forEach(([key, notification]) => {
      updatedNotifications[key] = {
        ...notification,
        read: true
      };
    });

    try {
      await updateDoc(userRef, {
        notifications: updatedNotifications
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }, [user, userData]);

  return {
    userData,
    loading,
    error,
    getNotifications,
    getRecentActivities,
    markNotificationsAsRead
  };
}; 