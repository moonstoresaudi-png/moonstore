import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import ProductCard from '@/components/ProductCard';
import { Tag } from 'lucide-react';

export default function OffersSection() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    entities.Product.filter({ old_price: { $gt: 0 } }, '-created_date', 8)
      .then(data => setOffers(data || []))
      .catch(() => setOffers([]));
  }, []);

  if (!offers.length) return null;

  return (
    <section id="offers" className="py-14 sm:py-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="chip bg-red-100 text-red-600 mb-2">
              <Tag className="w-3 h-3" /> عروض حصرية
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold">
              أفضل <span className="text-red-500">العروض</span>
            </h2>
            <p className="text-foreground/55 text-sm mt-1">خصومات حقيقية على منتجات مختارة — لفترة محدودة</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {offers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}