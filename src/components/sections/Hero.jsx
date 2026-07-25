import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative">
      <div className="relative overflow-hidden" style={{ minHeight: 600 }}>
        {/* خلفية متدرجة فاخرة */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(310 34% 28%) 0%, hsl(310 40% 18%) 50%, hsl(345 40% 48%) 100%)' }} />

        {/* زخارف دائرية */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-pink/10 blur-3xl" />

        {/* موجة سفلية تندمج مع خلفية الصفحة */}
        <div className="absolute bottom-0 inset-x-0 leading-none pointer-events-none" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 sm:h-16 block">
            <path d="M0,70 C240,10 480,10 720,40 C960,70 1200,70 1440,20 L1440,70 L0,70 Z" fill="hsl(var(--background))" />
          </svg>
        </div>

        {/* الشعار الكبير في المنتصف */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
          <div className="flex items-center gap-3 mb-7 animate-fade-up drop-shadow-2xl">
            <img src="/images/brand/logo.png" alt="Moon Store" className="h-20 sm:h-28 w-auto object-contain" />
          </div>
          <span className="kicker text-white/90 mb-5 animate-fade-up" style={{ color: 'hsl(40 60% 78%)' }}>تشكيلة تخرج 2026</span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.15] text-white drop-shadow-lg animate-fade-up">فخامة تخرّجك<br/>تبدأ من هنا</h1>
          <div className="w-16 divider-gold my-6 opacity-80" />
          <p className="text-white/80 text-sm sm:text-base max-w-md drop-shadow animate-fade-up font-light leading-relaxed">أرواب وأوشحة وملحقات تخرج بتطريز ذهبي يدوي.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-9 animate-fade-up">
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary font-bold text-sm hover:bg-white/90 hover:-translate-y-0.5 transition-all shadow-lg">تسوّق الآن <ArrowLeft className="w-4 h-4" /></Link>
            <a href="#categories" className="px-8 py-3.5 rounded-full bg-transparent text-white border border-white/40 font-medium text-sm hover:bg-white/10 transition-colors">تسوّق الأقسام</a>
          </div>
        </div>
      </div>
    </section>
  );
}