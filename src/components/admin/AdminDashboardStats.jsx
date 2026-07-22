import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { TrendingUp, ShoppingBag, Clock, CheckCircle, XCircle, Banknote } from 'lucide-react';

export default function AdminDashboardStats() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    entities.Order.list('-created_date', 500).then(setOrders).catch(() => setOrders([]));
  }, []);

  const stats = React.useMemo(() => {
    if (!orders) return null;
    const total = orders.length;
    const pending = orders.filter(o => ['new', 'pending', 'processing'].includes(o.status)).length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter(o => o.created_date?.slice(0, 10) === todayStr).length;
    return { total, pending, delivered, cancelled, revenue, todayOrders };
  }, [orders]);

  if (!stats) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {[...Array(6)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-secondary/60 animate-pulse" />)}
    </div>
  );

  const cards = [
    { label: 'إجمالي الإيرادات', value: `${stats.revenue.toLocaleString()} ر.س`, icon: Banknote, color: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50' },
    { label: 'جميع الطلبات', value: stats.total, icon: ShoppingBag, color: 'bg-primary', text: 'text-primary', bg: 'bg-primary/5' },
    { label: 'قيد المعالجة', value: stats.pending, icon: Clock, color: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'تم التسليم', value: stats.delivered, icon: CheckCircle, color: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'ملغاة', value: stats.cancelled, icon: XCircle, color: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50' },
    { label: 'طلبات اليوم', value: stats.todayOrders, icon: TrendingUp, color: 'bg-violet-500', text: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((c, i) => (
        <div key={i} className={`card-soft p-4 ${c.bg}`}>
          <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center mb-2`}>
            <c.icon className="w-5 h-5 text-white" />
          </div>
          <p className={`font-heading text-2xl font-extrabold ${c.text}`}>{c.value}</p>
          <p className="text-xs text-foreground/55 mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  );
}