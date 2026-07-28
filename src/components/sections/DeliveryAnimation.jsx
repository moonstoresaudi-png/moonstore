import React, { useEffect, useRef } from 'react';
import { ShieldCheck, MapPin, Clock } from 'lucide-react';

// سيارة رياضية بشكل عصري وانسيابي
function SportsCar() {
  return (
    <svg viewBox="0 0 220 90" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* ظل الأرضية */}
      <ellipse cx="110" cy="76" rx="95" ry="5" fill="hsl(310 34% 28%)" opacity="0.1" />

      <defs>
        <linearGradient id="carGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(310 40% 32%)" />
          <stop offset="100%" stopColor="hsl(310 45% 16%)" />
        </linearGradient>
        <linearGradient id="carGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dff0ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#a9c9e6" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* هيكل السيارة الانسيابي */}
      <path d="M10,64 C10,50 22,46 34,44 L52,26 C58,20 68,17 80,17 L142,17 C154,17 163,21 170,29 L186,44 C202,45 212,52 212,62 C212,68 208,70 202,70 L18,70 C13,70 10,68 10,64 Z" fill="url(#carGrad)" />

      {/* لمعة علوية */}
      <path d="M20,58 C22,50 32,47 40,45 L54,29 C60,22 70,19 80,19 L140,19 C150,19 158,23 164,30 L178,45 C192,46 200,50 202,56" fill="none" stroke="hsl(40 55% 68%)" strokeWidth="1.5" opacity="0.5" />

      {/* الزجاج الأمامي والخلفي */}
      <path d="M60,42 L72,26 C76,22 82,20 88,20 L112,20 L112,42 Z" fill="url(#carGlass)" />
      <path d="M116,20 L136,20 C144,20 150,23 155,29 L164,42 L116,42 Z" fill="url(#carGlass)" />

      {/* خط ذهبي مميز على الجسم */}
      <path d="M14,58 L206,58" stroke="hsl(40 55% 62%)" strokeWidth="2" opacity="0.7" />

      {/* خط الباب */}
      <path d="M114,42 L114,60" stroke="hsl(310 45% 12%)" strokeWidth="1" opacity="0.35" />
      {/* فتحة تهوية جانبية */}
      <path d="M96,50 L104,50 L101,56 L94,56 Z" fill="hsl(40 55% 62%)" opacity="0.55" />
      {/* مرآة جانبية */}
      <path d="M108,32 Q102,30 100,34 Q102,37 108,36 Z" fill="hsl(310 45% 16%)" />
      {/* مقبض الباب */}
      <rect x="120" y="45" width="8" height="2" rx="1" fill="hsl(40 55% 70%)" opacity="0.7" />

      {/* السبويلر الخلفي */}
      <rect x="192" y="30" width="5" height="16" rx="2" fill="hsl(310 45% 16%)" />
      <rect x="188" y="26" width="20" height="5" rx="2.5" fill="hsl(310 45% 16%)" />

      {/* المصباح الأمامي + شعاع الضوء */}
      <ellipse cx="208" cy="52" rx="4" ry="6" fill="#FFF3C4" />
      <path d="M212,50 L222,46 L222,58 L212,54 Z" fill="#FFF3C4" opacity="0.25" />
      {/* المصباح الخلفي */}
      <rect x="12" y="48" width="4" height="8" rx="2" fill="hsl(350 70% 55%)" />

      {/* الإطارات الرياضية مع محور دوران */}
      <circle cx="52" cy="70" r="13" fill="hsl(310 40% 12%)" />
      <circle cx="52" cy="70" r="6.5" fill="hsl(40 55% 62%)" />
      <g stroke="hsl(310 40% 12%)" strokeWidth="1.2">
        <line x1="52" y1="65" x2="52" y2="75" />
        <line x1="47" y1="70" x2="57" y2="70" />
      </g>
      <circle cx="52" cy="70" r="2.5" fill="hsl(310 40% 12%)" />
      <circle cx="168" cy="70" r="13" fill="hsl(310 40% 12%)" />
      <circle cx="168" cy="70" r="6.5" fill="hsl(40 55% 62%)" />
      <g stroke="hsl(310 40% 12%)" strokeWidth="1.2">
        <line x1="168" y1="65" x2="168" y2="75" />
        <line x1="163" y1="70" x2="173" y2="70" />
      </g>
      <circle cx="168" cy="70" r="2.5" fill="hsl(310 40% 12%)" />

      {/* خطوط سرعة خلف السيارة */}
      <g opacity="0.5" stroke="hsl(310 30% 60%)" strokeWidth="2" strokeLinecap="round">
        <line x1="0" y1="50" x2="14" y2="50" />
        <line x1="0" y1="58" x2="20" y2="58" />
        <line x1="0" y1="66" x2="10" y2="66" />
      </g>

      {/* خط الحركة الأرضي */}
      <line x1="0" y1="82" x2="220" y2="82" stroke="hsl(310 15% 75%)" strokeWidth="1.5" strokeDasharray="8 6" />
    </svg>
  );
}

