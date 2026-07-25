import React from 'react';
import { Award, Heart, Sparkles } from 'lucide-react';

export default function BrandStory() {
  return (
    <section id="about" className="section-py">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* صورة داخل إطار قوس بأسلوب Pinterest */}
        <div className="relative order-2 lg:order-1 flex items-center justify-center">
          <div
            className="relative w-full max-w-sm overflow-hidden"
            style={{
              aspectRatio: '3/4',
              borderRadius: '160px 160px 24px 24px',
              background: 'linear-gradient(160deg, hsl(350 45% 88%), hsl(350 40% 78%))',
            }}
          >
            <img src="/images/products/senior-jacket/front.jpg" alt="Moon Store" className="w-full h-full object-cover" style={{ objectPosition: 'top' }} />
          </div>
          {/* نقاط زخرفية */}
          <div className="hidden sm:flex flex-col gap-2.5 absolute left-0 top-1/3">
            <span className="w-4 h-4 rounded-full" style={{ background: 'hsl(var(--gold))' }} />
            <span className="w-4 h-4 rounded-full bg-primary" />
            <span className="w-4 h-4 rounded-full" style={{ background: 'hsl(310 40% 14%)' }} />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="kicker mb-4">من نحن</p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold mb-5 flex items-center gap-2 flex-wrap">قصة <img src="/images/brand/logo.png" alt="Moon Store" className="h-12 sm:h-16 w-auto object-contain inline-block" /></h2>
          <p className="text-foreground/70 leading-relaxed mb-4">بدأت رحلتنا من شغف بتفاصيل التخرج؛ نؤمن أن يوم التخرج ليس مجرد مناسبة، بل لحظة تستحق أن تُتألق بأرقى الخامات. نختار أقمشتنا بعناية، ونطريز كل قطعة بخيوط ذهبية يدوياً.</p>
          <p className="text-foreground/70 leading-relaxed mb-7">من أرواب التخرج إلى الأوشحة والطواقي والبذلات الطبية — كل قطعة تحمل توقيع <span className="text-primary font-bold">MS</span> للجودة والفخامة.</p>
          <div className="grid grid-cols-3 gap-3">
            {[{ icon: Award, n: '+5000', l: 'عميل سعيد' }, { icon: Heart, n: '+8', l: 'سنوات خبرة' }, { icon: Sparkles, n: '100%', l: 'تطريز يدوي' }].map(s => (
              <div key={s.l} className="card-soft p-4 text-center">
                <s.icon className="w-6 h-6 text-primary mx-auto mb-1.5" />
                <div className="font-display font-bold text-xl text-primary">{s.n}</div>
                <div className="text-xs text-foreground/55">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
