import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Ruler, Info } from 'lucide-react';

// جدول مقاسات الجاكيتات — من دليل القياس الرسمي لمتجر مون
const JACKET_ROWS = [
  { size: 'XS', length: 25, chest: 22, shoulder: 18, sleeve: 23.5 },
  { size: 'S', length: 26, chest: 23, shoulder: 18.5, sleeve: 24 },
  { size: 'M', length: 27, chest: 24, shoulder: 19.5, sleeve: 24.5 },
  { size: 'L', length: 27.5, chest: 25, shoulder: 20, sleeve: 24.8 },
  { size: 'XL', length: 28.5, chest: 26, shoulder: 20.5, sleeve: 25.2 },
  { size: '2XL', length: 29, chest: 27, shoulder: 21, sleeve: 25.5 },
  { size: '3XL', length: 30, chest: 28, shoulder: 21.5, sleeve: 26 },
  { size: '4XL', length: 31, chest: 29, shoulder: 22.5, sleeve: 26.7 },
];

export default function JacketSizeGuide() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <span className="kicker justify-center mb-4"><Ruler className="w-3.5 h-3.5" /> دليل القياسات</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">دليل مقاسات الجاكيتات</h1>
          <p className="text-foreground/60 text-sm max-w-lg mx-auto">جدول مقاسات دقيق مبني على قياسات متجرنا الفعلية — لو عندك مقاس مختلف أو غير متأكد، تواصل معنا وبنساعدك تختار الأنسب.</p>
        </div>

        <div className="card-soft overflow-hidden">
          <div className="bg-foreground text-background text-center py-3">
            <p className="font-heading font-extrabold text-base flex items-center justify-center gap-2">
              <Ruler className="w-4 h-4" /> جدول القياسات
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="bg-primary/10 text-primary border-b-2 border-primary/20">
                  <th className="p-2.5 font-bold">المقاس</th>
                  <th className="p-2.5 font-bold">الطول</th>
                  <th className="p-2.5 font-bold">الصدر<br /><span className="font-normal text-foreground/50 text-[10px]">فقط النصف وليس المحيط</span></th>
                  <th className="p-2.5 font-bold">الكتف</th>
                  <th className="p-2.5 font-bold">الكم</th>
                </tr>
              </thead>
              <tbody>
                {JACKET_ROWS.map((r, i) => (
                  <tr key={r.size} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}`}>
                    <td className="p-2.5 font-bold text-primary">{r.size}</td>
                    <td className="p-2.5 text-xs">{r.length}</td>
                    <td className="p-2.5 text-xs">{r.chest}</td>
                    <td className="p-2.5 text-xs">{r.shoulder}</td>
                    <td className="p-2.5 text-xs">{r.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-center border-t border-border">
            <span className="text-xs text-foreground/50">جميع القياسات بالأنش (inch)</span>
          </div>
        </div>

        <div className="card-soft p-5 mt-6 flex items-start gap-3 bg-accent/20">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/70 leading-relaxed">
            <p className="font-bold mb-1">كيف تقيس نفسك بدقة؟</p>
            <p>الصدر يُقاس نصف النصف فقط وليس المحيط الكامل. لف شريط القياس تحت الإبط مباشرة وأنت واقف بشكل طبيعي، بدون شد الشريط. لو رقمك بين مقاسين، اختر المقاس الأكبر لراحة أكثر.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
