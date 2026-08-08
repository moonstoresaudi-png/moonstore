import React from 'react';

// رسم SVG: الطول من أعلى الكتف إلى نهاية القطعة (يقبل اسم القطعة كنص متغيّر: الثوب / الجاكيت)
export function LengthSVG({ endLabel = 'الثوب' }) {
  return (
    <svg viewBox="0 0 160 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* ظل الجسم / القطعة */}
      <ellipse cx="80" cy="38" rx="20" ry="22" fill="#2a1a3a" opacity="0.85" />
      <path d="M55,58 Q48,65 46,240 L114,240 Q112,65 105,58 Z" fill="#1a0a2a" opacity="0.85" />
      <path d="M46,240 Q58,248 80,248 Q102,248 114,240 L114,240 L46,240 Z" fill="#1a0a2a" opacity="0.85" />
      {/* خط الطول الأحمر */}
      <line x1="80" y1="16" x2="80" y2="248" stroke="#e74c3c" strokeWidth="2.5" />
      <polygon points="80,12 75,20 85,20" fill="#e74c3c" />
      <polygon points="80,252 75,244 85,244" fill="#e74c3c" />
      {/* تسمية */}
      <rect x="10" y="110" width="52" height="36" rx="8" fill="#e74c3c" opacity="0.9" />
      <text x="36" y="125" textAnchor="middle" fill="white" fontSize="8" fontFamily="Cairo,sans-serif" fontWeight="bold">الطول من</text>
      <text x="36" y="137" textAnchor="middle" fill="white" fontSize="7" fontFamily="Cairo,sans-serif">أعلى الكتف</text>
      <text x="36" y="148" textAnchor="middle" fill="white" fontSize="7" fontFamily="Cairo,sans-serif">{`لنهاية ${endLabel}`}</text>
    </svg>
  );
}

// رسم SVG: العرض من الإبط الأيمن إلى الإبط الأيسر (نصف المحيط) — من الأمام فقط
export function ChestWidthSVG() {
  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <ellipse cx="100" cy="35" rx="20" ry="22" fill="#2a1a3a" opacity="0.85" />
      <path d="M72,55 Q65,62 63,190 L137,190 Q135,62 128,55 Z" fill="#1a0a2a" opacity="0.85" />
      <path d="M72,55 Q52,58 46,80 L58,85 Q62,68 74,62 Z" fill="#1a0a2a" opacity="0.8" />
      <path d="M128,55 Q148,58 154,80 L142,85 Q138,68 126,62 Z" fill="#1a0a2a" opacity="0.8" />
      <line x1="60" y1="78" x2="140" y2="78" stroke="#2ecc71" strokeWidth="2.5" strokeDasharray="5 3" />
      <polygon points="58,78 66,74 66,82" fill="#2ecc71" />
      <polygon points="142,78 134,74 134,82" fill="#2ecc71" />
      <circle cx="60" cy="78" r="4" fill="#2ecc71" />
      <circle cx="140" cy="78" r="4" fill="#2ecc71" />
      <rect x="52" y="155" width="96" height="44" rx="8" fill="#2ecc71" opacity="0.95" />
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="9" fontFamily="Cairo,sans-serif" fontWeight="bold">العرض</text>
      <text x="100" y="183" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Cairo,sans-serif">من الإبط الأيمن</text>
      <text x="100" y="194" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Cairo,sans-serif">إلى الإبط الأيسر</text>
      <text x="100" y="205" textAnchor="middle" fill="#e0ffe0" fontSize="7" fontFamily="Cairo,sans-serif">(من الأمام فقط)</text>
    </svg>
  );
}
