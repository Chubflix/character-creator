'use client';

import Link from 'next/link';
import { AuthButton } from '../auth/AuthButton';

interface NavigationProps {
  user?: any;
}

export function Navigation({ user }: NavigationProps) {
  return (
    <nav className="nav">
      <div className="nav-content">
        <Link href="/" className="nav-brand">
          Chubflix
        </Link>
        <div className="nav-right">
          <span className="nav-title">Character Creator</span>
          <AuthButton user={user} />
        </div>
      </div>
    </nav>
  );
}
