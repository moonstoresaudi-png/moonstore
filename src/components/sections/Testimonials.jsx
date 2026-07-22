import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  { name: 'مرام الغامدي', text: 'صراحة جميل جداً ماكنت متوقعة اللون يطلع حلو، الجودة مرا ممتازة والتطريز الذهبي يجنّن ✨' },
  { name: 'مها الزهراني', text: 'الروب ولا غلطة يجنّن يجنّن، ما ندمت أبداً إني طلبت من عندهم 🤍' },
  { name: 'سارة الشهراني', text: 'فخامة وشغل مرتب ومتقن، المنتج طلع أجمل مما توقعت والأسعار في متناول الجميع.' },
  { name: 'روان سعد', text: 'تفصيل مرتب ماشاء الله وتعامل كويس، يعطيهم العافية على الذوق الرفيع.' },
  { name: 'كنان الزهراني', text: 'شغلهم مره ممتاز والقماش جودته كويسة، التطريز الذهبي يعطي لمسة فخمة 🔥' },
  { name: 'بتول السادة', text: 'تاخذ العقل، جودة ونظافة وخياطة واهتمام بأدق التفاصيل، يستحق كل ريال.' },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">آراء العملاء</p>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold">ماذا قال <span className="text-gradient-gold">عملاؤنا</span></h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-gold text-gold" />)}
            <span className="text-foreground/70 text-sm mr-2">4.9 / 5 من أكثر من 5000 عميل</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="glass rounded-3xl p-6 relative hover:glass-gold transition-all duration-500">
              <Quote className="w-8 h-8 text-gold/30 mb-3" />
              <p className="text-foreground/80 text-sm leading-relaxed mb-4">{r.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />)}
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-purple-deep flex items-center justify-center text-gold font-heading font-bold">
                  {r.name.charAt(0)}
                </div>
                <span className="font-medium text-sm">{r.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}