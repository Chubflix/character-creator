'use client';

import { useState } from 'react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } from '@/lib/services/auth';

interface AuthButtonProps {
  user: any;
  onAuthChange?: () => void;
}

export function AuthButton({ user, onAuthChange }: AuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isSignUp) {
        await signUpWithEmail(email, password);
        alert('Account created! You can now sign in.');
        setIsSignUp(false);
      } else {
        await signInWithEmail(email, password);
      }
      setEmail('');
      setPassword('');
      setShowEmailAuth(false);
      onAuthChange?.();
    } catch (error: any) {
      console.error('Error with email auth:', error);
      alert(error.message || 'Failed to authenticate. Please try again.');
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

  if (showEmailAuth) {
    return (
      <div style={{ position: 'relative' }}>
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: '0.875rem',
              width: '200px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: '0.875rem',
              width: '150px'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem' }}
          >
            {loading ? '...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={() => setShowEmailAuth(false)}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button
        onClick={() => setShowEmailAuth(true)}
        disabled={loading}
        className="btn btn-primary"
        style={{ padding: '0.5rem 1rem' }}
      >
        Email Sign In
      </button>
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="btn btn-secondary"
        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
      >
        {loading ? 'Signing in...' : 'Google'}
      </button>
    </div>
  );
}
