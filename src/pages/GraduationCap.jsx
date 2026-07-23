import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CapSimulatorWidget from '@/components/CapSimulatorWidget';

const IMAGES = ['/images/products/cap/view1.webp', '/images/products/cap/view2.webp'];

export default function GraduationCap() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-primary mb-1.5">Graduation Cap</p>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold mb-3">كاب تخرج</h1>
          <p className="text-foreground/60 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            اختيار كاب التخرج المثالي لك، صنع من مواد عالية الجودة. خصّص لون الكاب ولون الشرابة (التصل) حسب ذوقك.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {IMAGES.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-secondary card-soft aspect-square">
              <img src={img} alt={`كاب تخرج ${i + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>

        <CapSimulatorWidget productName="كاب تخرج" productPrice={35} />

        <p className="text-foreground/40 text-xs text-center mt-8">
          * قريبًا: إضافة شعارات الجامعات (باتشات) — سيتم تحديث الصفحة فور استلامها.
        </p>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
