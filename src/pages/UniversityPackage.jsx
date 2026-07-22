import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import UniversityPackageWidget from '@/components/UniversityPackageWidget';

export default function UniversityPackage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <span className="chip bg-accent/40 text-primary mb-3">أداة تصميم تفاعلية</span>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold">بكج <span className="text-grad-violet">تخرج جامعتك</span> الكامل</h1>
          <p className="text-foreground/60 text-sm mt-2 max-w-lg mx-auto">اختر جامعتك، اكتب اسمك وسنة تخرجك، وشاهد معاينة حية للوشاح والكاب سوا قبل ما تطلب البكج (عباية + كاب + وشاح).</p>
        </div>
        <UniversityPackageWidget productName="بكج تخرج جامعي" productPrice={190} />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
