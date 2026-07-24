import React from 'react';
import { Link } from 'react-router-dom';

// الشعار الرسمي للمتجر
const LOGO_URL = '/images/brand/logo.png';

export default function Logo({ compact = false, dark = false, className = '' }) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img
        src={LOGO_URL}
        alt="Moon Store"
        className={compact ? 'h-12 w-auto object-contain' : 'h-20 md:h-24 w-auto object-contain'}
      />
    </Link>
  );
}
