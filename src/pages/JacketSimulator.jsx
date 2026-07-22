import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import JacketSimulatorWidget from '@/components/JacketSimulatorWidget';

export default function JacketSimulator() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <span className="chip bg-accent/40 text-primary mb-3">أداة تصميم تفاعلية</span>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold">صمّم <span className="text-grad-violet">جاكيت السينيور</span></h1>
          <p className="text-foreground/60 text-sm mt-2 max-w-lg mx-auto">اختر لون الجاكيت والأكمام، طرّز الصدر والظهر باسمك أو شعارك، وشاهد معاينة حية من الأمام والخلف.</p>
        </div>
        <JacketSimulatorWidget productName="جاكيت سينيور تخرج" productPrice={195} />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
