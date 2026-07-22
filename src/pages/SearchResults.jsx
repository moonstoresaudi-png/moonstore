import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { entities } from '@/api/entities';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { Search, PackageX } from 'lucide-react';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!q) { setResults([]); return; }
    setResults(null);
    entities.Product.list('-created_date', 100)
      .then(all => setResults(all.filter(p => p.name?.includes(q) || p.description?.includes(q) || p.category?.includes(q))))
      .catch(() => setResults([]));
  }, [q]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-extrabold flex items-center gap-2"><Search className="w-6 h-6 text-primary" /> نتائج البحث</h1>
          <p className="text-sm text-foreground/55 mt-1">البحث عن: <span className="font-medium text-primary">"{q}"</span></p>
        </div>

        {!results ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl bg-secondary/60 animate-pulse" />)}</div>
        ) : results.length === 0 ? (
          <div className="card-soft p-12 text-center">
            <PackageX className="w-14 h-14 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60">لا توجد منتجات مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}