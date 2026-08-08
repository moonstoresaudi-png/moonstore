import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LengthSVG, ChestWidthSVG } from './MeasurementDiagrams';

// جدول مقاسات الأرواب — من دليل القياس الرسمي لمتجر مون
const ROBE_SIZE_DATA = [
  { size: 'XS', length: 25, chest: 22, shoulder: 18, sleeve: 23.5 },
  { size: 'S', length: 26, chest: 23, shoulder: 18.5, sleeve: 24 },
  { size: 'M', length: 27, chest: 24, shoulder: 19.5, sleeve: 24.5 },
  { size: 'L', length: 27.5, chest: 25, shoulder: 20, sleeve: 24.8 },
  { size: 'XL', length: 28.5, chest: 26, shoulder: 20.5, sleeve: 25.2 },
  { size: '2XL', length: 29, chest: 27, shoulder: 21, sleeve: 25.5 },
  { size: '3XL', length: 30, chest: 28, shoulder: 21.5, sleeve: 26 },
  { size: '4XL', length: 31, chest: 29, shoulder: 22.5, sleeve: 26.7 },
];

// جدول محيط الصدر للجاكيت — من دليل القياس الرسمي لمتجر مون
const JACKET_CHEST_BY_SIZE = [
  { size: 'XS', chest: '19in' }, { size: 'S', chest: '20in' }, { size: 'M', chest: '21in' },
  { size: 'L', chest: '22in' }, { size: 'XL', chest: '23in' }, { size: '2XL', chest: '24in' },
  { size: '3XL', chest: '25in' }, { size: '4XL', chest: '25in' }, { size: '5XL', chest: '26in' },
];

export default function MeasurementGuide({ category = '' }) {
  const isJacket = category.includes('جاكيت');

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
            <LengthSVG endLabel={isJacket ? 'الجاكيت' : 'الثوب'} />
          </div>
          <div className="p-3 border-t border-border bg-red-50/50">
            <p className="font-bold text-sm text-red-600">📏 الطول</p>
            <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
              يؤخذ من أعلى الكتف إلى نهاية {isJacket ? 'الجاكيت' : 'العباية أو الثوب'}
            </p>
          </div>
        </div>

        <div className="card-soft overflow-hidden">
          <div className="bg-gradient-to-b from-green-50 to-white p-4 flex items-center justify-center" style={{ minHeight: 200 }}>
            <ChestWidthSVG />
          </div>
          <div className="p-3 border-t border-border bg-green-50/50">
            <p className="font-bold text-sm text-green-700">📏 العرض (الصدر)</p>
            <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
              يؤخذ من عرض {isJacket ? 'الجاكيت' : 'العباية أو الثوب'} — من الأمام فقط — من الإبط الأيمن إلى الإبط الأيسر
            </p>
          </div>
        </div>
      </div>

      {/* ملاحظة مهمة */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-sm font-bold text-amber-800 mb-1">⚠️ تنبيه مهم</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          الصدر يُقاس نصف المحيط فقط وليس المحيط الكامل — والعرض من الإبط الأيمن إلى الأيسر من الأمام فقط.
        </p>
      </div>

      {/* جدول المقاسات */}
      {isJacket ? (
        <div className="card-soft overflow-hidden">
          <div className="p-3 border-b border-border bg-primary/5">
            <p className="font-bold text-sm text-primary text-center">محيط الصدر حسب المقاس (بالأنش)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="bg-primary/10">
                  {JACKET_CHEST_BY_SIZE.map(r => <th key={r.size} className="px-2.5 py-2 font-bold">{r.size}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {JACKET_CHEST_BY_SIZE.map((r, i) => (
                    <td key={r.size} className={i % 2 === 0 ? 'bg-white px-2.5 py-2' : 'bg-secondary/30 px-2.5 py-2'}>{r.chest}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
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
                {ROBE_SIZE_DATA.map((r, i) => (
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
      )}

      <div className="text-center">
        <Link to={isJacket ? '/jacket-size-guide' : '/size-guide'} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
          عرض جدول المقاسات الكامل <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
