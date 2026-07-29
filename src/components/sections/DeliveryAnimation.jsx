import React, { useEffect, useRef } from 'react';
import { ShieldCheck, MapPin, Clock } from 'lucide-react';

// سيارة رياضية بشكل عصري وانسيابي
// سيارة سوبر فاخرة بتصميم إسفيني حاد منخفض (ملهم من السيارات الخارقة الإيطالية)
function SportsCar() {
  return (
    <svg viewBox="0 0 230 90" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* ظل الأرضية */}
      <ellipse cx="115" cy="78" rx="100" ry="5" fill="hsl(310 34% 28%)" opacity="0.12" />

      <defs>
        <linearGradient id="carGrad" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="hsl(45 90% 52%)" />
          <stop offset="55%" stopColor="hsl(38 85% 46%)" />
          <stop offset="100%" stopColor="hsl(30 60% 22%)" />
        </linearGradient>
        <linearGradient id="carGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dff0ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#96b9dd" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* الهيكل الإسفيني الحاد المنخفض — واجهة أمامية حادة، خط سقف منحدر */}
      <path d="M8,66 L14,62 L30,60 L46,42 C52,34 62,28 74,26 L96,23 L130,23 C144,23 156,27 166,35 L184,50 L204,52 C214,53 222,57 222,63 C222,68 218,70 212,70 L16,70 C11,70 8,68 8,66 Z" fill="url(#carGrad)" />

      {/* لمعة علوية على خط السقف */}
      <path d="M46,42 C52,34 62,28 74,26 L96,23 L130,23 C144,23 156,27 166,35" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.4" />

      {/* الزجاج الأمامي المنحدر الحاد */}
      <path d="M70,40 L82,27 C86,24 92,22 98,22 L120,22 L120,40 Z" fill="url(#carGlass)" />
      {/* الزجاج الخلفي */}
      <path d="M124,22 L142,22 C150,22 158,25 164,32 L174,40 L124,40 Z" fill="url(#carGlass)" />

      {/* فتحة سحب هواء علوية (سمة السيارات الخارقة) */}
      <path d="M122,22 L122,40" stroke="hsl(30 60% 18%)" strokeWidth="1.5" opacity="0.4" />

      {/* خط ذهبي/أسود حاد على الجسم */}
      <path d="M10,58 L220,58" stroke="hsl(310 45% 14%)" strokeWidth="2" opacity="0.55" />
      {/* فتحة تهوية جانبية زاويّة (خلف الباب) */}
      <path d="M150,48 L172,48 L164,58 L144,58 Z" fill="hsl(310 45% 14%)" opacity="0.65" />
      <path d="M154,50 L168,50" stroke="hsl(45 90% 65%)" strokeWidth="1" opacity="0.6" />

      {/* مقبض الباب البسيط */}
      <rect x="98" y="44" width="10" height="2" rx="1" fill="hsl(310 45% 14%)" opacity="0.6" />

      {/* سبويلر خلفي منخفض عريض (سمة السوبر كار) */}
      <rect x="198" y="34" width="4" height="14" rx="1.5" fill="hsl(310 45% 14%)" />
      <rect x="192" y="30" width="26" height="4.5" rx="2" fill="hsl(310 45% 14%)" />

      {/* المصباح الأمامي الحاد (شكل مثلثي رفيع) */}
      <path d="M214,52 L224,49 L224,58 L214,57 Z" fill="#FFF6D6" />
      <path d="M226,51 L236,48 L236,58 L226,56 Z" fill="#FFF3C4" opacity="0.25" />
      {/* المصباح الخلفي الرفيع */}
      <rect x="10" y="50" width="5" height="7" rx="1.5" fill="hsl(350 75% 52%)" />

      {/* الإطارات الرياضية العريضة */}
      <circle cx="58" cy="70" r="14" fill="hsl(310 40% 10%)" />
      <circle cx="58" cy="70" r="7" fill="hsl(45 80% 55%)" />
      <g stroke="hsl(310 40% 10%)" strokeWidth="1.3">
        <line x1="58" y1="64" x2="58" y2="76" />
        <line x1="52" y1="70" x2="64" y2="70" />
        <line x1="54" y1="65" x2="62" y2="75" />
        <line x1="62" y1="65" x2="54" y2="75" />
      </g>
      <circle cx="58" cy="70" r="2.5" fill="hsl(310 40% 10%)" />
      <circle cx="182" cy="70" r="14" fill="hsl(310 40% 10%)" />
      <circle cx="182" cy="70" r="7" fill="hsl(45 80% 55%)" />
      <g stroke="hsl(310 40% 10%)" strokeWidth="1.3">
        <line x1="182" y1="64" x2="182" y2="76" />
        <line x1="176" y1="70" x2="188" y2="70" />
        <line x1="178" y1="65" x2="186" y2="75" />
        <line x1="186" y1="65" x2="178" y2="75" />
      </g>
      <circle cx="182" cy="70" r="2.5" fill="hsl(310 40% 10%)" />

      {/* خطوط سرعة خلف السيارة */}
      <g opacity="0.5" stroke="hsl(310 30% 55%)" strokeWidth="2" strokeLinecap="round">
        <line x1="0" y1="48" x2="16" y2="48" />
        <line x1="0" y1="58" x2="22" y2="58" />
        <line x1="0" y1="66" x2="12" y2="66" />
      </g>

      {/* خط الحركة الأرضي */}
      <line x1="0" y1="82" x2="230" y2="82" stroke="hsl(310 15% 75%)" strokeWidth="1.5" strokeDasharray="8 6" />
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
          <div className="absolute bottom-14 car-drive" style={{ width: 230, left: -240 }}>
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