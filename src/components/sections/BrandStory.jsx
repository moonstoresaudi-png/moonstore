import React from 'react';
import { Award, Heart, Sparkles } from 'lucide-react';

export default function BrandStory() {
  return (
    <section id="about" className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-4 bg-accent/30 blur-3xl rounded-full" />
          <img src="/images/brand-story.svg" alt="Moon Store" className="relative rounded-3xl w-full max-w-sm mx-auto object-cover" />
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-primary text-xs font-bold tracking-widest mb-2">من نحن</p>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold mb-5 flex items-center gap-2 flex-wrap">قصة <img src="/images/brand/logo.png" alt="Moon Store" className="h-10 sm:h-14 w-auto object-contain inline-block" /></h2>
          <p className="text-foreground/70 leading-relaxed mb-4">بدأت رحلتنا من شغف بتفاصيل التخرج؛ نؤمن أن يوم التخرج ليس مجرد مناسبة، بل لحظة تستحق أن تُتألق بأرقى الخامات. نختار أقمشتنا بعناية، ونطريز كل قطعة بخيوط ذهبية يدوياً.</p>
          <p className="text-foreground/70 leading-relaxed mb-7">من أرواب التخرج إلى الأوشحة والطواقي والبذلات الطبية — كل قطعة تحمل توقيع <span className="text-primary font-bold">MS</span> للجودة والفخامة.</p>
          <div className="grid grid-cols-3 gap-3">
            {[{ icon: Award, n: '+5000', l: 'عميل سعيد' }, { icon: Heart, n: '+8', l: 'سنوات خبرة' }, { icon: Sparkles, n: '100%', l: 'تطريز يدوي' }].map(s => (
              <div key={s.l} className="card-soft p-4 text-center">
                <s.icon className="w-6 h-6 text-primary mx-auto mb-1.5" />
                <div className="font-heading font-bold text-xl text-primary">{s.n}</div>
                <div className="text-xs text-foreground/55">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}