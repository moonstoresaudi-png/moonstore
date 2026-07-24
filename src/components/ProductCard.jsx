import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  return (
    <Link to={`/product/${product.id}`} className="group card-soft overflow-hidden flex flex-col relative">
      {discount > 0 && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">
          خصم {discount}%
        </span>
      )}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={e => { e.preventDefault(); addItem(product); }}
          className="absolute bottom-3 left-3 right-3 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold flex items-center justify-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
        >
          <Plus className="w-4 h-4" /> أضف للسلة
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {product.rating > 0 && (
          <div className="flex items-center gap-0.5 mb-1.5" onClick={e => e.preventDefault()}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-foreground/15'}`} />
            ))}
          </div>
        )}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5em]">{product.name}</h3>
        {product.category && <p className="text-[11px] text-foreground/45 mt-1">{product.category}</p>}

        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="text-primary font-heading font-extrabold text-lg">{product.price}</span>
          <span className="text-primary/70 text-xs font-medium -mr-1">ر.س</span>
          {product.old_price && <span className="text-foreground/35 text-xs line-through">{product.old_price} ر.س</span>}
        </div>
      </div>
    </Link>
  );
}
