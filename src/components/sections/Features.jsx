import React from 'react';
import { Banknote, BadgeCheck, Truck } from 'lucide-react';

const features = [
  { icon: Banknote, title: 'أسعار مناسبة', bg: 'bg-green-100', color: 'text-green-600', delay: '0s' },
  { icon: BadgeCheck, title: 'جودة وتميّز', bg: 'bg-orange-100', color: 'text-orange-500', delay: '0.15s' },
  { icon: Truck, title: 'توصيل لجميع المناطق', bg: 'bg-blue-100', color: 'text-blue-600', delay: '0.3s' },
];

export default function Features() {
  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-3 gap-3 sm:gap-6">
        {features.map(f => (
          <div key={f.title} className="flex flex-col items-center text-center group animate-fade-up" style={{ animationDelay: f.delay }}>
            <div className={`w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-2xl ${f.bg} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300`}>
              <f.icon className={`w-7 h-7 sm:w-10 sm:h-10 ${f.color}`} />
            </div>
            <p className="font-bold text-sm sm:text-base" style={{ color: '#7D3C4D' }}>{f.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}