export default function DeliveryAnimation() {
  const truckRef = useRef(null);

  return (
    <section className="py-14 sm:py-20 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="chip bg-accent/40 text-primary mb-3">شحن موثوق</span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold">نوصل <span className="text-grad-violet">بعناية</span> لكل مكان</h2>
          <p className="text-foreground/60 text-sm mt-2 max-w-md mx-auto">شحن سريع لجميع مناطق المملكة والخليج — تتبع شحنتك لحظة بلحظة</p>
        </div>

        {/* منطقة الأنيميشن */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-secondary/50 to-card border border-border" style={{ height: 180 }}>
          {/* السماء والغيوم */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 right-16 w-20 h-8 bg-white/50 rounded-full blur-sm" />
            <div className="absolute top-6 right-10 w-12 h-6 bg-white/40 rounded-full blur-sm" />
            <div className="absolute top-3 left-20 w-24 h-8 bg-white/40 rounded-full blur-sm" />
            <div className="absolute top-5 left-14 w-14 h-6 bg-white/30 rounded-full blur-sm" />
          </div>

          {/* الطريق */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-300/30 to-slate-400/40">
            <div className="absolute top-4 left-0 right-0 h-1 flex gap-4 px-4">
              {Array.from({length: 20}).map((_, i) => (
                <div key={i} className="flex-1 h-full rounded-full bg-white/40" />
              ))}
            </div>
          </div>

          {/* السيارة المتحركة */}
          <div className="absolute bottom-14 car-drive" style={{ width: 220, left: -230 }}>
            <SportsCar />
          </div>

          {/* شارات المعلومات */}
          <div className="absolute top-4 right-4 coin-bounce">
            <div className="bg-primary text-primary-foreground rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <div>
                <p className="opacity-80 text-[10px]">توصيل خلال</p>
                <p className="font-bold">2-5 أيام</p>
              </div>
            </div>
          </div>

          <div className="absolute top-4 left-4 coin-bounce" style={{ animationDelay: '0.6s' }}>
            <div className="bg-card border border-border rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-foreground/55 text-[10px]">التوصيل إلى</p>
                <p className="font-bold text-foreground">جميع المناطق</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-xs text-foreground/50 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              تغليف آمن — تسليم محترف — تتبع الشحنة
            </p>
          </div>
        </div>

        {/* مزايا الشحن */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: '📦', title: 'تغليف فاخر', sub: 'حماية كاملة للمنتج' },
            { icon: '🚚', title: 'شحن سريع', sub: 'لجميع مناطق المملكة' },
            { icon: '📍', title: 'تتبع مباشر', sub: 'تعرف على موقع طلبك' },
          ].map(b => (
            <div key={b.title} className="card-soft p-4 text-center">
              <div className="text-2xl mb-1">{b.icon}</div>
              <p className="font-bold text-sm">{b.title}</p>
              <p className="text-xs text-foreground/55 mt-0.5">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}