import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { Inbox, DollarSign, Clock, CheckCircle2, Archive, ArrowDownUp, ArchiveRestore, ChevronDown, Sparkles } from 'lucide-react';

const STATUS = {
  pending: { label: 'قيد الانتظار', cls: 'bg-gray-100 text-gray-700' },
  new: { label: 'جديد', cls: 'bg-blue-100 text-blue-700' },
  processing: { label: 'قيد التنفيذ', cls: 'bg-amber-100 text-amber-700' },
  shipped: { label: 'تم الشحن', cls: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'تم التسليم', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ملغي', cls: 'bg-red-100 text-red-700' },
  archived: { label: 'مؤرشف', cls: 'bg-gray-200 text-gray-600' },
};

// تسميات عربية للحقول الشائعة داخل sash_config حتى تُعرض بشكل مفهوم في لوحة التحكم
const FIELD_LABELS = {
  mode: 'طريقة التطريز',
  text: 'النص',
  name: 'الاسم',
  year: 'سنة التخرج',
  date: 'التاريخ',
  font: 'الخط',
  size: 'المقاس',
  university: 'الجامعة',
  sashColor: 'لون الوشاح',
  capColor: 'لون الكاب',
  capType: 'نوع الكاب',
  tassel: 'لون الشرابة',
  thread: 'لون التطريز',
  logo_url: 'الشعار',
  addSash: 'وشاح إضافي',
  fontType: 'نوع الخط',
  packaging: 'تغليف فاخر',
};

// sash_config قد يحتوي على أكثر من عنصر مفصولة بـ " | "، وكل عنصر إما JSON
// (من محاكيات الوشاح/الكاب/الجاكيت/البكج الجامعي) أو نص ملخّص عادي من المهيّئ القديم
function parseConfigSegments(raw) {
  if (!raw) return [];
  return raw.split(' | ').filter(Boolean).map((seg) => {
    try {
      const obj = JSON.parse(seg);
      if (obj && typeof obj === 'object') return { type: 'json', data: obj };
    } catch { /* ليس JSON، نعرضه كنص خام */ }
    return { type: 'text', data: seg };
  });
}

function ConfigDetails({ sashConfig }) {
  const segments = parseConfigSegments(sashConfig);
  if (segments.length === 0) {
    return <p className="text-sm text-foreground/50">لا توجد تفاصيل تخصيص لهذا الطلب.</p>;
  }
  return (
    <div className="space-y-3">
      {segments.map((seg, i) => (
        <div key={i} className="rounded-xl border border-border bg-secondary/30 p-3">
          {seg.type === 'text' ? (
            <p className="text-sm text-foreground/80">{seg.data}</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
              {Object.entries(seg.data).map(([k, v]) => {
                if (!v) return null;
                if (k === 'logo_url') {
                  return (
                    <div key={k} className="flex items-center gap-2 sm:col-span-2">
                      <span className="text-xs text-foreground/50 min-w-[90px]">{FIELD_LABELS[k] || k}:</span>
                      <a href={v} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-80">
                        <img src={v} alt="شعار مرفوع" className="w-10 h-10 rounded-lg object-cover border border-border" />
                        <span className="text-xs text-primary underline">فتح الصورة</span>
                      </a>
                    </div>
                  );
                }
                return (
                  <div key={k} className="flex items-center gap-2 text-sm">
                    <span className="text-xs text-foreground/50 min-w-[90px]">{FIELD_LABELS[k] || k}:</span>
                    <span className="font-medium text-foreground/85">{String(v)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return <div className="card-soft p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-foreground/55 mb-1">{label}</p><p className="font-heading text-xl font-extrabold">{value}</p></div><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5 text-white" /></div></div></div>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortDesc, setSortDesc] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = () => {
    entities.Order.list('-created_date', 200).then(setOrders).catch(() => setOrders([]));
  };

  const sorted = orders ? [...orders].sort((a, b) => sortDesc ? new Date(b.created_date) - new Date(a.created_date) : new Date(a.created_date) - new Date(b.created_date)) : [];
  const filtered = filter === 'all' ? sorted.filter(o => o.status !== 'archived' && o.status !== 'pending') : filter === 'archived' ? sorted.filter(o => o.status === 'archived') : sorted.filter(o => o.status === filter);

  const stats = orders ? {
    total: orders.filter(o => o.status !== 'pending' && o.status !== 'archived').length,
    revenue: orders.filter(o => o.status !== 'cancelled' && o.status !== 'pending' && o.status !== 'archived').reduce((s, o) => s + (o.total || 0), 0),
    pending: orders.filter(o => o.status === 'new' || o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  } : { total: 0, revenue: 0, pending: 0, delivered: 0 };

  const updateStatus = async (id, status) => {
    setOrders(prev => prev ? prev.map(o => o.id === id ? { ...o, status } : o) : prev);
    try { await entities.Order.update(id, { status }); } catch { load(); }
  };

  const archive = (id) => updateStatus(id, 'archived');
  const unarchive = (id) => updateStatus(id, 'delivered');
  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard icon={Inbox} label="إجمالي الطلبات" value={stats.total} color="bg-blue-500" />
        <StatCard icon={DollarSign} label="الإيرادات" value={`${stats.revenue} ر.س`} color="bg-green-500" />
        <StatCard icon={Clock} label="قيد المعالجة" value={stats.pending} color="bg-amber-500" />
        <StatCard icon={CheckCircle2} label="تم التسليم" value={stats.delivered} color="bg-violet-500" />
      </div>

      <div className="card-soft overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold flex items-center gap-2"><Inbox className="w-5 h-5 text-primary" /> الطلبات</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <button onClick={() => setSortDesc(v => !v)} className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-foreground/60 inline-flex items-center gap-1"><ArrowDownUp className="w-3.5 h-3.5" /> {sortDesc ? 'الأحدث' : 'الأقدم'}</button>
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/60'}`}>النشطة</button>
            {Object.entries(STATUS).filter(([k]) => k !== 'pending').map(([k, v]) => (
              <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === k ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/60'}`}>{v.label}</button>
            ))}
          </div>
        </div>
        {!orders ? (
          <div className="p-8 space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-foreground/50"><Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />لا توجد طلبات</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-right text-foreground/55 border-b border-border">
                <th className="p-3 font-medium">رقم الطلب</th><th className="p-3 font-medium">العميل</th>
                <th className="p-3 font-medium hidden sm:table-cell">المنتج</th><th className="p-3 font-medium hidden md:table-cell">المدينة</th>
                <th className="p-3 font-medium">الإجمالي</th><th className="p-3 font-medium">الحالة</th><th className="p-3 font-medium"></th>
              </tr></thead>
              <tbody>
                {filtered.map(o => (
                  <React.Fragment key={o.id}>
                    <tr className="border-b border-border/60 hover:bg-secondary/30">
                      <td className="p-3 font-mono text-xs text-primary">#{o.order_number || o.id.slice(-6)}</td>
                      <td className="p-3"><div className="font-medium">{o.customer_name}</div><div className="text-xs text-foreground/50" dir="ltr">{o.phone}</div></td>
                      <td className="p-3 hidden sm:table-cell text-foreground/70 max-w-[140px] truncate">{o.product_name}</td>
                      <td className="p-3 hidden md:table-cell text-foreground/60">{o.city || '—'}</td>
                      <td className="p-3 font-bold text-primary">{o.total} ر.س</td>
                      <td className="p-3">
                        <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className={`text-xs font-bold rounded-full px-2.5 py-1 border-0 cursor-pointer ${STATUS[o.status]?.cls}`}>
                          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {o.sash_config && (
                            <button onClick={() => toggleExpand(o.id)} title="تفاصيل التخصيص" className={`p-1.5 rounded-lg inline-flex items-center gap-1 text-xs font-medium ${expandedId === o.id ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}>
                              <Sparkles className="w-3.5 h-3.5" />
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedId === o.id ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                          {o.status === 'delivered' ? <button onClick={() => archive(o.id)} title="أرشفة" className="p-1.5 rounded-lg text-foreground/40 hover:bg-secondary"><Archive className="w-4 h-4" /></button>
                            : o.status === 'archived' ? <button onClick={() => unarchive(o.id)} title="استرجاع" className="p-1.5 rounded-lg text-primary hover:bg-secondary"><ArchiveRestore className="w-4 h-4" /></button>
                            : null}
                        </div>
                      </td>
                    </tr>
                    {expandedId === o.id && o.sash_config && (
                      <tr className="bg-secondary/20">
                        <td colSpan={7} className="p-4">
                          <p className="text-xs font-bold text-foreground/60 mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" /> تفاصيل تخصيص المنتج (من المحاكي)</p>
                          <ConfigDetails sashConfig={o.sash_config} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}