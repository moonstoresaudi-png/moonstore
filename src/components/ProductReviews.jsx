import React, { useState, useEffect } from 'react';
import { Star, Loader2, Send, MessageSquare } from 'lucide-react';
import { entities } from '@/api/entities';

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
          aria-label={`${n} نجوم`}
        >
          <Star className={`w-6 h-6 transition-colors ${(hover || value) >= n ? 'fill-amber-400 text-amber-400' : 'text-foreground/25'}`} />
        </button>
      ))}
    </div>
  );
}

function Stars({ rating, size = 'w-3.5 h-3.5' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} className={`${size} ${rating >= n ? 'fill-amber-400 text-amber-400' : 'text-foreground/20'}`} />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    entities.Review.filter({ product_id: productId, approved: true }, '-created_date', 50)
      .then(data => setReviews(data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (productId) load(); }, [productId]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !rating) {
      setError('اكتب اسمك واختر تقييمك بالنجوم قبل الإرسال');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await entities.Review.create({
        product_id: productId,
        customer_name: name.trim(),
        rating,
        comment: comment.trim() || null,
        approved: true,
      });
      setName('');
      setRating(0);
      setComment('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      load();
    } catch {
      setError('تعذّر إرسال تقييمك، حاول مرة ثانية');
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-12" id="reviews">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" /> آراء العملاء
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-foreground/60">
            <Stars rating={Math.round(avg)} />
            <span>{avg.toFixed(1)} ({reviews.length} تقييم)</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* قائمة التعليقات */}
        <div className="space-y-3 order-2 md:order-1">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-foreground/50 card-soft p-5 text-center">كن أول من يقيّم هذا المنتج ✨</p>
          ) : (
            reviews.map(r => (
              <div key={r.id} className="card-soft p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm">{r.customer_name}</span>
                  <Stars rating={r.rating} />
                </div>
                {r.comment && <p className="text-sm text-foreground/70 leading-relaxed">{r.comment}</p>}
              </div>
            ))
          )}
        </div>

        {/* نموذج إضافة تقييم */}
        <form onSubmit={handleSubmit} className="card-soft p-5 space-y-3 order-1 md:order-2 h-fit">
          <h3 className="font-bold text-sm mb-1">شاركنا رأيك بهذا المنتج</h3>
          <div>
            <label className="text-xs text-foreground/55 mb-1 block">تقييمك</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="text-xs text-foreground/55 mb-1 block">اسمك</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-foreground/55 mb-1 block">تعليقك (اختياري)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full py-2.5 btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} إرسال التقييم
          </button>
          {submitted && <p className="text-xs text-green-600 font-medium text-center">✓ شكرًا لك، تم نشر تقييمك</p>}
        </form>
      </div>
    </div>
  );
}
