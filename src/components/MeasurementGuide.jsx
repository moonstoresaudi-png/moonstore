import React from 'react';
import { Ruler } from 'lucide-react';

// دليل القياس داخل صفحة المنتج — الجداول القديمة حُذفت بطلب صاحب المتجر (مقاسات جديدة قادمة)
export default function MeasurementGuide({ category = '' }) {
  return (
    <div className="space-y-4 text-center" dir="rtl">
      <div>
        <span className="chip bg-accent/40 text-primary mb-2">دليل القياس</span>
        <h3 className="font-heading text-xl font-extrabold">طريقة القياس</h3>
      </div>
      <div className="rounded-2xl bg-secondary/40 border border-border p-8">
        <Ruler className="w-8 h-8 text-primary/50 mx-auto mb-3" />
        <p className="text-sm text-foreground/60">جدول المقاسات قيد التحديث حاليًا — راجعنا قريبًا.</p>
        <p className="text-xs text-foreground/45 mt-1">لأي استفسار عن المقاس المناسب لك، تواصل معنا مباشرة عبر واتساب.</p>
      </div>
    </div>
  );
}
