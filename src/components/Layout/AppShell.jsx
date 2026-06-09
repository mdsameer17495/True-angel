import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppShell() {
  const location = useLocation();
  const hideNavPaths = ['/', '/onboarding', '/login', '/signup'];
  const showNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className="app-shell">
      <main className={`page-content ${!showNav ? 'no-nav' : ''}`}>
        <Outlet />
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
