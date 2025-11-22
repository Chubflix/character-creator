'use client';

import { useState } from 'react';
import { signInWithGoogle, signOut } from '@/lib/services/auth';

interface AuthButtonProps {
  user: any;
  onAuthChange?: () => void;
}

export function AuthButton({ user, onAuthChange }: AuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      onAuthChange?.();
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      onAuthChange?.();
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem' }}
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="btn btn-primary"
      style={{ padding: '0.5rem 1rem' }}
    >
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}
