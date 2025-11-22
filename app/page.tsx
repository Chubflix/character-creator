'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { supabase } from '@/lib/services/supabase';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation user={user} />
        <div className="main-container">
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '1rem' }}>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation user={user} />
      <div className="main-container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2 }}>
              Character Creator
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              AI-powered character sheet creator for TavernAI and ChubAI
            </p>
            {user ? (
              <Link href="/create" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                Create New Character
              </Link>
            ) : (
              <div className="empty-state">
                <h3>Sign in to get started</h3>
                <p>Use the sign in button in the navigation to authenticate with Google.</p>
              </div>
            )}
          </div>

          <div className="panel" style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Features</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent)' }}>
                  AI-Powered Chat Interface
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Create characters through conversation with an AI assistant that helps develop personality traits, backgrounds, and detailed characteristics.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent)' }}>
                  Vector Memory System
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Character traits are stored using pgvector technology, ensuring consistency across sessions and preventing trait bleeding between characters.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent)' }}>
                  Multi-Session Support
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Continue character development across multiple conversations while maintaining context and character consistency.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent)' }}>
                  TavernAI/ChubAI Export
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Export your characters as JSON files compatible with TavernAI and ChubAI platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
