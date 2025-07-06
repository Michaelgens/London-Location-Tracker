import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  AuthError as FirebaseAuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

interface UserData {
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

interface AuthError {
  code: string;
  message: string;
  technical?: string;
}

// Function to get user-friendly error messages
const getAuthErrorMessage = (error: FirebaseAuthError): AuthError => {
  const technical = error.code;
  
  switch (error.code) {
    // Sign in errors
    case 'auth/invalid-email':
      return {
        code: 'invalid_email',
        message: 'Please enter a valid email address.',
        technical
      };
    case 'auth/user-disabled':
      return {
        code: 'account_disabled',
        message: 'This account has been disabled. Please contact support.',
        technical
      };
    case 'auth/user-not-found':
      return {
        code: 'user_not_found',
        message: 'No account found with this email. Please check your email or sign up.',
        technical
      };
    case 'auth/wrong-password':
      return {
        code: 'invalid_password',
        message: 'Incorrect password. Please try again.',
        technical
      };
    case 'auth/too-many-requests':
      return {
        code: 'too_many_attempts',
        message: 'Too many unsuccessful attempts. Please try again later or reset your password.',
        technical
      };
    
    // Sign up errors
    case 'auth/email-already-in-use':
      return {
        code: 'email_in_use',
        message: 'An account already exists with this email. Please sign in instead.',
        technical
      };
    case 'auth/weak-password':
      return {
        code: 'weak_password',
        message: 'Please choose a stronger password. Use at least 6 characters with a mix of letters and numbers.',
        technical
      };
    case 'auth/operation-not-allowed':
      return {
        code: 'signup_disabled',
        message: 'Account creation is currently disabled. Please try again later.',
        technical
      };

    // Google sign-in errors
    case 'auth/popup-closed-by-user':
      return {
        code: 'popup_closed',
        message: 'Sign in was cancelled. Please try again.',
        technical
      };
    case 'auth/popup-blocked':
      return {
        code: 'popup_blocked',
        message: 'Sign in popup was blocked. Please allow popups for this site.',
        technical
      };
    case 'auth/cancelled-popup-request':
      return {
        code: 'popup_cancelled',
        message: 'Only one sign in window can be open at a time.',
        technical
      };
    case 'auth/account-exists-with-different-credential':
      return {
        code: 'account_exists',
        message: 'An account already exists with this email but with different sign-in credentials.',
        technical
      };

    // Password reset errors
    case 'auth/missing-email':
      return {
        code: 'missing_email',
        message: 'Please enter your email address.',
        technical
      };
    case 'auth/invalid-action-code':
      return {
        code: 'invalid_reset_code',
        message: 'This password reset link is invalid or has expired. Please request a new one.',
        technical
      };

    // Network errors
    case 'auth/network-request-failed':
      return {
        code: 'network_error',
        message: 'Unable to connect. Please check your internet connection and try again.',
        technical
      };

    // Default error
    default:
      // Log the technical error in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth Error:', error);
      }
      return {
        code: 'unknown_error',
        message: 'An unexpected error occurred. Please try again.',
        technical: error.code
      };
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createUserDocument = async (user: User, additionalData?: { displayName?: string; isNewUser?: boolean }) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const { email, uid, emailVerified } = user;
        const createdAt = new Date().toISOString();
        const notifId = `notif_${Date.now()}`;

        const displayName = additionalData?.displayName || user.displayName;
        
        if (!displayName) {
          throw new Error('display_name_required');
        }

        const userData: UserData = {
          uid,
          email: email || '',
          displayName,
          createdAt,
          lastLoginAt: createdAt,
          emailVerified,
          currentZoneStatus: {
            status: 'OUTSIDE_ZONE',
            lastUpdated: createdAt,
            unpaidEntry: null
          },
          history: {},
          notifications: {
            [notifId]: {
              id: Date.now(),
              title: 'Welcome!',
              message: 'Your account has been successfully created.',
              time: 'just now',
              type: 'signup',
              read: false,
              timestamp: createdAt
            }
          },
          settings: {
            alertTone: 'basic1',
            notifications: {
              zoneAlerts: true,
              proximityAlert: false,
              paymentReminders: true,
              locationTracking: true
            }
          },
          subscription: {
            planId: 'free-trial',
            startDate: createdAt,
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
          }
        };

        await setDoc(userRef, userData);
      } else {
        try {
          const notifId = `notif_${Date.now()}`;
          await setDoc(userRef, {
            lastLoginAt: new Date().toISOString(),
            [`notifications.${notifId}`]: {
              id: Date.now(),
              title: 'New Sign In',
              message: 'New sign in to your account',
              time: 'just now',
              type: 'signin',
              read: false,
              timestamp: new Date().toISOString()
            }
          }, { merge: true });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error updating last login:', error);
          }
          throw new Error('update_login_failed');
        }
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating user document:', error);
      }
      if (error.message === 'display_name_required') {
        throw {
          code: 'display_name_required',
          message: 'Please provide your full name to create an account.'
        };
      }
      throw {
        code: 'profile_creation_failed',
        message: 'Unable to set up your profile. Please try again.'
      };
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!displayName.trim()) {
      setError({
        code: 'invalid_name',
        message: 'Please enter your full name.'
      });
      throw new Error('invalid_name');
    }
    
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(user, { displayName: displayName.trim(), isNewUser: true });
      return user;
    } catch (error: any) {
      const authError = getAuthErrorMessage(error);
      setError(authError);
      throw authError;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(user);
      return user;
    } catch (error: any) {
      const authError = getAuthErrorMessage(error);
      setError(authError);
      throw authError;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      if (!user.displayName) {
        throw new Error('auth/missing-display-name');
      }
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const isNewUser = !userSnap.exists();
      await createUserDocument(user, { isNewUser });
      return user;
    } catch (error: any) {
      const authError = getAuthErrorMessage(error);
      setError(authError);
      throw authError;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      const authError = getAuthErrorMessage(error);
      setError(authError);
      throw authError;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      const authError = getAuthErrorMessage(error);
      setError(authError);
      throw authError;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    logout,
    clearError
  };
}; 