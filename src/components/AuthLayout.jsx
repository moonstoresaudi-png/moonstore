import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/40 px-4 py-10" dir="rtl">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <div className="card-soft p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="font-heading text-2xl font-extrabold">{title}</h1>
            {subtitle && <p className="text-sm text-foreground/60 mt-1.5">{subtitle}</p>}
          </div>
          {children}
        </div>
        {footer && <div className="text-center mt-5 text-sm text-foreground/60">{footer}</div>}
        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-foreground/40 hover:text-primary">العودة للرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
