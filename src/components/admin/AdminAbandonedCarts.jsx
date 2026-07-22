import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { sendEmail } from '@/api/email';
import { useStoreSettings } from '@/lib/SettingsContext';
import { ShoppingCart, Mail, Trash2, Clock } from 'lucide-react';

export default function AdminAbandonedCarts() {
  const { settings } = useStoreSettings();
  const [orders, setOrders] = useState(null);
  const [sending, setSending] = useState(null);

  const load = () => entities.Order.filter({ status: 'pending' }).then(setOrders).catch(() => setOrders([]));
  useEffect(() => { load(); }, []);

  const sendReminder = async (order) => {
    if (!order.email) { alert('لا يوجد بريد إلكتروني لهذا العميل'); return; }
    setSending(order.id);
    try {
      await sendEmail({
        to: order.email,
        subject: `تذكير: أكمل طلبك في ${settings.store_name} 🛒`,
        body: `<div dir="rtl" style="font-family:Arial,sans-serif"><h2>مرحبًا ${order.customer_name}،</h2><p>لاحظنا أنك لم تكمل طلبك. منتجاتك لا تزال بانتظارك!</p><p>رقم الطلب: #${order.order_number || order.id.slice(-6)}</p><p>الإجمالي: ${order.total} ر.س</p><a href="${window.location.origin}" style="background:#6B4D6C;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;display:inline-block;margin-top:10px">إكمال الطلب</a></div>`,
      });
      alert('تم إرسال التذكير بنجاح');
    } catch { alert('تعذّر إرسال البريد — تأكد أنك فعّلت Supabase Edge Function (send-email)، راجع SETUP.md'); }
    setSending(null);
  };

  const remove = async (id) => {
    setOrders(prev => prev ? prev.filter(o => o.id !== id) : prev);
    try { await entities.Order.delete(id); } catch {}
  };

  return (
    <div>
      <h3 className="font-bold flex items-center gap-2 mb-4"><ShoppingCart className="w-5 h-5 text-primary" /> السلات المتروكة ({orders?.length || 0})</h3>
      <p className="text-sm text-foreground/55 mb-4">عملاء بدؤوا الطلب ولم يكملوا الدفع — أرسل لهم تذكيرًا عبر البريد الإلكتروني.</p>
      {!orders ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="card-soft p-10 text-center text-foreground/50"><ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-40" />لا توجد سلات متروكة</div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="card-soft p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{o.customer_name} <span className="text-foreground/50 font-normal" dir="ltr">— {o.phone}</span></p>
                  <p className="text-xs text-foreground/50 truncate">{o.product_name} • {o.total} ر.س • {o.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {o.email && <button onClick={() => sendReminder(o)} disabled={sending === o.id} className="px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 disabled:opacity-50"><Mail className="w-3.5 h-3.5" /> {sending === o.id ? 'جاري الإرسال...' : 'تذكير'}</button>}
                <button onClick={() => remove(o.id)} className="p-2 rounded-lg text-destructive/60 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
