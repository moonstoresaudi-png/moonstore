import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import JacketSimulatorWidget from '@/components/JacketSimulatorWidget';

export default function SeniorJacket() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-primary mb-1.5">Senior Jacket</p>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold mb-3">جاكيت تخرج سينيور</h1>
          <p className="text-foreground/60 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            جاكيت تخرج أنيق باللون الأسود، مصنوع من قماش عالي الجودة مع أكمام جلد. صمّمه بنفسك بإضافة اسمك المطرّز واختيار الباتشات المفضلة لديك.
          </p>
          <p className="text-foreground/40 text-xs mt-2">* هذه معاينة تقريبية وقد يختلف موضع التطريز والألوان بدرجة بسيطة عن الواقع.</p>
        </div>

        <JacketSimulatorWidget />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
