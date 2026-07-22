import React from 'react';

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
function lighten(hex, amt) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255, r + amt)},${Math.min(255, g + amt)},${Math.min(255, b + amt)})`;
}
function darken(hex, amt) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.max(0, r - amt)},${Math.max(0, g - amt)},${Math.max(0, b - amt)})`;
}

export default function SashPreview({ text = '', fontCls = 'font-diwani', sashColor = '#6B4D6C', thread = '#D4AF37', fontSize = 38, className = '' }) {
  const fabric = `linear-gradient(155deg, ${lighten(sashColor, 35)} 0%, ${sashColor} 28%, ${darken(sashColor, 12)} 68%, ${darken(sashColor, 30)} 100%)`;
  const sheen = 'linear-gradient(105deg, transparent 32%, rgba(255,255,255,0.16) 46%, transparent 58%)';
  const fringeColor = darken(sashColor, 22);

  const Fringe = ({ side }) => (
    <div className={`absolute -bottom-1 ${side === 'l' ? 'left-0' : 'right-0'} flex flex-col ${side === 'l' ? 'items-start' : 'items-end'}`}>
      <div className="w-7" style={{ background: fabric, height: '13px', borderTop: `3px solid ${thread}`, borderBottom: `2px solid ${thread}` }} />
      <div className="flex gap-[1.5px] pt-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ width: '2px', background: fringeColor, height: `${16 + (i % 3) * 5}px`, opacity: 0.85, borderRadius: '0 0 1px 1px' }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`relative flex items-center justify-center min-h-[400px] overflow-hidden ${className}`}>
      {/* Body silhouette */}
      <div className="absolute inset-0 flex flex-col items-center pointer-events-none select-none">
        <div className="w-14 h-[72px] rounded-[50%] bg-foreground/[0.022] mt-10" />
        <div className="w-60 h-72 -mt-1 bg-foreground/[0.018]" style={{ clipPath: 'ellipse(55% 100% at 50% 0%)' }} />
      </div>

      {/* Sash */}
      <div className="relative" style={{ transform: 'rotate(-22deg)', marginTop: '-30px' }}>
        <div
          className="relative rounded-md mx-auto"
          style={{
            background: fabric,
            boxShadow: '0 14px 34px -8px rgba(0,0,0,0.3), inset 0 0 28px rgba(0,0,0,0.07)',
            width: '280px',
            padding: '30px 22px',
            borderTop: `3px solid ${thread}`,
            borderBottom: `3px solid ${thread}`,
          }}
        >
          <div className="absolute inset-0 rounded-md pointer-events-none" style={{ background: sheen }} />
          <div className="absolute top-2 left-2 right-2 h-px" style={{ background: thread, opacity: 0.35 }} />
          <div className="absolute bottom-2 left-2 right-2 h-px" style={{ background: thread, opacity: 0.35 }} />
          <div className={`${fontCls} embroidery-text text-center break-words leading-snug relative`} style={{ color: thread, fontSize: `${fontSize}px`, fontWeight: 700 }}>
            {text || 'اكتب اسمك'}
          </div>
        </div>
        <Fringe side="l" />
        <Fringe side="r" />
      </div>
    </div>
  );
}