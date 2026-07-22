import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import LivePreviewCanvas from './LivePreviewCanvas';

export default function ProductGallery({ images = [], name = '', discount = 0, product, previewConfig }) {
  const [active, setActive] = useState(0);
  const imgs = images.filter(Boolean);
  const mainImg = imgs[active] || imgs[0] || '';

  const hasCustomization = product?.simulator_enabled && (product.has_name || product.has_date || product.has_sash || product.has_cap);
  const showLivePreview = hasCustomization && previewConfig;

  if (!mainImg) {
    return <div className="aspect-[4/5] rounded-2xl bg-secondary card-soft" />;
  }

  return (
    <div className="space-y-3 lg:sticky lg:top-24">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary card-soft">
        {discount > 0 && (
          <span className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-sm">خصم {discount}%</span>
        )}
        {showLivePreview && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-foreground/85 text-background text-[11px] font-bold shadow-sm inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400"></span>
            </span>
            معاينة حية
          </span>
        )}
        <img src={mainImg} alt={name} className="w-full h-full object-cover" />
        {showLivePreview && <LivePreviewCanvas config={previewConfig} product={product} />}
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${active === i ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
