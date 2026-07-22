import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { Truck, Plus, Trash2, Phone, Package } from 'lucide-react';

const TYPES = ['أقمشة', 'خيوط تطريز', 'إكسسوارات', 'تغليف', 'أخرى'];

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState(null);
  const [form, setForm] = useState({ name: '', contact_person: '', phone: '', product_type: 'أقمشة', unit_cost: 0, notes: '' });
  const [adding, setAdding] = useState(false);

  const load = () => entities.Supplier.list('-created_date', 50).then(setSuppliers).catch(() => setSuppliers([]));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setAdding(true);
    try {
      await entities.Supplier.create(form);
      setForm({ name: '', contact_person: '', phone: '', product_type: 'أقمشة', unit_cost: 0, notes: '' });
      await load();
    } catch {}
    setAdding(false);
  };

  const remove = async (id) => {
    setSuppliers(prev => prev ? prev.filter(s => s.id !== id) : prev);
    try { await entities.Supplier.delete(id); } catch {}
  };

  return (
    <div>
      <h3 className="font-bold flex items-center gap-2 mb-4"><Truck className="w-5 h-5 text-primary" /> الموردين</h3>

      <form onSubmit={handleAdd} className="card-soft p-4 mb-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم المورد" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          <input value={form.contact_person} onChange={e => setForm({ ...form, contact_person: e.target.value })} placeholder="مسؤول التواصل" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="الجوال" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          <select value={form.product_type} onChange={e => setForm({ ...form, product_type: e.target.value })} className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none">
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" value={form.unit_cost} onChange={e => setForm({ ...form, unit_cost: +e.target.value })} placeholder="التكلفة للوحدة" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          <button type="submit" disabled={adding} className="py-2.5 btn-primary text-sm inline-flex items-center justify-center gap-1.5 disabled:opacity-50"><Plus className="w-4 h-4" /> إضافة مورد</button>
        </div>
      </form>

      {!suppliers ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
      ) : suppliers.length === 0 ? (
        <div className="card-soft p-10 text-center text-foreground/50"><Truck className="w-10 h-10 mx-auto mb-3 opacity-40" />لا يوجد موردين مسجّلين</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {suppliers.map(s => (
            <div key={s.id} className="card-soft p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold">{s.name}</p>
                  {s.contact_person && <p className="text-xs text-foreground/55">{s.contact_person}</p>}
                </div>
                <button onClick={() => remove(s.id)} className="p-2 rounded-lg text-destructive/60 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-border text-sm">
                <p className="flex items-center gap-2 text-foreground/60"><span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center"><Package className="w-3 h-3 text-primary" /></span> {s.product_type}</p>
                {s.phone && <p className="flex items-center gap-2 text-foreground/60" dir="ltr"><span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center"><Phone className="w-3 h-3 text-primary" /></span> {s.phone}</p>}
                {s.unit_cost > 0 && <p className="text-primary font-bold">التكلفة: {s.unit_cost} ر.س / وحدة</p>}
                {s.notes && <p className="text-xs text-foreground/45">{s.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}