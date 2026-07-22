import React from 'react';
import { Link } from 'react-router-dom';

// شعار نصي محلي بالكامل — لا يعتمد على أي صورة مستضافة خارجيًا.
export default function Logo({ compact = false, dark = false, className = '' }) {
  const size = compact ? 'text-xl' : 'text-2xl md:text-3xl';
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className={compact ? 'w-8 h-8' : 'w-10 h-10'} aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="hsl(var(--primary))" />
        <path d="M26 12a10 10 0 1 0 2.5 18.4A12 12 0 0 1 26 12Z" fill="hsl(var(--accent))" />
      </svg>
      <span className={`font-heading font-extrabold ${size} leading-none ${dark ? 'text-background' : 'text-primary'}`}>
        Moon<span className={`font-medium ${dark ? 'text-background/60' : 'text-foreground/70'}`}> Store</span>
      </span>
    </Link>
  );
}
