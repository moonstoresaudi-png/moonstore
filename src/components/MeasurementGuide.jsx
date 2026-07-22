import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// رسم SVG: الطول من أعلى الكتف إلى نهاية العباية / الثوب
function LengthSVG() {
  return (
    <svg viewBox="0 0 160 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* ظل الجسم / العباية */}
      <ellipse cx="80" cy="38" rx="20" ry="22" fill="#2a1a3a" opacity="0.85"/>
      <path d="M55,58 Q48,65 46,240 L114,240 Q112,65 105,58 Z" fill="#1a0a2a" opacity="0.85"/>
      {/* العباية فضفاضة */}
      <path d="M46,240 Q58,248 80,248 Q102,248 114,240 L114,240 L46,240 Z" fill="#1a0a2a" opacity="0.85"/>
      {/* خط الطول الأحمر */}
      <line x1="80" y1="16" x2="80" y2="248" stroke="#e74c3c" strokeWidth="2.5"/>
      {/* سهم أعلى (الكتف) */}
      <polygon points="80,12 75,20 85,20" fill="#e74c3c"/>
      {/* سهم أسفل (الثوب) */}
      <polygon points="80,252 75,244 85,244" fill="#e74c3c"/>
      {/* تسمية */}
      <rect x="10" y="110" width="52" height="36" rx="8" fill="#e74c3c" opacity="0.9"/>
      <text x="36" y="125" textAnchor="middle" fill="white" fontSize="8" fontFamily="Cairo,sans-serif" fontWeight="bold">الطول من</text>
      <text x="36" y="137" textAnchor="middle" fill="white" fontSize="7" fontFamily="Cairo,sans-serif">أعلى الكتف</text>
      <text x="36" y="148" textAnchor="middle" fill="white" fontSize="7" fontFamily="Cairo,sans-serif">لنهاية الثوب</text>
    </svg>
  );
}

// رسم SVG: العرض من الإبط الأيمن إلى الإبط الأيسر (نصف المحيط)
function ChestWidthSVG() {
  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* ظل الجسم */}
      <ellipse cx="100" cy="35" rx="20" ry="22" fill="#2a1a3a" opacity="0.85"/>
      <path d="M72,55 Q65,62 63,190 L137,190 Q135,62 128,55 Z" fill="#1a0a2a" opacity="0.85"/>
      {/* ذراعان */}
      <path d="M72,55 Q52,58 46,80 L58,85 Q62,68 74,62 Z" fill="#1a0a2a" opacity="0.8"/>
      <path d="M128,55 Q148,58 154,80 L142,85 Q138,68 126,62 Z" fill="#1a0a2a" opacity="0.8"/>

      {/* خط العرض - من إبط أيمن لإبط أيسر */}
      <line x1="60" y1="78" x2="140" y2="78" stroke="#2ecc71" strokeWidth="2.5" strokeDasharray="5 3"/>
      {/* سهم أيمن */}
      <polygon points="58,78 66,74 66,82" fill="#2ecc71"/>
      {/* سهم أيسر */}
      <polygon points="142,78 134,74 134,82" fill="#2ecc71"/>
      {/* نقاط الإبط */}
      <circle cx="60" cy="78" r="4" fill="#2ecc71"/>
      <circle cx="140" cy="78" r="4" fill="#2ecc71"/>

      {/* تسمية */}
      <rect x="52" y="155" width="96" height="44" rx="8" fill="#2ecc71" opacity="0.95"/>
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="9" fontFamily="Cairo,sans-serif" fontWeight="bold">العرض</text>
      <text x="100" y="183" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Cairo,sans-serif">من الإبط الأيمن</text>
      <text x="100" y="194" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Cairo,sans-serif">إلى الإبط الأيسر</text>
      <text x="100" y="205" textAnchor="middle" fill="#e0ffe0" fontSize="7" fontFamily="Cairo,sans-serif">(من الأمام فقط)</text>
    </svg>
  );
}

// جدول المقاسات من الصورة المرفقة بالضبط
const SIZE_DATA = [
  { size: 'XS', length: 25, chest: 22, shoulder: 18, sleeve: 23.5 },
  { size: 'S',  length: 26, chest: 23, shoulder: 18.5, sleeve: 24 },
  { size: 'M',  length: 27, chest: 24, shoulder: 19.5, sleeve: 24.5 },
  { size: 'L',  length: 27.5, chest: 25, shoulder: 20, sleeve: 24.8 },
  { size: 'XL', length: 28.5, chest: 26, shoulder: 20.5, sleeve: 25.2 },
  { size: '2XL', length: 29, chest: 27, shoulder: 21, sleeve: 25.5 },
  { size: '3XL', length: 30, chest: 28, shoulder: 21.5, sleeve: 26 },
  { size: '4XL', length: 31, chest: 29, shoulder: 22.5, sleeve: 26.7 },
];

export default function MeasurementGuide() {
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
          <div className="bg-gradient-to-b from-purple-50 to-white p-4 flex items-center justify-center" style={{minHeight: 200}}>
            <LengthSVG />
          </div>
          <div className="p-3 border-t border-border bg-red-50/50">
            <p className="font-bold text-sm text-red-600">📏 الطول</p>
            <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
              يؤخذ من أعلى الكتف إلى نهاية العباية أو الثوب
            </p>
          </div>
        </div>

        <div className="card-soft overflow-hidden">
          <div className="bg-gradient-to-b from-green-50 to-white p-4 flex items-center justify-center" style={{minHeight: 200}}>
            <ChestWidthSVG />
          </div>
          <div className="p-3 border-t border-border bg-green-50/50">
            <p className="font-bold text-sm text-green-700">📏 العرض (الصدر)</p>
            <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
              يؤخذ من عرض العباية أو الثوب — من الأمام فقط — من الإبط الأيمن إلى الإبط الأيسر
            </p>
          </div>
        </div>
      </div>

      {/* ملاحظة مهمة */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-sm font-bold text-amber-800 mb-1">⚠️ تنبيه مهم</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          الصدر يُقاس نصف النصف فقط وليس المحيط الكامل — والعرض من الإبط الأيمن إلى الأيسر من الأمام فقط.
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
                <th className="px-3 py-2 font-bold text-[10px]">الصدر<br/><span className="font-normal text-foreground/50">نصف النصف</span></th>
                <th className="px-3 py-2 font-bold">الكتف</th>
                <th className="px-3 py-2 font-bold">الكم</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_DATA.map((r, i) => (
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
        <Link to="/size-chart" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
          عرض جدول المقاسات الكامل <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}