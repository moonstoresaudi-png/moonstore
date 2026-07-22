import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  return (
    <Link to={`/product/${product.id}`} className="group card-soft overflow-hidden flex flex-col hover:shadow-lg transition-shadow relative">
      {discount > 0 && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">خصم {discount}%</span>
      )}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <button onClick={() => addItem(product)} className="absolute bottom-3 left-3 right-3 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-1.5 translate-y-16 group-hover:translate-y-0 transition-transform duration-300">
          <Plus className="w-4 h-4" /> أضف للسلة
        </button>
      </div>
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-center gap-0.5 mb-1" onClick={e => e.preventDefault()}>
          {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-foreground/20'}`} />)}
        </div>
        <h3 className="font-medium text-sm leading-snug">{product.name}</h3>
        <p className="text-xs text-foreground/50 mt-0.5">{product.category}</p>
        <div className="mt-auto pt-2.5 flex items-center gap-2">
          <span className="text-primary font-heading font-bold">{product.price} ر.س</span>
          {product.old_price && <span className="text-foreground/40 text-xs line-through">{product.old_price}</span>}
        </div>
      </div>
    </Link>
  );
}