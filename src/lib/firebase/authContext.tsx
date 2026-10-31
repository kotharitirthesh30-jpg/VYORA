import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './config';
import { UserProfile } from '../../types';
import { StorageService } from '../storage/store';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile;
  loading: boolean;
  error: string | null;
  isSigningIn: boolean;
  isGoogleAuthenticated: boolean;
  signInWithGoogle: () => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
  updateLocalProfile: (profile: UserProfile) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const isSigningInRef = React.useRef(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => StorageService.getProfile());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const resolvedName = currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Workspace User');
        const googleProfile: UserProfile = {
          id: currentUser.uid,
          name: resolvedName,
          email: currentUser.email || 'user@vyora.ai',
          avatarUrl: currentUser.photoURL || undefined,
          createdAt: currentUser.metadata.creationTime || new Date().toISOString(),
          plan: 'pro',
        };

        setUserProfile(googleProfile);
        StorageService.saveProfile(googleProfile);

        // Sync to Firestore users collection
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(
            userDocRef,
            {
              uid: currentUser.uid,
              displayName: currentUser.displayName || '',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              lastLoginAt: new Date().toISOString(),
              plan: 'pro',
            },
            { merge: true }
          );
        } catch (err) {
          console.error('Failed to sync profile to Firestore:', err);
        }
      } else {
        // If logged out from Firebase, use current StorageService profile
        setUserProfile(StorageService.getProfile());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserProfile | null> => {
    // In-flight mutex guard: prevent concurrent or double-invocations of signInWithPopup
    if (isSigningInRef.current) {
      console.info('Google sign-in is already in progress, ignoring duplicate trigger.');
      return null;
    }

    isSigningInRef.current = true;
    setIsSigningIn(true);
    setError(null);

    try {
      // Must use popup due to iframe restrictions
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const resolvedName = googleUser.displayName || (googleUser.email ? googleUser.email.split('@')[0] : 'Workspace User');
      const googleProfile: UserProfile = {
        id: googleUser.uid,
        name: resolvedName,
        email: googleUser.email || 'user@vyora.ai',
        avatarUrl: googleUser.photoURL || undefined,
        createdAt: googleUser.metadata.creationTime || new Date().toISOString(),
        plan: 'pro',
      };

      setUserProfile(googleProfile);
      StorageService.saveProfile(googleProfile);

      try {
        const userDocRef = doc(db, 'users', googleUser.uid);
        await setDoc(
          userDocRef,
          {
            uid: googleUser.uid,
            displayName: googleUser.displayName || '',
            email: googleUser.email || '',
            photoURL: googleUser.photoURL || '',
            lastLoginAt: new Date().toISOString(),
            plan: 'pro',
          },
          { merge: true }
        );
      } catch (firestoreErr) {
        console.warn('Firestore user write warning:', firestoreErr);
      }

      return googleProfile;
    } catch (err: any) {
      const code = err?.code;

      // Handle benign lifecycle states cleanly without throwing runtime crashes:
      if (code === 'auth/cancelled-popup-request') {
        console.info('Google Sign-In popup request was cancelled or superseded by another operation.');
        return null;
      }
      if (code === 'auth/popup-closed-by-user') {
        console.info('Google Sign-In popup was closed by user before completion.');
        return null;
      }

      // Format helpful messages for actual errors
      let message = 'Failed to sign in with Google. Please try again.';
      if (code === 'auth/popup-blocked') {
        message = 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
      } else if (code === 'auth/network-request-failed') {
        message = 'Network error while contacting Google. Please check your internet connection.';
      } else if (err?.message) {
        message = err.message;
      }

      console.warn('Google Sign-In warning:', message);
      setError(message);
      throw new Error(message);
    } finally {
      isSigningInRef.current = false;
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      const guestProfile: UserProfile = {
        id: `usr-guest-${Date.now()}`,
        name: 'Workspace User',
        email: 'user@vyora.ai',
        createdAt: new Date().toISOString(),
        plan: 'pro',
      };
      setUserProfile(guestProfile);
      StorageService.saveProfile(guestProfile);
    } catch (err: any) {
      console.error('Sign-out error:', err);
      setError(err.message || 'Error signing out.');
    }
  };

  const updateLocalProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    StorageService.saveProfile(profile);
  };

  const clearError = () => setError(null);

  const contextValue = useMemo(
    () => ({
      user,
      userProfile,
      loading,
      error,
      isSigningIn,
      isGoogleAuthenticated: !!user,
      signInWithGoogle,
      signOut,
      updateLocalProfile,
      clearError,
    }),
    [user, userProfile, loading, error, isSigningIn]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
