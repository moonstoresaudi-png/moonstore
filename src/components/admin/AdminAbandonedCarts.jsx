import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { sendEmail } from '@/api/email';
import { useStoreSettings } from '@/lib/SettingsContext';
import { ShoppingCart, Mail, Trash2, Clock, AlertCircle, Wallet } from 'lucide-react';

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
}

const ACTIVE_WINDOW_MIN = 15; // أقل من كذا دقيقة = لسه بيكمل الطلب، مو متروك فعليًا

export default function AdminAbandonedCarts() {
  const { settings } = useStoreSettings();
  const [orders, setOrders] = useState(null);
  const [sending, setSending] = useState(null);

  const load = () => entities.Order.filter({ status: 'pending' }, '-created_date', 200).then(setOrders).catch(() => setOrders([]));
  useEffect(() => {
    load();
    const t = setInterval(load, 60000); // تحديث تلقائي كل دقيقة
    return () => clearInterval(t);
  }, []);

  const { active, abandoned, totalValue } = React.useMemo(() => {
    if (!orders) return { active: [], abandoned: [], totalValue: 0 };
    const now = Date.now();
    const active = [], abandoned = [];
    orders.forEach(o => {
      const mins = (now - new Date(o.created_date).getTime()) / 60000;
      (mins < ACTIVE_WINDOW_MIN ? active : abandoned).push(o);
    });
    const totalValue = abandoned.reduce((s, o) => s + (o.total || 0), 0);
    return { active, abandoned, totalValue };
  }, [orders]);

  const sendReminder = async (order) => {
    if (!order.email) { alert('لا يوجد بريد إلكتروني لهذا العميل'); return; }
    setSending(order.id);
    try {
      await sendEmail({
        to: order.email,
        subject: `تذكير: أكمل طلبك في ${settings.store_name} 🛒`,
        body: `<div dir="rtl" style="font-family:Arial,sans-serif"><h2>مرحبًا ${order.customer_name}،</h2><p>لاحظنا أنك لم تكمل طلبك. منتجاتك لا تزال بانتظارك!</p><p>رقم الطلب: #${order.order_number || order.id.slice(-6)}</p><p>الإجمالي: ${order.total} \ue900</p><a href="${window.location.origin}" style="background:#6B4D6C;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;display:inline-block;margin-top:10px">إكمال الطلب</a></div>`,
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
      <h3 className="font-bold flex items-center gap-2 mb-1"><ShoppingCart className="w-5 h-5 text-primary" /> السلات المتروكة</h3>
      <p className="text-sm text-foreground/55 mb-5">عملاء بدؤوا الطلب ولم يكملوا الدفع — أرسل لهم تذكيرًا عبر البريد الإلكتروني.</p>

      {!orders ? (
        <div className="grid grid-cols-3 gap-3 mb-6">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="card-soft p-4 bg-amber-50">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center mb-2"><AlertCircle className="w-5 h-5 text-white" /></div>
            <p className="font-heading text-2xl font-extrabold text-amber-600">{abandoned.length}</p>
            <p className="text-xs text-foreground/55 mt-0.5">سلة متروكة فعليًا</p>
          </div>
          <div className="card-soft p-4 bg-green-50">
            <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center mb-2"><Wallet className="w-5 h-5 text-white" /></div>
            <p className="font-heading text-2xl font-extrabold text-green-600">{totalValue.toLocaleString()}</p>
            <p className="text-xs text-foreground/55 mt-0.5">قيمة محتملة ضائعة (ر.س)</p>
          </div>
          <div className="card-soft p-4 bg-blue-50">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center mb-2"><Clock className="w-5 h-5 text-white" /></div>
            <p className="font-heading text-2xl font-extrabold text-blue-600">{active.length}</p>
            <p className="text-xs text-foreground/55 mt-0.5">قيد الإكمال الآن (أقل من {ACTIVE_WINDOW_MIN} د)</p>
          </div>
        </div>
      )}

      {!orders ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
      ) : abandoned.length === 0 ? (
        <div className="card-soft p-10 text-center text-foreground/50"><ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-40" />لا توجد سلات متروكة فعليًا — 🎉</div>
      ) : (
        <div className="space-y-3">
          {abandoned.map(o => (
            <div key={o.id} className="card-soft p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-amber-600" /></div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{o.customer_name} <span className="text-foreground/50 font-normal" dir="ltr">— {o.phone}</span></p>
                  <p className="text-xs text-foreground/50 truncate">{o.product_name} • {o.total}  • {o.city}</p>
                  <p className="text-[11px] text-amber-600 font-medium mt-0.5">{timeAgo(o.created_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
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
