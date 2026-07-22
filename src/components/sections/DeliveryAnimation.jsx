import React, { useEffect, useRef } from 'react';
import { ShieldCheck, MapPin, Clock } from 'lucide-react';

// سيارة توصيل SVG مسطحة واضحة
function DeliveryTruck() {
  return (
    <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* جسم الشاحنة */}
      <rect x="2" y="20" width="110" height="42" rx="6" fill="hsl(298 17% 36%)" />
      {/* علامة Moon Store على الجسم */}
      <rect x="10" y="30" width="94" height="24" rx="4" fill="white" opacity="0.15" />
      <text x="57" y="46" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fontWeight="bold" fontStyle="italic" fill="white">Moon Store</text>
      {/* المقصورة (كابينة السائق) */}
      <path d="M112,28 L145,28 Q155,28 158,38 L162,62 L112,62 Z" fill="hsl(298 17% 28%)" />
      {/* زجاج الكابينة */}
      <path d="M116,32 L140,32 Q148,32 151,40 L154,56 L116,56 Z" fill="#a8c8f8" opacity="0.6" />
      {/* الشبكة الأمامية */}
      <rect x="158" y="44" width="6" height="12" rx="2" fill="hsl(298 17% 22%)" />
      <rect x="159" y="46" width="4" height="2" rx="1" fill="white" opacity="0.4" />
      <rect x="159" y="50" width="4" height="2" rx="1" fill="white" opacity="0.4" />
      {/* المصابيح */}
      <circle cx="162" cy="42" r="3" fill="#FFF176" opacity="0.9" />
      {/* الإطارات */}
      <circle cx="35" cy="64" r="10" fill="#2a2a2a" />
      <circle cx="35" cy="64" r="6" fill="#555" />
      <circle cx="35" cy="64" r="2.5" fill="#999" />
      <circle cx="95" cy="64" r="10" fill="#2a2a2a" />
      <circle cx="95" cy="64" r="6" fill="#555" />
      <circle cx="95" cy="64" r="2.5" fill="#999" />
      <circle cx="148" cy="64" r="8" fill="#2a2a2a" />
      <circle cx="148" cy="64" r="5" fill="#555" />
      <circle cx="148" cy="64" r="2" fill="#999" />
      {/* الأرض تحت السيارة */}
      <line x1="0" y1="74" x2="200" y2="74" stroke="hsl(290 15% 70%)" strokeWidth="1.5" strokeDasharray="8 6" />
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
                <p className="font-bold text-foreground">دول الخليج 🇸🇦</p>
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