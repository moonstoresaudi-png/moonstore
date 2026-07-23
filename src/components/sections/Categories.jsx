import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'أرواب تخرج',
    sub: 'Graduation Robes',
    img: 'https://ayalsa.com/wp-content/uploads/2023/09/JEDPACK.webp',
    wide: true,
    to: '/shop?category=أرواب تخرج',
  },
  {
    name: 'أوشحة تخرج',
    sub: 'Graduation Sashes',
    img: 'https://ayalsa.com/wp-content/uploads/2025/06/JedSh.webp',
    wide: true,
    to: '/shop?category=أوشحة تخرج',
  },
  {
    name: 'كاب تخرج',
    sub: 'Graduation Cap',
    img: 'https://ayalsa.com/wp-content/uploads/2023/03/capview.webp',
    wide: false,
    to: '/shop?category=قبعة تخرج',
  },
  {
    name: 'جاكيت تخرج',
    sub: 'Senior Jacket',
    img: '/images/products/senior-jacket/front.jpg',
    wide: false,
    to: '/senior-jacket',
  },
  {
    name: 'كوفلة مواليد',
    sub: 'Newborn',
    img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    wide: false,
    to: '/shop?category=كوفلة مواليد',
  },
  {
    name: 'تسوّق الكل',
    sub: 'All Products',
    img: 'https://ayalsa.com/wp-content/uploads/2023/08/cap.webp',
    wide: false,
    to: '/shop',
  },
];

export default function Categories() {
  return (
    <section id="categories" className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-primary mb-1.5">Graduation Packages</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">بكجات <span className="text-grad-violet">التخرج</span></h2>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
          {categories.filter(c => c.wide).map(c => (
            <Link key={c.name} to={c.to} className="group relative overflow-hidden rounded-2xl block">
              <div className="relative h-[140px] sm:h-[200px]">
                <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex items-end justify-between">
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-wider">{c.sub}</p>
                    <h3 className="font-heading font-extrabold text-white text-2xl sm:text-3xl">{c.name}</h3>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/30 opacity-0 group-hover:opacity-100 transition-all">تسوّق الآن</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.filter(c => !c.wide).map(c => (
            <Link key={c.name} to={c.to} className="group relative overflow-hidden rounded-2xl block">
              <div className="relative aspect-square">
                <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <p className="text-white/60 text-[10px] uppercase tracking-wide">{c.sub}</p>
                  <h3 className="font-heading font-bold text-white text-base">{c.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}