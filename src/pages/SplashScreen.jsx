import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { useAuthStore } from '../store';
import './SplashScreen.css';

export default function SplashScreen() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="splash-screen flex-col flex-center animate-fadeIn">
      <div className="splash-logo-container animate-scaleIn stagger-1">
        <HeartPulse size={64} className="splash-icon animate-pulse" />
      </div>
      <h1 className="splash-title text-display animate-slideUp stagger-3">True Angel</h1>
      <p className="splash-subtitle text-body-lg animate-slideUp stagger-5">Your Personal Care Assistant</p>
    </div>
  );
}
