import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store';
import Button from '../components/UI/Button';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate small network delay for premium feel
    setTimeout(() => {
      const res = login(email.trim(), password);
      setLoading(false);
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }, 800);
  };

  return (
    <div className="auth-page flex-col flex-center animate-fadeIn">
      <div className="auth-card animate-scaleIn stagger-1">
        <div className="auth-header text-center">
          <div className="auth-logo bg-primary-light text-primary-dark animate-pulse">
            <HeartPulse size={40} />
          </div>
          <h1 className="text-display mt-md">True Angel</h1>
          <p className="text-secondary mt-xs">Your Personal Care Assistant</p>
        </div>

        {error && (
          <div className="auth-error-alert flex gap-sm align-center animate-fadeIn">
            <AlertCircle size={18} className="text-danger flex-shrink-0" />
            <span className="text-small">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form mt-lg flex-col gap-md">
          <div className="form-group">
            <label className="text-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon text-muted" size={18} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="text-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon text-muted" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle-btn text-muted flex-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth className="mt-md" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-footer text-center mt-xl">
          <p className="text-secondary text-small">
            Don't have an account?{' '}
            <Link to="/signup" className="text-link font-medium">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
