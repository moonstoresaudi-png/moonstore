import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { LengthSVG, ChestWidthSVG } from '@/components/MeasurementDiagrams';
import { Ruler, Info, ArrowLeft } from 'lucide-react';

// محيط الصدر حسب المقاس — من دليل القياس الرسمي لمتجر مون (طريقة القياس)
const JACKET_CHEST_BY_SIZE = [
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

// الأطوال المتاحة بالسنتيمتر (من أعلى الكتف إلى نهاية الجاكيت) — من نفس الدليل الرسمي
const JACKET_LENGTH_OPTIONS_CM = [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];

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

        {/* الرسومات التعليمية */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card-soft overflow-hidden">
            <div className="bg-gradient-to-b from-purple-50 to-white p-5 flex items-center justify-center" style={{ minHeight: 220 }}>
              <LengthSVG endLabel="الجاكيت" />
            </div>
            <div className="p-3.5 border-t border-border bg-red-50/50">
              <p className="font-bold text-sm text-red-600">📏 الطول</p>
              <p className="text-xs text-foreground/60 mt-1 leading-relaxed">يؤخذ من أعلى الكتف إلى نهاية الجاكيت</p>
            </div>
          </div>
          <div className="card-soft overflow-hidden">
            <div className="bg-gradient-to-b from-green-50 to-white p-5 flex items-center justify-center" style={{ minHeight: 220 }}>
              <ChestWidthSVG />
            </div>
            <div className="p-3.5 border-t border-border bg-green-50/50">
              <p className="font-bold text-sm text-green-700">📏 العرض (الصدر)</p>
              <p className="text-xs text-foreground/60 mt-1 leading-relaxed">يؤخذ من عرض الجاكيت — من الأمام فقط — من الإبط الأيمن إلى الإبط الأيسر</p>
            </div>
          </div>
        </div>

        {/* جدول محيط الصدر حسب المقاس */}
        <div className="card-soft overflow-hidden mb-6">
          <div className="bg-foreground text-background text-center py-3">
            <p className="font-heading font-extrabold text-base flex items-center justify-center gap-2">
              <Ruler className="w-4 h-4" /> محيط الصدر حسب المقاس
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="bg-primary/10 text-primary border-b-2 border-primary/20">
                  {JACKET_CHEST_BY_SIZE.map(r => <th key={r.size} className="p-2.5 font-bold">{r.size}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {JACKET_CHEST_BY_SIZE.map((r, i) => (
                    <td key={r.size} className={`p-2.5 text-xs ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}`}>{r.chest}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 text-center border-t border-border">
            <span className="text-xs text-foreground/50">جميع القياسات بالأنش (inch)</span>
          </div>
        </div>

        {/* جدول الأطوال المتاحة */}
        <div className="card-soft overflow-hidden mb-8">
          <div className="bg-foreground text-background text-center py-3">
            <p className="font-heading font-extrabold text-base flex items-center justify-center gap-2">
              <Ruler className="w-4 h-4" /> الأطوال المتاحة (بالسنتيمتر)
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <tbody>
                <tr className="border-b border-border/50">
                  {JACKET_LENGTH_OPTIONS_CM.slice(0, 8).map((cm, i) => (
                    <td key={cm} className={`p-2.5 font-bold ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}`}>{cm}</td>
                  ))}
                </tr>
                <tr>
                  {JACKET_LENGTH_OPTIONS_CM.slice(8).map((cm, i) => (
                    <td key={cm} className={`p-2.5 font-bold ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}`}>{cm}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 text-center border-t border-border">
            <span className="text-xs text-foreground/50">طول الجاكيت (من أعلى الكتف إلى النهاية) — بالسنتيمتر</span>
          </div>
        </div>

        <div className="card-soft p-5 flex items-start gap-3 bg-accent/20 mb-8">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/70 leading-relaxed space-y-2">
            <p><span className="font-bold">الطول:</span> يؤخذ من أعلى الكتف إلى نهاية الجاكيت.</p>
            <p><span className="font-bold">العرض (الصدر):</span> يؤخذ من عرض الجاكيت — من الأمام فقط — من الإبط الأيمن إلى الإبط الأيسر.</p>
            <p className="text-xs text-foreground/50 pt-1">لو رقمك بين مقاسين، اختر المقاس الأكبر لراحة أكثر. لو غير متأكد من مقاسك، اكتب طولك بالسم عند الطلب وبنساعدك نتأكد إنه مناسب.</p>
          </div>
        </div>

        {/* الصورة الرسمية الكاملة لدليل القياس */}
        <div className="card-soft overflow-hidden mb-8">
          <div className="bg-secondary/40 text-center py-2.5">
            <p className="text-xs font-medium text-foreground/60">الدليل الرسمي الكامل — بطاقة القياس</p>
          </div>
          <img src="/images/robe-measurement-guide.png" alt="دليل قياس الجاكيتات - متجر مون" className="w-full object-contain" />
        </div>

        <div className="text-center">
          <a href="/size-guide" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            تدور على دليل مقاسات أرواب التخرج؟ <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
