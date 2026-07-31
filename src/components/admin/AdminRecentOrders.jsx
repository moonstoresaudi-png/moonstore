import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { entities } from '@/api/entities';
import { ListOrdered, ArrowLeft } from 'lucide-react';

const STATUS_DOT = {
  pending: 'bg-gray-400', new: 'bg-blue-500', processing: 'bg-amber-500',
  shipped: 'bg-purple-500', delivered: 'bg-green-500', cancelled: 'bg-red-500', archived: 'bg-gray-300',
};

export default function AdminRecentOrders({ onOpenOrders }) {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    entities.Order.list('-created_date', 8).then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="card-soft p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm flex items-center gap-2"><ListOrdered className="w-4 h-4 text-primary" /> أحدث الطلبات</h4>
        <button onClick={onOpenOrders} className="text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline">
          كل الطلبات <ArrowLeft className="w-3 h-3" />
        </button>
      </div>
      {!orders ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-11 rounded-lg bg-secondary/60 animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-foreground/45 text-center py-6">لا توجد طلبات بعد</p>
      ) : (
        <div className="divide-y divide-border">
          {orders.map(o => (
            <div key={o.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[o.status] || 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="font-medium truncate">{o.customer_name}</p>
                  <p className="text-[11px] text-foreground/45 truncate">#{o.order_number || o.id.slice(-6)} • {o.city}</p>
                </div>
              </div>
              <p className="font-bold text-xs flex-shrink-0">{o.total?.toLocaleString()} </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
