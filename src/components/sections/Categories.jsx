import React from 'react';
import { Link } from 'react-router-dom';

// فئات بصور حقيقية (منتجاتنا)
const photoCategories = [
  {
    name: 'جاكيت تخرج',
    sub: 'Senior Jacket',
    img: '/images/products/senior-jacket/front.jpg',
    wide: true,
    to: '/shop?category=جاكيت تخرج',
  },
  {
    name: 'أوشحة تخرج',
    sub: 'Graduation Sashes',
    img: '/images/products/sash/view1.webp',
    wide: true,
    to: '/shop?category=أوشحة تخرج',
  },
  {
    name: 'كاب تخرج',
    sub: 'Graduation Cap',
    img: '/images/products/cap/view1.webp',
    wide: false,
    to: '/shop?category=كاب تخرج',
  },
];

// فئات بدون صورة جاهزة بعد — تصميم متدرج بهوية العلامة بدل صور عشوائية
const brandCategories = [
  { name: 'أرواب تخرج', sub: 'Graduation Robes', to: '/shop?category=أرواب تخرج' },
  { name: 'كوفلة مواليد', sub: 'Newborn', to: '/shop?category=كوفلة مواليد' },
  { name: 'تسوّق الكل', sub: 'All Products', to: '/shop' },
];

function BrandCard({ name, sub, to }) {
  return (
    <Link to={to} className="group relative overflow-hidden rounded-2xl block border border-transparent hover:border-[hsl(var(--gold)/0.5)] transition-colors">
      <div
        className="relative aspect-square flex flex-col items-center justify-center text-center px-3"
        style={{ background: 'linear-gradient(150deg, hsl(310 34% 24%), hsl(310 40% 14%))' }}
      >
        <img src="/images/brand/logo.png" alt="" className="absolute inset-0 m-auto w-24 h-24 object-contain opacity-[0.08] group-hover:opacity-[0.14] transition-opacity" />
        <p className="relative text-white/50 text-[10px] uppercase tracking-wide mb-1">{sub}</p>
        <h3 className="relative font-display font-bold text-white text-base sm:text-lg">{name}</h3>
        <span className="relative mt-2 text-[11px] text-[hsl(40_60%_75%)] opacity-0 group-hover:opacity-100 transition-opacity tracking-wide">تسوّق الآن ←</span>
      </div>
    </Link>
  );
}

function PhotoCard({ c, wide }) {
  return (
    <Link to={c.to} className="group relative overflow-hidden rounded-2xl block border border-transparent hover:border-[hsl(var(--gold)/0.5)] transition-colors">
      <div className={`relative ${wide ? 'h-[160px] sm:h-[220px]' : 'aspect-square'}`}>
        <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <img src="/images/brand/logo.png" alt="" className="absolute top-3 left-3 h-7 w-auto object-contain opacity-80" />
        <div className={`absolute bottom-0 inset-x-0 flex items-end justify-between ${wide ? 'p-4 sm:p-6' : 'p-3'}`}>
          <div>
            <p className={`text-white/60 uppercase tracking-wider ${wide ? 'text-xs' : 'text-[10px]'}`}>{c.sub}</p>
            <h3 className={`font-display font-bold text-white ${wide ? 'text-2xl sm:text-3xl' : 'text-base'}`}>{c.name}</h3>
          </div>
          {wide && (
            <span className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium border border-white/25 opacity-0 group-hover:opacity-100 transition-all">تسوّق الآن</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Categories() {
  return (
    <section id="categories" className="section-py">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <p className="kicker justify-center mb-3">Graduation Packages</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">بكجات <span className="text-grad-violet">التخرج</span></h2>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
          {photoCategories.filter(c => c.wide).map(c => <PhotoCard key={c.name} c={c} wide />)}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {photoCategories.filter(c => !c.wide).map(c => <PhotoCard key={c.name} c={c} />)}
          {brandCategories.map(c => <BrandCard key={c.name} {...c} />)}
        </div>
      </div>
    </section>
  );
}
