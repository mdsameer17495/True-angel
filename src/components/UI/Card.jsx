import React from 'react';
import './Card.css';

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  onClick,
  className = '',
  animate = false,
  delay = 0,
  id,
  ...props
}) {
  return (
    <div
      id={id}
      className={`card card-${variant} card-pad-${padding} ${onClick ? 'card-clickable' : ''} ${animate ? 'animate-fadeInUp' : ''} ${className}`}
      style={animate && delay ? { animationDelay: `${delay}ms` } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
