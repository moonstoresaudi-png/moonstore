import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative">
      <div className="relative overflow-hidden" style={{ minHeight: 520 }}>
        {/* خلفية متدرجة فاخرة */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(298 17% 36%) 0%, hsl(298 20% 25%) 50%, hsl(345 30% 50%) 100%)' }} />

        {/* زخارف دائرية */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-pink/10 blur-3xl" />

        {/* الشعار الكبير في المنتصف */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 sm:py-24">
          <div className="flex items-center gap-3 mb-6 animate-fade-up drop-shadow-2xl">
            <img src="/images/brand/logo.png" alt="Moon Store" className="h-20 sm:h-28 w-auto object-contain" />
          </div>
          <span className="chip bg-white/15 text-white backdrop-blur-sm mb-4 animate-fade-up">تشكيلة تخرج 2026</span>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold leading-tight text-white drop-shadow-lg animate-fade-up">فخامة تخرّجك<br/>تبدأ من هنا</h1>
          <p className="mt-3 text-white/85 text-sm sm:text-base max-w-md drop-shadow animate-fade-up">أرواب وأوشحة وملحقات تخرج بتطريز ذهبي يدوي.</p>
          <div className="flex flex-wrap gap-3 mt-7 animate-fade-up">
            <Link to="/shop" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary font-bold text-sm hover:bg-white/90 transition-colors shadow-lg">تسوّق الآن <ArrowLeft className="w-4 h-4" /></Link>
            <a href="#categories" className="px-7 py-3.5 rounded-full bg-white/15 text-white backdrop-blur-sm border border-white/30 font-medium text-sm hover:bg-white/25 transition-colors">تسوّق الأقسام</a>
          </div>
        </div>
      </div>
    </section>
  );
}