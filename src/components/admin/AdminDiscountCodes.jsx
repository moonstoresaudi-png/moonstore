import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { Tag, Plus, Trash2, Power, Check } from 'lucide-react';

export default function AdminDiscountCodes() {
  const [codes, setCodes] = useState(null);
  const [form, setForm] = useState({ code: '', discount_percent: 10, max_uses: 100 });
  const [adding, setAdding] = useState(false);

  const load = () => entities.DiscountCode.list('-created_date', 50).then(setCodes).catch(() => setCodes([]));

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) return;
    setAdding(true);
    try {
      await entities.DiscountCode.create({ ...form, code: form.code.toUpperCase().trim(), active: true, uses_count: 0 });
      setForm({ code: '', discount_percent: 10, max_uses: 100 });
      await load();
    } catch {}
    setAdding(false);
  };

  const toggleActive = async (c) => {
    setCodes(prev => prev ? prev.map(x => x.id === c.id ? { ...x, active: !x.active } : x) : prev);
    try { await entities.DiscountCode.update(c.id, { active: !c.active }); } catch {}
  };

  const remove = async (id) => {
    setCodes(prev => prev ? prev.filter(c => c.id !== id) : prev);
    try { await entities.DiscountCode.delete(id); } catch {}
  };

  return (
    <div>
      <h3 className="font-bold flex items-center gap-2 mb-4"><Tag className="w-5 h-5 text-primary" /> أكواد الخصم</h3>

      <form onSubmit={handleAdd} className="card-soft p-4 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="كود الخصم" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none uppercase" />
          <input type="number" value={form.discount_percent} onChange={e => setForm({ ...form, discount_percent: +e.target.value })} min={1} max={100} placeholder="نسبة الخصم %" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          <input type="number" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: +e.target.value })} min={1} placeholder="حد الاستخدام" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          <button type="submit" disabled={adding} className="py-2.5 btn-primary text-sm inline-flex items-center justify-center gap-1.5 disabled:opacity-50"><Plus className="w-4 h-4" /> إضافة</button>
        </div>
      </form>

      {!codes ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
      ) : codes.length === 0 ? (
        <div className="card-soft p-10 text-center text-foreground/50"><Tag className="w-10 h-10 mx-auto mb-3 opacity-40" />لا توجد أكواد خصم</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {codes.map(c => (
            <div key={c.id} className={`card-soft p-4 ${!c.active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-mono font-bold text-lg text-primary">{c.code}</p>
                  <p className="text-xs text-foreground/55">{c.discount_percent}% خصم</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleActive(c)} className={`p-2 rounded-lg ${c.active ? 'text-green-600 hover:bg-green-50' : 'text-foreground/40 hover:bg-secondary'}`}><Power className="w-4 h-4" /></button>
                  <button onClick={() => remove(c.id)} className="p-2 rounded-lg text-destructive/60 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground/50 pt-2 border-t border-border">
                <span>استُخدم: {c.uses_count || 0}/{c.max_uses}</span>
                {c.active ? <span className="text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> نشط</span> : <span className="text-foreground/40">معطّل</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}