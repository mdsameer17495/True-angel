import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './Header.css';

export default function Header({ title, subtitle, showBack = false, rightAction, transparent = false, className = '' }) {
  const navigate = useNavigate();

  return (
    <header className={`app-header ${transparent ? 'transparent' : ''} ${className}`}>
      <div className="header-left">
        {showBack && (
          <button
            className="header-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            id="header-back-btn"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      <div className="header-center">
        {title && <h1 className="header-title">{title}</h1>}
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      <div className="header-right">
        {rightAction || <div style={{ width: 40 }} />}
      </div>
    </header>
  );
}
