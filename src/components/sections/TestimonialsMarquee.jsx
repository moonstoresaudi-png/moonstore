import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { entities } from '@/api/entities';

const fallbackReviews = [
  { name: 'مرام الغامدي', text: 'صراحة جميل جداً ماكنت متوقعة اللون يطلع حلو، الجودة مرا ممتازة والتطريز الذهبي يجنّن ✨', rating: 5 },
  { name: 'مها الزهراني', text: 'الروب ولا غلطة يجنّن، ما ندمت أبداً إني طلبت من عندهم 🤍', rating: 5 },
  { name: 'سارة الشهراني', text: 'فخامة وشغل مرتب ومتقن، المنتج طلع أجمل مما توقعت والأسعار ممتازة.', rating: 5 },
  { name: 'روان سعد', text: 'تفصيل مرتب ماشاء الله وتعامل كويس، يعطيهم العافية على الذوق الرفيع.', rating: 4 },
  { name: 'كنان الزهراني', text: 'شغلهم ممتاز والقماش جودته كويسة، التطريز الذهبي يعطي لمسة فخمة 🔥', rating: 5 },
  { name: 'بتول السادة', text: 'تاخذ العقل، جودة ونظافة وخياطة واهتمام بأدق التفاصيل، يستحق كل ريال.', rating: 5 },
];

function Card({ r }) {
  return (
    <div className="w-[320px] shrink-0 card-soft p-5 mx-2">
      <Quote className="w-7 h-7 text-accent mb-2" />
      <p className="text-foreground/75 text-sm leading-relaxed mb-3 line-clamp-3">{r.text}</p>
      <div className="flex items-center gap-0.5 mb-2">{[...Array(5)].map((_, j) => <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'fill-amber-400 text-amber-400' : 'text-foreground/20'}`} />)}</div>
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{r.name.charAt(0)}</div>
        <span className="font-medium text-sm">{r.name}</span>
      </div>
    </div>
  );
}

export default function TestimonialsMarquee() {
  // نبدأ بالتقييمات الثابتة حتى ما تظهر الفقرة فاضية أثناء التحميل، ثم نستبدلها
  // بتقييمات العملاء الحقيقية (4 نجوم فأكثر) بمجرد ما توصل من قاعدة البيانات.
  const [reviews, setReviews] = useState(fallbackReviews);

  useEffect(() => {
    entities.Review.filter({ rating: { $gte: 4 } }, '-created_date', 30)
      .then(data => {
        const real = (data || [])
          .filter(r => r.comment && r.comment.trim())
          .map(r => ({ name: r.customer_name, text: r.comment, rating: r.rating }));
        // لو التقييمات الحقيقية قليلة، نكمّلها بالثابتة حتى يبقى الشريط ممتلئ ومتحرك بسلاسة
        const merged = real.length >= 6 ? real : [...real, ...fallbackReviews];
        setReviews(merged);
      })
      .catch(() => {});
  }, []);

  const doubled = [...reviews, ...reviews];
  return (
    <section id="reviews" className="section-py overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-10">
        <p className="kicker justify-center mb-3">Customer Reviews</p>
        <h2 className="font-display text-2xl sm:text-4xl font-bold">ماذا قال <span className="text-grad-violet">عملاؤنا</span></h2>
        <div className="flex items-center justify-center gap-1 mt-3">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
          <span className="text-foreground/60 text-sm mr-2">4.9 / 5 من أكثر من 5000 عميل</span>
        </div>
      </div>
      <div className="relative">
        <div className="marquee-track">
          {doubled.map((r, i) => <Card key={i} r={r} />)}
        </div>
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}