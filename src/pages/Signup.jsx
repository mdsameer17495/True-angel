import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store';
import Button from '../components/UI/Button';
import './Login.css'; // Reuse auth styling

export default function Signup() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate network delay for premium feel
    setTimeout(() => {
      const res = signup(name.trim(), email.trim(), password);
      setLoading(false);
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.error || 'Failed to create account.');
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
          <p className="text-secondary mt-xs">Create your care profile</p>
        </div>

        {error && (
          <div className="auth-error-alert flex gap-sm align-center animate-fadeIn">
            <AlertCircle size={18} className="text-danger flex-shrink-0" />
            <span className="text-small">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form mt-lg flex-col gap-md">
          <div className="form-group">
            <label className="text-label">Full Name</label>
            <div className="input-with-icon">
              <User className="input-icon text-muted" size={18} />
              <input
                type="text"
                placeholder="Nadiya Ali"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

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
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-footer text-center mt-xl">
          <p className="text-secondary text-small">
            Already have an account?{' '}
            <Link to="/login" className="text-link font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
