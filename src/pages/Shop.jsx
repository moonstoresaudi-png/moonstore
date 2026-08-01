import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { entities } from '@/api/entities';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { useStoreSettings } from '@/lib/SettingsContext';
import { Search, Package } from 'lucide-react';

export default function Shop() {
  const { settings } = useStoreSettings();
  const CATEGORIES = ['الكل', ...(settings.categories || [])];
  const { category: pathCat } = useParams();
  const [searchParams] = useSearchParams();
  const initialCat = pathCat || searchParams.get('category') || 'الكل';

  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState(initialCat);
  const [search, setSearch] = useState('');

  useEffect(() => {
    entities.Product.list('-created_date', 200).then(setProducts).catch(() => setProducts([]));
  }, []);

  const filtered = React.useMemo(() => {
    if (!products) return null;
    return products.filter(p => {
      const matchCat = category === 'الكل' || p.category === category;
      const matchSearch = !search || p.name?.includes(search) || p.description?.includes(search);
      return matchCat && matchSearch;
    });
  }, [products, category, search]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div
        className="w-full flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4"
        style={{ background: 'linear-gradient(135deg, hsl(310 34% 28%) 0%, hsl(310 40% 18%) 100%)' }}
      >
        <img src="/images/brand/logo.png" alt="Moon Store" className="h-14 sm:h-20 w-auto object-contain mb-4" />
        <p className="kicker text-white/70 mb-2">Shop the Collection</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">المتجر</h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن منتج..." className="w-full pr-11 pl-4 py-3 rounded-full border border-border bg-card shadow-sm text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {CATEGORIES.map(c => {
            const count = c === 'الكل' ? (products || []).length : (products || []).filter(p => p.category === c).length;
            return (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all inline-flex items-center gap-1.5 ${category === c ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border text-foreground/60 hover:border-primary/40'}`}>
                {c}
                {products && <span className={`text-[10px] ${category === c ? 'opacity-80' : 'opacity-50'}`}>({count})</span>}
              </button>
            );
          })}
        </div>

        {!filtered ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">{[...Array(8)].map((_, i) => <div key={i} className="h-64 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/50">لا توجد منتجات في هذا القسم حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}