import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { CreditCard, Calendar, TrendingUp, Receipt } from 'lucide-react';

function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function startOfWeek(d) { const x = startOfDay(d); const day = x.getDay(); x.setDate(x.getDate() - day); return x; }
function startOfMonth(d) { const x = startOfDay(d); x.setDate(1); return x; }

export default function AdminPayments() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    entities.Order.list('-created_date', 1000).then(setOrders).catch(() => setOrders([]));
  }, []);

  const stats = React.useMemo(() => {
    if (!orders) return null;
    // مدفوعات ميسر الحقيقية فقط: طريقة الدفع بطاقة + عندها payment_id (يعني
    // اتأكدت من مويسر سيرفر-لسيرفر عبر verify-payment) — نستبعد أي طلب بطاقة
    // لسه pending (ما أكمل الدفع فعليًا)
    const paid = orders.filter(o => o.payment_method === 'card' && o.payment_id);
    const now = new Date();
    const dayStart = startOfDay(now), weekStart = startOfWeek(now), monthStart = startOfMonth(now);

    const sum = (list) => list.reduce((s, o) => s + (o.total || 0), 0);
    const today = paid.filter(o => new Date(o.created_date) >= dayStart);
    const week = paid.filter(o => new Date(o.created_date) >= weekStart);
    const month = paid.filter(o => new Date(o.created_date) >= monthStart);

    const codOrders = orders.filter(o => o.payment_method === 'cod' && o.status !== 'pending' && o.status !== 'cancelled');

    return {
      totalAmount: sum(paid), totalCount: paid.length,
      todayAmount: sum(today), todayCount: today.length,
      weekAmount: sum(week), weekCount: week.length,
      monthAmount: sum(month), monthCount: month.length,
      codAmount: sum(codOrders), codCount: codOrders.length,
      list: paid,
    };
  }, [orders]);

  if (!stats) return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-secondary/60 animate-pulse" />)}
    </div>
  );

  const cards = [
    { label: 'إجمالي مدفوعات ميسر', value: stats.totalAmount.toLocaleString(), sub: `${stats.totalCount} عملية`, color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-600' },
    { label: 'اليوم', value: stats.todayAmount.toLocaleString(), sub: `${stats.todayCount} عملية`, color: 'bg-primary', bg: 'bg-primary/5', text: 'text-primary' },
    { label: 'هذا الأسبوع', value: stats.weekAmount.toLocaleString(), sub: `${stats.weekCount} عملية`, color: 'bg-violet-500', bg: 'bg-violet-50', text: 'text-violet-600' },
    { label: 'هذا الشهر', value: stats.monthAmount.toLocaleString(), sub: `${stats.monthCount} عملية`, color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div>
      <h3 className="font-bold flex items-center gap-2 mb-1"><CreditCard className="w-5 h-5 text-primary" /> مدفوعات ميسر (أونلاين)</h3>
      <p className="text-sm text-foreground/55 mb-5">المبالغ اللي دخلت فعليًا عبر الدفع بالبطاقة عن طريق مويسر، بعد التحقق الفعلي من الدفع.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {cards.map((c, i) => (
          <div key={i} className={`card-soft p-4 ${c.bg}`}>
            <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center mb-2`}><TrendingUp className="w-5 h-5 text-white" /></div>
            <p className={`font-heading text-xl sm:text-2xl font-extrabold ${c.text}`}>{c.value} <span className="text-xs font-normal"></span></p>
            <p className="text-xs text-foreground/55 mt-0.5">{c.label}</p>
            <p className="text-[11px] text-foreground/40">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="card-soft p-4 mb-6 flex items-center justify-between bg-secondary/30">
        <div>
          <p className="text-sm font-bold">الدفع عند الاستلام (COD)</p>
          <p className="text-xs text-foreground/50">مبالغ لسه ما دخلت حسابك — تُحصّل عند التسليم</p>
        </div>
        <p className="font-heading text-lg font-bold text-foreground/70">{stats.codAmount.toLocaleString()}  <span className="text-xs font-normal text-foreground/40">({stats.codCount} طلب)</span></p>
      </div>

      <h4 className="font-bold text-sm flex items-center gap-2 mb-3"><Receipt className="w-4 h-4" /> آخر العمليات</h4>
      {stats.list.length === 0 ? (
        <div className="card-soft p-8 text-center text-foreground/50 text-sm">لا توجد مدفوعات أونلاين مؤكدة بعد</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-right">
              <tr>
                <th className="p-3 font-medium">العميل</th>
                <th className="p-3 font-medium">رقم الطلب</th>
                <th className="p-3 font-medium">المبلغ</th>
                <th className="p-3 font-medium">التاريخ</th>
                <th className="p-3 font-medium">معرّف الدفع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.list.slice(0, 100).map(o => (
                <tr key={o.id}>
                  <td className="p-3 font-medium">{o.customer_name}</td>
                  <td className="p-3 text-foreground/60">#{o.order_number || o.id.slice(-6)}</td>
                  <td className="p-3 font-bold text-green-600">{o.total?.toLocaleString()} </td>
                  <td className="p-3 text-foreground/50 text-xs"><Calendar className="w-3 h-3 inline ml-1" />{new Date(o.created_date).toLocaleDateString('ar-SA')}</td>
                  <td className="p-3 text-foreground/40 text-[11px]" dir="ltr">{o.payment_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
