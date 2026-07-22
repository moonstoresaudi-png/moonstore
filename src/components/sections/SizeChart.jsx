import React from 'react';
import { Ruler } from 'lucide-react';

const ROWS = [
  { size: '40', length: '40–102cm', chest: '37–94cm', shoulder: '14–36cm', sleeve: '18inch–46cm' },
  { size: '42', length: '42–107cm', chest: '39–100cm', shoulder: '15inch–38cm', sleeve: '19inch–48cm' },
  { size: '44', length: '44–112cm', chest: '41–104cm', shoulder: '15inch–38cm', sleeve: '19inch–48cm' },
  { size: '46', length: '46–116cm', chest: '43–110cm', shoulder: '15inch–38cm', sleeve: '20inch–51cm' },
  { size: '48', length: '48–121cm', chest: '45–114cm', shoulder: '16inch–41cm', sleeve: '20inch–51cm' },
  { size: '50', length: '50–127cm', chest: '48–122cm', shoulder: '16inch–41cm', sleeve: '20inch–51cm' },
  { size: '52', length: '52–132cm', chest: '51–130cm', shoulder: '18inch–46cm', sleeve: '22inch–56cm' },
  { size: '54', length: '54–137cm', chest: '54–137cm', shoulder: '18inch–46cm', sleeve: '22inch–56cm' },
  { size: '56', length: '56–142cm', chest: '56–142cm', shoulder: '18inch–46cm', sleeve: '23inch–58cm' },
  { size: '58', length: '58–147cm', chest: '58–147cm', shoulder: '18inch–46cm', sleeve: '24inch–61cm' },
  { size: '60', length: '60–152cm', chest: '62–158cm', shoulder: '18inch–46cm', sleeve: '26inch–66cm' },
];

const MEASURE_GUIDE_IMG = "/images/measure-guide-chest.svg";
const MEASURE_GUIDE_IMG2 = "/images/measure-guide-length.svg";

export default function SizeChart() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="chip bg-accent/40 text-primary mb-3">دليل المقاسات</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">جدول <span className="text-grad-violet">مقاسات أرواب التخرج</span></h2>
        </div>

        {/* Two-column: length & width */}
        <div className="card-soft overflow-hidden mb-8">
          <div className="bg-foreground text-background text-center py-3">
            <p className="font-heading font-extrabold text-base flex items-center justify-center gap-2"><Ruler className="w-4 h-4" /> جدول المقاسات — إناث</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="bg-primary/10 text-primary border-b-2 border-primary/20">
                  <th className="p-2.5 font-bold">المقاس</th>
                  <th className="p-2.5 font-bold">طول الروب</th>
                  <th className="p-2.5 font-bold">محيط الصدر</th>
                  <th className="p-2.5 font-bold">عرض الكتف</th>
                  <th className="p-2.5 font-bold">طول الكم</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
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
            <span className="text-xs text-foreground/50">طريقة القياس: بالأنش والسنتيمتر</span>
          </div>
        </div>

        {/* Measurement guide images */}
        <div className="text-center mb-4">
          <h3 className="font-heading font-bold text-lg mb-1">كيفية أخذ المقاسات</h3>
          <p className="text-sm text-foreground/55">اتبع الخطوات التالية لأخذ مقاسك بدقة</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card-soft overflow-hidden">
            <img src={MEASURE_GUIDE_IMG} alt="طريقة قياس محيط الصدر" className="w-full object-contain" />
            <p className="text-center text-sm font-medium py-3 text-primary">* طريقة قياس محيط الصدر</p>
          </div>
          <div className="card-soft overflow-hidden">
            <img src={MEASURE_GUIDE_IMG2} alt="طريقة قياس الطول" className="w-full object-contain" />
            <p className="text-center text-sm font-medium py-3 text-primary">* طريقة قياس الطول (يُأخذ من الكتف إلى الكعب)</p>
          </div>
        </div>
      </div>
    </section>
  );
}