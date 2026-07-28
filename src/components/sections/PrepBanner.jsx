import React from 'react';
import { Clock, Shirt, Sparkles, CalendarClock } from 'lucide-react';

const items = [
  { Icon: Shirt, text: 'جاكت السينور: 30-45 يوم' },
  { Icon: Sparkles, text: 'أرواب التخرج: 7-14 يوم' },
  { Icon: CalendarClock, text: 'فترة الموسم تختلف مدة التجهيز' },
  { Icon: Clock, text: 'التوصيل 2-5 أيام' },
];

function Item({ Icon, text }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-medium px-4">
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{text}</span>
      <span className="text-white/40 mr-4">•</span>
    </div>
  );
}

export default function PrepBanner() {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="bg-gradient-to-l from-primary via-violet to-pink-deep text-white overflow-hidden">
      <div className="py-2.5 prep-marquee-track">
        {doubled.map((it, i) => <Item key={i} {...it} />)}
      </div>
    </div>
  );
}