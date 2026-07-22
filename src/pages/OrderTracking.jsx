import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { trackOrder } from '@/api/entities';
import { Search, Package, Clock, Truck, MapPin, CheckCircle2, PackageCheck } from 'lucide-react';

const STAGES = [
  { key: 'placed', label: 'تم الطلب', icon: Package, desc: 'استلمنا طلبك بنجاح' },
  { key: 'preparing', label: 'قيد التجهيز', icon: Clock, desc: 'نقوم بتجهيز طلبك بعناية' },
  { key: 'shipped', label: 'تم الشحن', icon: Truck, desc: 'طلبك في الطريق إليك' },
  { key: 'out_for_delivery', label: 'قيد التوصيل', icon: MapPin, desc: 'المندوب في طريقه إليك' },
  { key: 'delivered', label: 'تم التسليم', icon: CheckCircle2, desc: 'وصل طلبك بحالة جيدة' },
];

export default function OrderTracking() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const results = await trackOrder(query.trim());
      setOrder(results.length > 0 ? results[0] : null);
    } catch { setOrder(null); }
    setLoading(false);
  };

  const currentStageIdx = order ? STAGES.findIndex(s => s.key === (order.tracking_stage || 'placed')) : -1;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-8">
          <span className="chip bg-accent/40 text-primary mb-3">تتبع شحنتك</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold">تتبع <span className="text-grad-violet">طلبك</span></h1>
          <p className="text-foreground/60 text-sm mt-2">أدخل رقم الطلب أو رقم جوالك لمعرفة حالة الشحنة</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2.5 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="رقم الطلب أو رقم الجوال" className="w-full pr-11 pl-4 py-3.5 rounded-full border border-border bg-card focus:border-primary focus:outline-none" />
          </div>
          <button type="submit" disabled={loading} className="px-6 py-3.5 btn-primary disabled:opacity-50">تتبع</button>
        </form>

        {loading && (
          <div className="card-soft p-10 text-center"><div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin mx-auto mb-3" /><p className="text-sm text-foreground/60">جاري البحث...</p></div>
        )}

        {!loading && searched && !order && (
          <div className="card-soft p-10 text-center">
            <PackageCheck className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60">لم نعثر على طلب بهذا الرقم. تأكد من رقم الطلب أو رقم الجوال.</p>
          </div>
        )}

        {order && (
          <div className="space-y-5">
            <div className="card-soft p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-foreground/55">رقم الطلب</p>
                  <p className="font-heading font-bold text-lg text-primary">#{order.order_number || order.id.slice(-6)}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-foreground/55">تاريخ الطلب</p>
                  <p className="text-sm font-medium">{new Date(order.created_date).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border text-sm">
                <div><p className="text-xs text-foreground/50">المنتج</p><p className="font-medium truncate">{order.product_name}</p></div>
                <div><p className="text-xs text-foreground/50">الكمية</p><p className="font-medium">{order.quantity || 1}</p></div>
                {order.size && <div><p className="text-xs text-foreground/50">المقاس</p><p className="font-medium">{order.size}</p></div>}
                <div><p className="text-xs text-foreground/50">الإجمالي</p><p className="font-bold text-primary">{order.total} ر.س</p></div>
              </div>
              {order.tracking_number && <p className="text-xs text-foreground/50 mt-3">رقم الشحنة: <span className="font-mono" dir="ltr">{order.tracking_number}</span></p>}
            </div>

            {/* Tracking timeline */}
            <div className="card-soft p-6">
              <h3 className="font-bold mb-6">حالة الشحنة</h3>
              <div className="space-y-0">
                {STAGES.map((stage, idx) => {
                  const isDone = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  const isLast = idx === STAGES.length - 1;
                  return (
                    <div key={stage.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${isDone ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/40'} ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                          <stage.icon className="w-5 h-5" />
                        </div>
                        {!isLast && <div className={`w-0.5 flex-1 min-h-[36px] ${idx < currentStageIdx ? 'bg-primary' : 'bg-border'}`} />}
                      </div>
                      <div className="pb-6">
                        <p className={`font-bold text-sm ${isDone ? '' : 'text-foreground/50'}`}>{stage.label}</p>
                        <p className="text-xs text-foreground/55 mt-0.5">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.status === 'cancelled' && (
              <div className="card-soft p-5 border-r-4 border-destructive">
                <p className="font-bold text-destructive text-sm">تم إلغاء هذا الطلب</p>
                <p className="text-xs text-foreground/55 mt-1">للاستفسار، تواصل معنا عبر واتساب.</p>
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="card-soft p-10 text-center">
            <Truck className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60 text-sm">أدخل رقم طلبك لعرض حالة الشحنة</p>
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}