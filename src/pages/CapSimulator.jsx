import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CapSimulatorWidget from '@/components/CapSimulatorWidget';

export default function CapSimulator() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <span className="chip bg-accent/40 text-primary mb-3">أداة تصميم تفاعلية</span>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold">صمّم <span className="text-grad-violet">كاب تخرجك</span></h1>
          <p className="text-foreground/60 text-sm mt-2 max-w-lg mx-auto">اكتب اسمك أو ارفع شعار جامعتك، اختر الألوان، وشاهد معاينة حقيقية لكابك قبل الطلب.</p>
        </div>
        <CapSimulatorWidget productName="كاب تخرج مخصص" productPrice={90} />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
