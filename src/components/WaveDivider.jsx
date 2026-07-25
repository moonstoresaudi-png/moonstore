import React from 'react';

// فاصل متموج بين الأقسام — يرسم موجة بلون الخلفية التالية فوق الحالية
export default function WaveDivider({ color = 'hsl(var(--background))', flip = false }) {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ lineHeight: 0, transform: flip ? 'scaleY(-1)' : undefined }}>
      <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 sm:h-16 block">
        <path d="M0,70 C240,10 480,10 720,40 C960,70 1200,70 1440,20 L1440,70 L0,70 Z" fill={color} />
      </svg>
    </div>
  );
}
