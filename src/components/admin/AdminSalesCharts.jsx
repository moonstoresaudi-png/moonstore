import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon } from 'lucide-react';

const STATUS_COLORS = {
  new: '#8b5cf6',
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#ef4444',
  archived: '#94a3b8',
};

const STATUS_LABELS = {
  new: 'جديد',
  pending: 'قيد الانتظار',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  archived: 'مؤرشف',
};

export default function AdminSalesCharts() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    entities.Order.list('-created_date', 500).then(setOrders).catch(() => setOrders([]));
  }, []);

  const charts = React.useMemo(() => {
    if (!orders) return null;
    const valid = orders.filter(o => o.status !== 'cancelled');

    // Sales over last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayOrders = valid.filter(o => o.created_date?.slice(0, 10) === key);
      days.push({
        date: d.toLocaleDateString('ar-SA', { weekday: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
        orders: dayOrders.length,
      });
    }

    // Status distribution
    const statusMap = {};
    orders.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
    const statusData = Object.entries(statusMap).map(([k, v]) => ({ name: STATUS_LABELS[k] || k, value: v, key: k }));

    // Revenue by month (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mKey = d.toISOString().slice(0, 7);
      const mOrders = valid.filter(o => o.created_date?.slice(0, 7) === mKey);
      months.push({
        month: d.toLocaleDateString('ar-SA', { month: 'short' }),
        revenue: mOrders.reduce((s, o) => s + (o.total || 0), 0),
        profit: mOrders.reduce((s, o) => s + ((o.total || 0) - (o.cost || 0) * (o.quantity || 1) - (o.discount_amount || 0)), 0),
      });
    }

    return { days, statusData, months };
  }, [orders]);

  if (!charts) return <div className="h-64 rounded-xl bg-secondary/60 animate-pulse" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">لوحة المبيعات والتحليلات</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Revenue line chart */}
        <div className="card-soft p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-sm">الإيرادات — آخر 7 أيام</h4>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={charts.days}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 13 }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} name="الإيراد (ر.س)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie chart */}
        <div className="card-soft p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-sm">توزيع حالات الطلبات</h4>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={charts.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {charts.statusData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.key] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly revenue vs profit */}
        <div className="card-soft p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-sm">الإيرادات مقابل الأرباح — آخر 6 أشهر</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={charts.months}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" name="الإيراد (ر.س)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" name="صافي الربح (ر.س)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}