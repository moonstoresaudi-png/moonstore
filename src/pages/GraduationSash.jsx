import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SashSimulatorWidget from '@/components/SashSimulatorWidget';

const IMAGES = ['/images/products/sash/view1.webp'];

export default function GraduationSash() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-primary mb-1.5">Graduation Sash</p>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold mb-3">وشاح تخرج بيسيك تطريز</h1>
          <p className="text-foreground/60 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            وشاح تخرج وهو الأكثر طلباً، قم بتطريز اسمك وتاريخ تخرجك بالطريقة التي تناسبك. تصميم المثلث الصغير من الخلف يساعد على ثباته على الظهر.
          </p>
          <p className="text-foreground/40 text-xs mt-2">* هذه معاينة تقريبية وقد يختلف موضع التطريز بدرجة بسيطة عن الواقع.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
          {IMAGES.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-secondary card-soft aspect-square">
              <img src={img} alt={`وشاح تخرج ${i + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>

        <SashSimulatorWidget productName="وشاح تخرج بيسيك تطريز" productPrice={65} />

        <p className="text-foreground/40 text-xs text-center mt-8">
          * قريبًا: إضافة شعارات الجامعات (باتشات) — سيتم تحديث الصفحة فور استلامها.
        </p>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
