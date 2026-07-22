import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { entities } from '@/api/entities';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { Search, Package } from 'lucide-react';

const CATEGORIES = ['الكل', 'أرواب تخرج', 'وشاح تخرج', 'قبعة تخرج', 'لابكوت', 'سكراب طبي', 'مطرزات', 'كوفلة مواليد'];

export default function Shop() {
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-primary mb-1.5">Moon Store</p>
          <h1 className="font-heading text-3xl font-extrabold">المتجر</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن منتج..." className="w-full pr-11 pl-4 py-2.5 rounded-full border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${category === c ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground/60 hover:border-primary/40'}`}>{c}</button>
          ))}
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