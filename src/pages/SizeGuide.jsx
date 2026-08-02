import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Ruler, Info } from 'lucide-react';

const SIZES = [
  { size: 'S', chest: '88-96', height: '155-165' },
  { size: 'M', chest: '96-104', height: '165-172' },
  { size: 'L', chest: '104-112', height: '172-178' },
  { size: 'XL', chest: '112-120', height: '178-184' },
  { size: 'XXL', chest: '120-128', height: '184-190' },
  { size: '3XL', chest: '128-136', height: '190+' },
];

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <span className="kicker justify-center mb-4"><Ruler className="w-3.5 h-3.5" /> دليل القياسات</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">دليل المقاسات</h1>
          <p className="text-foreground/60 text-sm max-w-lg mx-auto">جدول مقاسات عام للأرواب والجاكيتات — لو عندك مقاس مختلف أو غير متأكد، تواصل معنا وبنساعدك تختار الأنسب.</p>
        </div>

        <div className="card-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60">
              <tr>
                <th className="p-4 text-right font-bold">المقاس</th>
                <th className="p-4 text-right font-bold">محيط الصدر (سم)</th>
                <th className="p-4 text-right font-bold">الطول (سم)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SIZES.map(s => (
                <tr key={s.size} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-bold text-primary">{s.size}</td>
                  <td className="p-4 text-foreground/70">{s.chest}</td>
                  <td className="p-4 text-foreground/70">{s.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-soft p-5 mt-6 flex items-start gap-3 bg-accent/20">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/70 leading-relaxed">
            <p className="font-bold mb-1">كيف تقيس نفسك بدقة؟</p>
            <p>لف شريط القياس حول أوسع نقطة بصدرك (تحت الإبط مباشرة) وأنت واقف بشكل طبيعي، بدون شد الشريط. لو رقمك بين مقاسين، اختر المقاس الأكبر لراحة أكثر.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
