import React, { useEffect, useRef } from 'react';
import { ShieldCheck, MapPin, Clock } from 'lucide-react';

// شاحنة توصيل بشكل عصري أنعم
function DeliveryTruck() {
  return (
    <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* ظل الأرضية */}
      <ellipse cx="95" cy="78" rx="80" ry="5" fill="hsl(310 34% 28%)" opacity="0.08" />

      {/* صندوق الشحن الخلفي */}
      <rect x="4" y="26" width="98" height="40" rx="14" fill="hsl(310 34% 28%)" />
      <rect x="4" y="26" width="98" height="40" rx="14" fill="url(#truckGrad)" />
      <defs>
        <linearGradient id="truckGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(310 40% 34%)" />
          <stop offset="100%" stopColor="hsl(310 40% 20%)" />
        </linearGradient>
      </defs>
      {/* شعار المتجر */}
      <image href="/images/brand/logo.png" x="24" y="34" width="58" height="24" preserveAspectRatio="xMidYMid meet" style={{ filter: 'brightness(0) invert(1)' }} opacity="0.9" />

      {/* المقصورة الأمامية */}
      <path d="M104,32 Q104,24 114,24 L138,24 Q148,24 153,34 L160,52 Q160,66 148,66 L104,66 Z" fill="hsl(40 55% 62%)" />
      {/* زجاج الكابينة */}
      <path d="M114,30 L136,30 Q142,30 145,37 L149,50 L114,50 Z" fill="#eaf4ff" opacity="0.85" />
      {/* المصباح */}
      <circle cx="157" cy="46" r="3.5" fill="#FFF3C4" />

      {/* الإطارات */}
      <circle cx="38" cy="70" r="11" fill="hsl(310 40% 14%)" />
      <circle cx="38" cy="70" r="5" fill="#ddd" />
      <circle cx="128" cy="70" r="11" fill="hsl(310 40% 14%)" />
      <circle cx="128" cy="70" r="5" fill="#ddd" />

      {/* خط الحركة */}
      <line x1="0" y1="80" x2="200" y2="80" stroke="hsl(310 15% 75%)" strokeWidth="1.5" strokeDasharray="8 6" />
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
          <div className="absolute bottom-14 truck-drive" style={{ width: 200, left: -210 }}>
            <DeliveryTruck />
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
                <p className="font-bold text-foreground">مناطق المملكة ودول الخليج</p>
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