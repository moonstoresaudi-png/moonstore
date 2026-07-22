import React from 'react';
import { ShieldCheck, BadgeCheck, CreditCard, Lock } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, title: 'موثّق لدى المركز السعودي للأعمال', sub: 'سجل تجاري رسمي' },
    { icon: Lock, title: 'دفع آمن 100%', sub: 'تشفير SSL كامل' },
    { icon: CreditCard, title: 'وسائل دفع متعددة', sub: 'مدى • فيزا • آبل باي • STC Pay' },
    { icon: BadgeCheck, title: 'ضمان الجودة', sub: 'إرجاع خلال 7 أيام' },
  ];
  return (
    <section className="py-10 border-y border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map(b => (
          <div key={b.title} className="flex items-center gap-3">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-accent/40 flex items-center justify-center"><b.icon className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="font-bold text-xs sm:text-sm leading-tight">{b.title}</p>
              <p className="text-xs text-foreground/55">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}