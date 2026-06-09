import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Pill, Mic, Bell, User } from 'lucide-react';
import './BottomNav.css';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home', id: 'nav-home' },
  { path: '/medicines', icon: Pill, label: 'Medicines', id: 'nav-medicines' },
  { path: '/assistant', icon: Mic, label: 'AI', id: 'nav-assistant', isCenter: true },
  { path: '/reminders', icon: Bell, label: 'Reminders', id: 'nav-reminders' },
  { path: '/profile', icon: User, label: 'Profile', id: 'nav-profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                id={item.id}
                className="bottom-nav-center-btn"
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="center-btn-ring">
                  <Icon size={26} strokeWidth={2.5} />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              id={item.id}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="nav-icon-wrapper">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <div className="nav-active-dot" />}
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
