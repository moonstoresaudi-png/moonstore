import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Megaphone } from 'lucide-react';
import { useStoreSettings } from '@/lib/SettingsContext';

export default function Hero() {
  const { settings } = useStoreSettings();
  return (
    <section id="home" className="relative overflow-hidden">
      {/* خلفية هادئة فاتحة بنقشة زخرفية خفيفة */}
      <div className="absolute inset-0 bg-secondary/40" />
      <div className="absolute top-16 left-1/4 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      {/* الصورة بعرض الصفحة بالكامل — أول عنصر يشوفه الزائر */}
      <div className="relative w-full">
        <img src="/images/brand/customer-gallery.jpg" alt="Moon Store" className="w-full h-auto object-cover max-h-[80vh]" />

        {/* بطاقة إحصائية عائمة */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 card-soft px-5 py-3 flex items-center gap-3 bg-card">
          <img src="/images/brand/logo.png" alt="" className="h-8 w-auto object-contain" />
          <div>
            <p className="font-display font-bold text-lg text-primary leading-none">+5000</p>
            <p className="text-[11px] text-foreground/50">عميل سعيد</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 text-center">
        <span className="kicker justify-center mb-5">
          <Sparkles className="w-3.5 h-3.5" /> تشكيلتنا المميزة
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.15] text-foreground">
          فخامة لحظاتك <span className="text-grad-violet">تبدأ من هنا</span>
        </h1>
        <div className="w-16 divider-gold my-6 mx-auto opacity-80" />
        <p className="text-foreground/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          أرواب تخرج، جاكيتات، كوفلات مواليد، وملحقات فاخرة بتطريز ذهبي يدوي — تفاصيل مصممة لتليق بلحظتك.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-9">
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all shadow-lg">تسوّق الآن <ArrowLeft className="w-4 h-4" /></Link>
          <a href="#categories" className="px-8 py-3.5 rounded-full bg-transparent text-primary border border-primary/30 font-medium text-sm hover:bg-primary/5 transition-colors">تسوّق الأقسام</a>
        </div>

        {settings.announcement_enabled && settings.announcement_text && (
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/50 text-primary text-xs sm:text-sm font-bold mx-auto animate-pulse">
            <Megaphone className="w-4 h-4 flex-shrink-0" />
            <span>{settings.announcement_text}</span>
          </div>
        )}
      </div>


      {/* موجة سفلية تفصل الهيرو عن باقي الصفحة */}
      <div className="absolute bottom-0 inset-x-0 leading-none pointer-events-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8 sm:h-12 block">
          <path d="M0,60 C240,20 480,20 720,40 C960,60 1200,60 1440,30 L1440,60 L0,60 Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}
