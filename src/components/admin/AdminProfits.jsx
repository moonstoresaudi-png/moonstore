import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { TrendingUp, DollarSign, Package, Percent } from 'lucide-react';

export default function AdminProfits() {
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    entities.Order.list('-created_date', 200).then(setOrders).catch(() => setOrders([]));
    entities.Product.list().then(setProducts).catch(() => {});
  }, []);

  const data = React.useMemo(() => {
    if (!orders) return null;
    const valid = orders.filter(o => o.status !== 'cancelled');
    const revenue = valid.reduce((s, o) => s + (o.total || 0), 0);
    const costs = valid.reduce((s, o) => s + (o.cost || 0) * (o.quantity || 1), 0);
    const discounts = valid.reduce((s, o) => s + (o.discount_amount || 0), 0);
    const profit = revenue - costs - discounts;
    const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
    return { revenue, costs, discounts, profit, margin, orderCount: valid.length, avgOrder: valid.length > 0 ? Math.round(revenue / valid.length) : 0 };
  }, [orders]);

  if (!data) return <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-secondary/60 animate-pulse" />)}</div>;

  const cards = [
    { label: 'الإيرادات', value: `${data.revenue} ر.س`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'التكاليف', value: `${data.costs} ر.س`, icon: Package, color: 'bg-orange-500' },
    { label: 'صافي الربح', value: `${data.profit} ر.س`, icon: TrendingUp, color: 'bg-primary' },
    { label: 'هامش الربح', value: `${data.margin}%`, icon: Percent, color: 'bg-blue-500' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {cards.map((c, i) => (
          <div key={i} className="card-soft p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-foreground/55 mb-1">{c.label}</p><p className="font-heading text-xl font-extrabold">{c.value}</p></div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon className="w-5 h-5 text-white" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        <div className="card-soft p-5 text-center"><p className="text-xs text-foreground/55 mb-1">عدد الطلبات</p><p className="font-heading text-2xl font-extrabold">{data.orderCount}</p></div>
        <div className="card-soft p-5 text-center"><p className="text-xs text-foreground/55 mb-1">متوسط قيمة الطلب</p><p className="font-heading text-2xl font-extrabold text-primary">{data.avgOrder} ر.س</p></div>
        <div className="card-soft p-5 text-center"><p className="text-xs text-foreground/55 mb-1">إجمالي الخصومات</p><p className="font-heading text-2xl font-extrabold text-orange-500">{data.discounts} ر.س</p></div>
      </div>

      <div className="card-soft p-5">
        <h3 className="font-bold mb-3">تكلفة المواد الخام حسب المورد</h3>
        <p className="text-sm text-foreground/55 mb-4">يمكنك إدارة الموردين وتكاليف المواد الخام من تبويب "الموردين" لحساب التكلفة الإجمالية بدقة.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {products.slice(0, 4).map(p => (
            <div key={p.id} className="p-3 rounded-xl bg-secondary/40 text-center">
              <p className="text-xs text-foreground/55 truncate">{p.name}</p>
              <p className="font-bold text-sm text-primary mt-1">{p.price} ر.س</p>
              <p className="text-xs text-foreground/45">التكلفة: {p.cost || 0} ر.س</p>
              <p className="text-xs text-green-600 font-medium">ربح: {(p.price || 0) - (p.cost || 0)} ر.س</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}