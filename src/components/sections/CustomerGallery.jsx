import React from 'react';

export default function CustomerGallery() {
  return (
    <section className="py-10 sm:py-14 bg-secondary/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl overflow-hidden">
          <img src="/images/brand/customer-gallery.jpg" alt="Moon Store" className="w-full h-auto object-contain" />
        </div>

        <div className="text-center mt-8">
          <p className="kicker justify-center mb-3">ملفتة بأناقتك</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">جمع الطلبات صنعة بحب وشغف لأجلكم</h2>
        </div>
      </div>
    </section>
  );
}
