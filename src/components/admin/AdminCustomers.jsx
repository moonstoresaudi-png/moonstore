import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { Users, Phone, MapPin, ShoppingBag } from 'lucide-react';

export default function AdminCustomers() {
  const [orders, setOrders] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    entities.Order.list('-created_date', 200).then(setOrders).catch(() => setOrders([]));
  }, []);

  const customers = React.useMemo(() => {
    if (!orders) return [];
    const map = {};
    orders.forEach(o => {
      const key = o.phone || o.customer_name;
      if (!map[key]) {
        map[key] = { name: o.customer_name, phone: o.phone || '—', city: o.city || '—', orders: 0, total: 0, lastDate: o.created_date };
      }
      map[key].orders += o.quantity || 1;
      map[key].total += o.total || 0;
      if (o.created_date > map[key].lastDate) map[key].lastDate = o.created_date;
    });
    return Object.values(map).filter(c => c.name?.includes(search) || c.phone?.includes(search));
  }, [orders, search]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="font-bold flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> العملاء</h3>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الجوال..." className="px-4 py-2 rounded-full border border-border bg-card text-sm focus:border-primary focus:outline-none w-56" />
      </div>

      {!orders ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
      ) : customers.length === 0 ? (
        <div className="card-soft p-10 text-center text-foreground/50"><Users className="w-10 h-10 mx-auto mb-3 opacity-40" />لا يوجد عملاء</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c, i) => (
            <div key={i} className="card-soft p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">{c.name?.charAt(0)}</div>
                <div className="min-w-0"><p className="font-bold truncate">{c.name}</p><p className="text-xs text-foreground/50 flex items-center gap-1" dir="ltr"><Phone className="w-3 h-3" /> {c.phone}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
                <div><p className="text-xs text-foreground/50">الطلبات</p><p className="font-bold text-sm">{c.orders}</p></div>
                <div><p className="text-xs text-foreground/50">الإنفاق</p><p className="font-bold text-sm text-primary">{c.total}</p></div>
                <div><p className="text-xs text-foreground/50">المدينة</p><p className="font-bold text-sm truncate">{c.city}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}