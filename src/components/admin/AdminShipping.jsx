import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { supabase } from '@/lib/supabaseClient';
import { Truck, Printer, RefreshCw, AlertTriangle, CheckCircle2, Clock, PackageSearch } from 'lucide-react';

const AWB_STATUS = {
  not_shipped: { label: 'لم تُصدر بعد', cls: 'bg-gray-100 text-gray-600', icon: Clock },
  processing: { label: 'جارٍ الإصدار', cls: 'bg-amber-100 text-amber-700', icon: RefreshCw },
  shipped: { label: 'تم الإصدار', cls: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  failed: { label: 'فشل الإصدار', cls: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

const FILTERS = [
  { key: 'all', label: 'الكل' },
  { key: 'shipped', label: 'صدرت' },
  { key: 'failed', label: 'فشلت' },
  { key: 'not_shipped', label: 'لم تُصدر' },
];

export default function AdminShipping() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState('all');
  const [issuingId, setIssuingId] = useState(null);

  const load = () => entities.Order.list('-created_date', 300).then(setOrders).catch(() => setOrders([]));
  useEffect(() => { load(); }, []);

  const issueShipment = async (id) => {
    setIssuingId(id);
    setOrders(prev => prev ? prev.map(o => o.id === id ? { ...o, awb_status: 'processing' } : o) : prev);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-shipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ order_id: id }),
      });
    } catch { /* الحالة النهائية تُقرأ بعد إعادة التحميل */ }
    load();
    setIssuingId(null);
  };

  const eligible = (orders || []).filter(o => o.status !== 'pending' && o.status !== 'archived');
  const filtered = filter === 'all' ? eligible : eligible.filter(o => (o.awb_status || 'not_shipped') === filter);

  const counts = React.useMemo(() => {
    const c = { all: eligible.length, shipped: 0, failed: 0, not_shipped: 0 };
    eligible.forEach(o => { const s = o.awb_status || 'not_shipped'; if (c[s] !== undefined) c[s]++; });
    return c;
  }, [eligible]);

  return (
    <div>
      <h3 className="font-bold flex items-center gap-2 mb-1"><Truck className="w-5 h-5 text-primary" /> بوليصات الشحن (Tryoto)</h3>
      <p className="text-sm text-foreground/55 mb-4">تصدر تلقائيًا فور تأكيد أي دفع أونلاين — تقدر تطبع أو تعيد المحاولة من هنا لأي طلب.</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.key ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-foreground/60 hover:bg-secondary'}`}>
            {f.label} ({counts[f.key] ?? 0})
          </button>
        ))}
      </div>

      {!orders ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card-soft p-10 text-center text-foreground/50"><PackageSearch className="w-10 h-10 mx-auto mb-3 opacity-40" />لا توجد طلبات بهذا التصنيف</div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(o => {
            const st = AWB_STATUS[o.awb_status || 'not_shipped'];
            const StIcon = st.icon;
            return (
              <div key={o.id} className="card-soft p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">{o.customer_name} <span className="text-foreground/40 font-normal">#{o.order_number || o.id.slice(-6)}</span></p>
                  <p className="text-xs text-foreground/50 truncate">{o.city} • {o.product_name}</p>
                  {o.shipping_error && o.awb_status === 'failed' && (
                    <p className="text-[11px] text-red-500 mt-1 truncate" title={o.shipping_error}>سبب الفشل: {o.shipping_error}</p>
                  )}
                  {o.tracking_number && <p className="text-[11px] text-foreground/45 mt-0.5">رقم التتبع: {o.tracking_number}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${st.cls}`}>
                    <StIcon className={`w-3.5 h-3.5 ${o.awb_status === 'processing' || issuingId === o.id ? 'animate-spin' : ''}`} /> {st.label}
                  </span>
                  {o.awb_url && (
                    <a href={o.awb_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20" title="طباعة البوليصة"><Printer className="w-4 h-4" /></a>
                  )}
                  {(o.awb_status === 'failed' || !o.awb_status || o.awb_status === 'not_shipped') && (
                    <button onClick={() => issueShipment(o.id)} disabled={issuingId === o.id} className="px-3 py-2 rounded-lg text-xs font-medium bg-secondary/70 hover:bg-secondary disabled:opacity-40">
                      {issuingId === o.id ? 'جارٍ...' : 'إصدار'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
