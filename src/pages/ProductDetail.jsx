import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { entities } from '@/api/entities';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import ProductConfigurator from '@/components/ProductConfigurator';
import { ChevronLeft } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    entities.Product.get(id)
      .then(p => {
        setProduct(p);
        if (p?.category) {
          entities.Product.filter({ category: p.category }, '-created_date', 5)
            .then(items => setRelated(items.filter(r => r.id !== p.id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-foreground/60 mb-4">المنتج غير موجود</p>
          <Link to="/" className="text-primary font-medium hover:opacity-70">العودة للرئيسية</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-6">
          <Link to="/" className="hover:text-primary">الرئيسية</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link to="/shop" className="hover:text-primary">المتجر</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground/70 truncate">{product.name}</span>
        </nav>

        <ProductConfigurator product={product} />

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold mb-5">منتجات <span className="text-grad-violet">مشابهة</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}