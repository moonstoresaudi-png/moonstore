import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useCart } from '@/lib/cartContext';

const links = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'الأقسام', href: '#categories' },
  { label: 'المتجر', to: '/shop' },
  { label: 'الأكثر مبيعاً', href: '#bestsellers' },
  { label: 'بكج تخرج جامعة', to: '/university-package' },
  { label: 'جاكيت تخرج', to: '/senior-jacket' },
  { label: 'كاب تخرج', to: '/graduation-cap' },
  { label: 'وشاح تخرج', to: '/graduation-sash' },
  { label: 'من نحن', to: '/about' },
  { label: 'سياسة التوصيل', to: '/policies' },
  { label: 'تتبع الطلب', to: '/track-order' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const { count, setIsOpen } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) { navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`); setSearchOpen(false); setSearchQ(''); }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-white border-b border-border'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        <Logo className="py-1" />

        <ul className="hidden lg:flex items-center gap-7">
          {links.map(l => (
            <li key={l.label}>
              {l.to ? <Link to={l.to} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">{l.label}</Link> : <a href={l.href} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">{l.label}</a>}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link to="/account" className="hidden sm:flex p-2.5 rounded-full hover:bg-secondary text-foreground/60 transition-colors" aria-label="حسابي"><User className="w-5 h-5" /></Link>
          <button onClick={() => setSearchOpen(v => !v)} className="hidden sm:flex p-2.5 rounded-full hover:bg-secondary text-foreground/60 transition-colors" aria-label="بحث"><Search className="w-5 h-5" /></button>
          <button onClick={() => setIsOpen(true)} className="relative p-2.5 rounded-full hover:bg-secondary text-primary transition-colors" aria-label="السلة">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && <span className="absolute -top-0.5 -left-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">{count}</span>}
          </button>
          <button onClick={() => setMenuOpen(v => !v)} className="lg:hidden p-2.5 rounded-full hover:bg-secondary" aria-label="القائمة">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 py-3 flex flex-col border-t border-border bg-white">
          {links.map(l => (
            l.to ? <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)} className="py-2.5 text-foreground/75 hover:text-primary border-b border-border/50 last:border-0 text-sm">{l.label}</Link> : <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="py-2.5 text-foreground/75 hover:text-primary border-b border-border/50 last:border-0 text-sm">{l.label}</a>
          ))}
          <Link to="/account" onClick={() => setMenuOpen(false)} className="py-2.5 text-primary font-medium border-b border-border/50 text-sm flex items-center gap-2"><User className="w-4 h-4" /> حسابي / تسجيل الدخول</Link>
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-border bg-white px-4 sm:px-6 py-3">
          <form onSubmit={handleSearch} className="max-w-7xl mx-auto relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="ابحث عن منتج..." className="w-full pr-11 pl-4 py-2.5 rounded-full border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          </form>
        </div>
      )}
    </header>
  );
}