import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import ProductCard from '@/components/ProductCard';
import { Package } from 'lucide-react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    entities.Product.filter({ bestseller: true }, '-created_date', 12)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  return (
    <section id="bestsellers" className="py-14 sm:py-20 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <p className="text-primary text-xs font-bold tracking-widest mb-2">الأكثر مبيعاً</p>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold">الأكثر <span className="text-grad-violet">طلباً</span></h2>
          </div>
          <a href="#categories" className="text-sm text-primary font-medium hover:opacity-70">عرض الكل</a>
        </div>

        {products === null ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-secondary animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="card-soft p-10 text-center text-foreground/50">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            لا توجد منتجات "الأكثر مبيعاً" بعد — أضِفها من لوحة التحكم.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
