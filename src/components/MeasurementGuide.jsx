import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ruler } from 'lucide-react';
import { LengthSVG, ChestWidthSVG } from './MeasurementDiagrams';
import { JACKET_SIZE_DATA } from '@/pages/JacketSizeGuide';

export default function MeasurementGuide({ category = '' }) {
  const isJacket = category.includes('جاكيت');

  // الروب/غيره: الجداول القديمة حُذفت بطلب صاحب المتجر لحين وصول مقاسات جديدة
  if (!isJacket) {
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

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center">
        <span className="chip bg-accent/40 text-primary mb-2">دليل القياس</span>
        <h3 className="font-heading text-xl font-extrabold">طريقة القياس</h3>
        <p className="text-sm text-foreground/55 mt-1">جميع القياسات بالأنش (inch)</p>
      </div>

      {/* الرسومات التعليمية */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-soft overflow-hidden">
          <div className="bg-gradient-to-b from-purple-50 to-white p-4 flex items-center justify-center" style={{ minHeight: 200 }}>
            <LengthSVG endLabel="الجاكيت" />
          </div>
          <div className="p-3 border-t border-border bg-red-50/50">
            <p className="font-bold text-sm text-red-600">📏 الطول</p>
            <p className="text-xs text-foreground/60 mt-1 leading-relaxed">يؤخذ من أعلى الكتف إلى نهاية الجاكيت</p>
          </div>
        </div>

        <div className="card-soft overflow-hidden">
          <div className="bg-gradient-to-b from-green-50 to-white p-4 flex items-center justify-center" style={{ minHeight: 200 }}>
            <ChestWidthSVG />
          </div>
          <div className="p-3 border-t border-border bg-green-50/50">
            <p className="font-bold text-sm text-green-700">📏 العرض (الصدر)</p>
            <p className="text-xs text-foreground/60 mt-1 leading-relaxed">يؤخذ من عرض الجاكيت — من الأمام فقط — من الإبط الأيمن إلى الإبط الأيسر</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-sm font-bold text-amber-800 mb-1">⚠️ تنبيه مهم</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          الصدر يُقاس نصف المحيط فقط وليس المحيط الكامل — والعرض من الإبط الأيمن إلى الأيسر من الأمام فقط.
        </p>
      </div>

      {/* جدول المقاسات */}
      <div className="card-soft overflow-hidden">
        <div className="p-3 border-b border-border bg-primary/5">
          <p className="font-bold text-sm text-primary text-center">جدول القياسات (بالأنش)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="bg-primary/10">
                <th className="px-3 py-2 font-bold">المقاس</th>
                <th className="px-3 py-2 font-bold">الطول</th>
                <th className="px-3 py-2 font-bold text-[10px]">الصدر<br /><span className="font-normal text-foreground/50">نصف المحيط</span></th>
                <th className="px-3 py-2 font-bold">الكتف</th>
                <th className="px-3 py-2 font-bold">الكم</th>
              </tr>
            </thead>
            <tbody>
              {JACKET_SIZE_DATA.map((r, i) => (
                <tr key={r.size} className={i % 2 === 0 ? 'bg-white' : 'bg-secondary/30'}>
                  <td className="px-3 py-2 font-bold text-primary">{r.size}</td>
                  <td className="px-3 py-2">{r.length}</td>
                  <td className="px-3 py-2">{r.chest}</td>
                  <td className="px-3 py-2">{r.shoulder}</td>
                  <td className="px-3 py-2">{r.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center">
        <Link to="/jacket-size-guide" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
          عرض جدول المقاسات الكامل <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
