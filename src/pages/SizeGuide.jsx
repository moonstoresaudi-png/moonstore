import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Ruler, Info } from 'lucide-react';

// جدول محيط الصدر بالأنش لكل مقاس — من دليل القياس الرسمي لمتجر مون
const CHEST_BY_SIZE = [
  { size: 'XS', chest: '19in' },
  { size: 'S', chest: '20in' },
  { size: 'M', chest: '21in' },
  { size: 'L', chest: '22in' },
  { size: 'XL', chest: '23in' },
  { size: '2XL', chest: '24in' },
  { size: '3XL', chest: '25in' },
  { size: '4XL', chest: '25in' },
  { size: '5XL', chest: '26in' },
];

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <span className="kicker justify-center mb-4"><Ruler className="w-3.5 h-3.5" /> دليل القياسات</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">دليل مقاسات أرواب التخرج</h1>
          <p className="text-foreground/60 text-sm max-w-lg mx-auto">جدول مقاسات دقيق مبني على قياسات متجرنا الفعلية — لو عندك مقاس مختلف أو غير متأكد، تواصل معنا وبنساعدك تختار الأنسب.</p>
        </div>

        {/* جدول محيط الصدر */}
        <div className="card-soft overflow-hidden mb-8">
          <div className="bg-foreground text-background text-center py-3">
            <p className="font-heading font-extrabold text-base flex items-center justify-center gap-2">
              <Ruler className="w-4 h-4" /> محيط الصدر حسب المقاس
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="bg-primary/10 text-primary border-b-2 border-primary/20">
                  {CHEST_BY_SIZE.map(r => <th key={r.size} className="p-2.5 font-bold">{r.size}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {CHEST_BY_SIZE.map((r, i) => (
                    <td key={r.size} className={`p-2.5 text-xs ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}`}>{r.chest}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* الصورة الرسمية الكاملة لدليل القياس (تشمل جدول الأطوال وطريقة القياس بالتفصيل) */}
        <div className="card-soft overflow-hidden mb-8">
          <img src="/images/robe-measurement-guide.png" alt="دليل قياس أرواب التخرج - متجر مون" className="w-full object-contain" />
        </div>

        <div className="card-soft p-5 flex items-start gap-3 bg-accent/20">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/70 leading-relaxed space-y-2">
            <p><span className="font-bold">الطول:</span> يؤخذ من أعلى الكتف إلى نهاية العباية أو الثوب.</p>
            <p><span className="font-bold">العرض (الصدر):</span> يؤخذ من عرض العباية أو الثوب — من الأمام فقط — من الإبط الأيمن إلى الإبط الأيسر.</p>
            <p className="text-xs text-foreground/50 pt-1">لو رقمك بين مقاسين، اختر المقاس الأكبر لراحة أكثر.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
