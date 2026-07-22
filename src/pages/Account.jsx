import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { User, Package, LogOut, Mail, Phone, MapPin, Clock, ChevronLeft, Truck } from 'lucide-react';

export default function Account() {
  const { user, isAuthenticated, isLoadingAuth, authChecked, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authChecked) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.id) {
      entities.Order.filter({ user_id: user.id }).then(setOrders).catch(() => {});
    }
  }, [authChecked, isAuthenticated, user, navigate]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (isLoadingAuth || !authChecked) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" /></div>;
  }

  const STAGES = { placed: 'تم الطلب', preparing: 'قيد التجهيز', shipped: 'تم الشحن', out_for_delivery: 'قيد التوصيل', delivered: 'تم التسليم' };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="card-soft p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-8 h-8 text-primary" /></div>
            <div>
              <h1 className="font-heading font-bold text-xl">{user?.full_name || user?.email || 'حسابي'}</h1>
              {user?.email && <p className="text-sm text-foreground/55 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</p>}
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 inline-flex items-center gap-2"><LogOut className="w-4 h-4" /> تسجيل الخروج</button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> طلباتي ({orders.length})</h2>
          <Link to="/track-order" className="text-sm text-primary hover:opacity-70 inline-flex items-center gap-1"><Truck className="w-4 h-4" /> تتبع طلب</Link>
        </div>

        {orders.length === 0 ? (
          <div className="card-soft p-10 text-center">
            <Package className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60 mb-4">لا توجد طلبات بعد</p>
            <Link to="/" className="px-6 py-3 btn-primary inline-flex items-center gap-2"><ChevronLeft className="w-4 h-4 rotate-180" /> ابدأ التسوق</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="card-soft p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-mono font-bold text-primary text-sm">#{o.order_number || o.id.slice(-6)}</p>
                    <p className="text-xs text-foreground/50">{new Date(o.created_date).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <span className="chip bg-primary/10 text-primary">{STAGES[o.tracking_stage] || o.status}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border text-sm">
                  <div><p className="text-xs text-foreground/50">المنتج</p><p className="font-medium truncate">{o.product_name}</p></div>
                  <div><p className="text-xs text-foreground/50">الكمية</p><p className="font-medium">{o.quantity || 1}</p></div>
                  <div><p className="text-xs text-foreground/50">الإجمالي</p><p className="font-bold text-primary">{o.total} ر.س</p></div>
                  <div><p className="text-xs text-foreground/50">الحالة</p><p className="font-medium">{o.status}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}