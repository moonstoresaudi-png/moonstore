import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, Heart, Eye } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  return (
    <Link to={`/product/${product.id}`} className="group card-soft overflow-hidden flex flex-col relative">
      {/* شارة الزاوية */}
      {(discount > 0 || product.bestseller) && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold shadow-sm">
          {discount > 0 ? `خصم ${discount}%` : 'الأكثر مبيعاً'}
        </span>
      )}

      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* أزرار عائمة: مفضلة + معاينة سريعة */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <button onClick={e => e.preventDefault()} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-primary hover:bg-white shadow-sm" aria-label="أضف للمفضلة">
            <Heart className="w-4 h-4" />
          </button>
          <button onClick={e => e.preventDefault()} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-primary hover:bg-white shadow-sm" aria-label="معاينة سريعة">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* التقييم */}
        {product.rating > 0 && (
          <span className="absolute bottom-3 right-3 bg-white/90 rounded-full px-2.5 py-1 text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {product.rating}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5em]">{product.name}</h3>
        {product.category && <p className="text-[11px] text-foreground/45 mt-1">{product.category}</p>}

        <div className="mt-2 pt-1 flex items-baseline gap-2">
          <span className="text-primary font-display font-bold text-lg">{product.price}</span>
          <span className="text-primary/70 text-xs font-medium -mr-1">ر.س</span>
          {product.old_price && <span className="text-foreground/35 text-xs line-through">{product.old_price} ر.س</span>}
        </div>

        <button
          onClick={e => { e.preventDefault(); addItem(product); }}
          className="mt-3 w-full py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> أضف للسلة
        </button>
      </div>
    </Link>
  );
}
