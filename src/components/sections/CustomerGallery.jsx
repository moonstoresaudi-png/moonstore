import React from 'react';

const photos = [
  '/images/products/senior-jacket/front.jpg',
  '/images/products/senior-jacket/side.png',
  '/images/products/cap/view1.webp',
  '/images/products/cap/view2.webp',
  '/images/products/sash/view1.webp',
  '/images/products/senior-jacket/back.png',
];

export default function CustomerGallery() {
  return (
    <section className="py-10 sm:py-14 bg-secondary/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative grid grid-cols-3 gap-2 sm:gap-3">
          {photos.map((p, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-secondary">
              <img src={p} alt="" className="w-full h-full object-cover" />
            </div>
          ))}

          {/* الشعار بالنص */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-xl border border-border">
              <img src="/images/brand/logo.png" alt="Moon Store" className="h-14 sm:h-20 w-auto object-contain" />
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="kicker justify-center mb-3">ملفتة بأناقتك</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">جمع الطلبات صنعة بحب وشغف لأجلكم</h2>
        </div>
      </div>
    </section>
  );
}
