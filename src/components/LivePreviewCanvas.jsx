import React, { useRef, useEffect, useState } from 'react';

// يربط تسميات الخطوط الموجودة أصلاً في لوحة خيارات المنتج بأسماء خطوط Google
// المحمّلة فعليًا في index.css / tailwind.config.js — نفس الأسماء بالضبط.
const FONT_MAP = {
  'ثلث': 'Amiri',
  'ديواني': "'Aref Ruqaa'",
  'كوفي': "'Reem Kufi'",
  'نسخ': "'Scheherazade New'",
  'لطيف': 'Lateef',
  'مصري': "'El Messiri'",
  'قاهرة': 'Cairo',
  'طاجوال': 'Tajawal',
};

function hexToRgba(hex, alpha) {
  const h = (hex || '#D4AF37').replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16) || 0xd4af37;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * معاينة حيّة فوق صورة المنتج الحقيقية: تُظهر اسم العميل مطرّزًا، شريط
 * الوشاح، وسم التاريخ ونوع الكاب — تتحدّث فورًا مع كل تغيير في الخيارات.
 * كانفاس شفاف يطفو فوق <img> الأصلية بدون المساس بجودتها.
 */
export default function LivePreviewCanvas({ config, product }) {
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!parent) return;
    const update = () => {
      const rect = parent.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      const canvas = canvasRef.current;
      if (!canvas || !size.w || !size.h) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size.w, size.h);

      const fontFamily = FONT_MAP[config.fontType] || 'Tajawal';
      try {
        await Promise.all([
          document.fonts.load(`700 32px ${fontFamily}`),
          document.fonts.load(`600 16px Tajawal`),
        ]);
      } catch { /* الخط سيرجع لبديل افتراضي إن فشل التحميل */ }
      if (cancelled) return;

      // شريط الوشاح المائل
      if (config.addSash && product.has_sash) {
        ctx.save();
        ctx.translate(size.w * 0.5, size.h * 0.4);
        ctx.rotate(-Math.PI / 9);
        const ribbonW = size.w * 0.95;
        const ribbonH = Math.max(30, size.h * 0.07);
        ctx.fillStyle = hexToRgba(config.sashColor, 0.9);
        ctx.fillRect(-ribbonW / 2, -ribbonH / 2, ribbonW, ribbonH);
        ctx.fillStyle = 'rgba(212,175,55,0.85)';
        ctx.fillRect(-ribbonW / 2, -ribbonH / 2, ribbonW, 2.5);
        ctx.fillRect(-ribbonW / 2, ribbonH / 2 - 2.5, ribbonW, 2.5);
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.font = `600 ${Math.max(12, ribbonH * 0.34)}px Tajawal`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('وشاح التخرج', 0, 1);
        ctx.restore();
      }

      // الاسم المطرّز
      if (config.name?.trim() && product.has_name) {
        ctx.save();
        ctx.direction = 'rtl';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const fontSize = Math.max(18, Math.min(size.w * 0.09, 40));
        ctx.font = `700 ${fontSize}px ${fontFamily}`;
        const x = size.w / 2;
        const y = size.h * 0.82;
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillText(config.name, x + 1, y + 1.5);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText(config.name, x - 0.6, y - 0.6);
        ctx.fillStyle = config.threadColor;
        ctx.fillText(config.name, x, y);
        ctx.restore();
      }

      // وسم التاريخ
      if (config.date && product.has_date) {
        ctx.save();
        const pillH = Math.max(24, size.w * 0.05);
        ctx.font = `700 ${Math.max(11, pillH * 0.42)}px Tajawal`;
        const textW = ctx.measureText(config.date).width;
        const pillW = textW + 26;
        const px = size.w - pillW - 12;
        const py = 12;
        ctx.fillStyle = 'rgba(21,22,26,0.72)';
        roundRect(ctx, px, py, pillW, pillH, pillH / 2);
        ctx.fill();
        ctx.fillStyle = '#E9D28C';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.date, px + pillW / 2, py + pillH / 2 + 1);
        ctx.restore();
      }

      // وسم نوع الكاب
      if (product.has_cap && config.capType) {
        ctx.save();
        ctx.font = `600 11px Tajawal`;
        const textW = ctx.measureText(config.capType).width;
        const w = textW + 22;
        const h = 24;
        const x = 12, y = size.h - h - 12;
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        roundRect(ctx, x, y, w, h, h / 2);
        ctx.fill();
        ctx.strokeStyle = config.threadColor;
        ctx.lineWidth = 1.2;
        roundRect(ctx, x, y, w, h, h / 2);
        ctx.stroke();
        ctx.fillStyle = '#15161a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.capType, x + w / 2, y + h / 2 + 1);
        ctx.restore();
      }
    }

    draw();
    return () => { cancelled = true; };
  }, [config, product, size]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
