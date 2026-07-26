import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'جاكيت تخرج', img: '/images/products/senior-jacket/front.jpg', to: '/shop?category=جاكيت تخرج' },
  { name: 'أوشحة تخرج', img: '/images/products/sash/view1.webp', to: '/shop?category=أوشحة تخرج' },
  { name: 'كاب تخرج', img: '/images/products/cap/view1.webp', to: '/shop?category=كاب تخرج' },
  { name: 'أرواب تخرج', img: null, to: '/shop?category=أرواب تخرج' },
  { name: 'كوفلة مواليد', img: null, to: '/shop?category=كوفلة مواليد' },
  { name: 'تسوّق الكل', img: null, to: '/shop' },
];

function CategoryCircle({ c }) {
  return (
    <Link to={c.to} className="flex flex-col items-center gap-2 group">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors shadow-sm">
        {c.img ? (
          <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(150deg, hsl(310 34% 32%), hsl(310 40% 18%))' }}>
            <img src="/images/brand/logo.png" alt="" className="w-10 h-10 object-contain opacity-70" />
          </div>
        )}
      </div>
      <span className="text-xs sm:text-sm font-medium text-foreground/75 text-center">{c.name}</span>
    </Link>
  );
}

export default function Categories() {
  return (
    <section id="categories" className="section-py">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">أقسام المتجر</h2>
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="w-8 divider-gold" />
          <img src="/images/brand/logo.png" alt="Moon Store" className="h-6 w-auto object-contain" />
          <span className="w-8 divider-gold" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-8">
          {categories.map(c => <CategoryCircle key={c.name} c={c} />)}
        </div>
      </div>
    </section>
  );
}
