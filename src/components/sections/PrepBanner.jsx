import React from 'react';
import { Clock, Shirt, Sparkles, CalendarClock } from 'lucide-react';

export default function PrepBanner() {
  return (
    <div className="bg-gradient-to-l from-primary via-violet to-pink-deep text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-medium">
          <Shirt className="w-4 h-4 flex-shrink-0" />
          <span>جاكت السينور: 30-45 يوم</span>
        </div>
        <span className="text-white/40">•</span>
        <div className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-medium">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>أرواب التخرج: 7-14 يوم</span>
        </div>
        <span className="text-white/40">•</span>
        <div className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-medium">
          <CalendarClock className="w-4 h-4 flex-shrink-0" />
          <span>فترة الموسم تختلف مدة التجهيز</span>
        </div>
        <span className="text-white/40 hidden sm:inline">•</span>
        <div className="hidden sm:flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-bold">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>التوصيل 2-5 أيام</span>
        </div>
      </div>
    </div>
  );
}