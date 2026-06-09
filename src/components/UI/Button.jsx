import React, { useRef } from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = '',
  id,
  ...props
}) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    if (disabled || loading) return;
    // Ripple effect
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    props.onClick?.(e);
  };

  return (
    <button
      ref={btnRef}
      id={id}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
      onClick={handleClick}
    >
      {loading && <span className="btn-spinner" />}
      {!loading && Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children && <span className="btn-text">{children}</span>}
      {!loading && IconRight && <IconRight size={size === 'sm' ? 16 : 18} />}
    </button>
  );
}
