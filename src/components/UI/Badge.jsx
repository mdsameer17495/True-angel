import React from 'react';
import './Badge.css';

export default function Badge({ children, variant = 'default', size = 'md', icon: Icon, dot = false, className = '', ...props }) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`} {...props}>
      {dot && <span className="badge-dot" />}
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      {children}
    </span>
  );
}
