import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Ruler } from 'lucide-react';

// دليل مقاسات الجاكيتات — الجداول القديمة حُذفت بطلب صاحب المتجر (مقاسات جديدة قادمة)
export default function JacketSizeGuide() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
        <span className="kicker justify-center mb-4"><Ruler className="w-3.5 h-3.5" /> دليل القياسات</span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">دليل مقاسات الجاكيتات</h1>
        <div className="card-soft p-10 mt-8">
          <Ruler className="w-8 h-8 text-primary/50 mx-auto mb-3" />
          <p className="text-sm text-foreground/60">جدول المقاسات قيد التحديث حاليًا — راجعنا قريبًا.</p>
          <p className="text-xs text-foreground/45 mt-1">لأي استفسار عن المقاس المناسب لك، تواصل معنا مباشرة عبر واتساب.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
