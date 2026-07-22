import React, { useState, useEffect } from 'react';
import { entities } from '@/api/entities';
import { uploadFile } from '@/api/storage';
import { Package, Plus, Trash2, Pencil, X, Upload, Star, Check } from 'lucide-react';

const CATEGORIES = ['أرواب تخرج', 'وشاح تخرج', 'قبعة تخرج', 'لابكوت', 'سكراب طبي', 'مطرزات', 'كوفلة مواليد'];
const EMPTY = { name: '', description: '', price: 0, old_price: 0, cost: 0, category: 'أرواب تخرج', image_url: '', gallery_images: [], sizes: [], simulator_enabled: false, featured: false, bestseller: false, in_stock: true, rating: 5, stock_quantity: 0, purchase_count: 0, has_sash: false, has_name: false, has_date: false, has_cap: false, sash_addon: 50, packaging_addon: 15 };

function InlineEdit({ value, onSave, suffix = '' }) {
  const [val, setVal] = useState(value);
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <input
        type="number"
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={() => { setEditing(false); if (String(val) !== String(value)) onSave(+val); }}
        onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setVal(value); setEditing(false); } }}
        className="w-20 px-1 py-0.5 rounded border border-primary text-sm text-center font-bold"
      />
    );
  }

  return (
    <button onClick={() => { setVal(value); setEditing(true); }} className="font-bold hover:bg-secondary px-2 py-0.5 rounded transition-colors">
      {value}{suffix}
    </button>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [sizeInput, setSizeInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savedId, setSavedId] = useState(null);

  const load = () => entities.Product.list('-created_date', 100).then(setProducts).catch(() => setProducts([]));
  useEffect(() => { load(); }, []);

  const startEdit = (p) => { setEditing(p.id); setForm({ ...EMPTY, ...p, gallery_images: p.gallery_images || [], sizes: p.sizes || [] }); setGalleryInput(''); };
  const startAdd = () => { setEditing('new'); setForm(EMPTY); setGalleryInput(''); };
  const cancel = () => { setEditing(null); setForm(EMPTY); setGalleryInput(''); };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadFile({ file });
      setForm(f => ({ ...f, image_url: file_url }));
    } catch {}
    setUploading(false);
  };

  const addSize = () => { if (sizeInput.trim()) { setForm(f => ({ ...f, sizes: [...f.sizes, sizeInput.trim()] })); setSizeInput(''); } };
  const removeSize = (s) => setForm(f => ({ ...f, sizes: f.sizes.filter(x => x !== s) }));
  const addGalleryUrl = () => { if (galleryInput.trim()) { setForm(f => ({ ...f, gallery_images: [...(f.gallery_images || []), galleryInput.trim()] })); setGalleryInput(''); } };
  const removeGalleryUrl = (url) => setForm(f => ({ ...f, gallery_images: (f.gallery_images || []).filter(x => x !== url) }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing === 'new') { await entities.Product.create(form); } else { await entities.Product.update(editing, form); }
      cancel();
      await load();
    } catch {}
  };

  const remove = async (id) => {
    setProducts(prev => prev ? prev.filter(p => p.id !== id) : prev);
    try { await entities.Product.delete(id); await load(); } catch {}
  };

  const updateField = async (id, field, value) => {
    try {
      await entities.Product.update(id, { [field]: value });
      setSavedId(id);
      setTimeout(() => setSavedId(null), 1500);
      await load();
    } catch {}
  };

  const TOGGLES = [
    { k: 'simulator_enabled', l: 'محاكي الوشاح' },
    { k: 'has_sash', l: 'إضافة وشاح' },
    { k: 'has_name', l: 'إضافة اسم' },
    { k: 'has_date', l: 'إضافة تاريخ' },
    { k: 'has_cap', l: 'إضافة كاب' },
    { k: 'featured', l: 'مميز' },
    { k: 'bestseller', l: 'الأكثر مبيعًا' },
    { k: 'in_stock', l: 'متوفر' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> المنتجات ({products?.length || 0})</h3>
        <button onClick={startAdd} className="px-4 py-2 btn-primary text-sm inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> إضافة منتج</button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card-soft p-5 mb-5 space-y-4">
          <div className="flex items-center justify-between"><h4 className="font-bold">{editing === 'new' ? 'إضافة منتج جديد' : 'تعديل المنتج'}</h4><button type="button" onClick={cancel} className="p-2 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم المنتج" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
            <input type="number" required value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} placeholder="السعر" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            <input type="number" value={form.old_price} onChange={e => setForm({ ...form, old_price: +e.target.value })} placeholder="السعر القديم" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            <input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: +e.target.value })} placeholder="التكلفة" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            <input type="number" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: +e.target.value })} placeholder="كمية المخزون" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            <input type="number" value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })} step="0.1" min="0" max="5" placeholder="التقييم" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            <input type="number" value={form.purchase_count} onChange={e => setForm({ ...form, purchase_count: +e.target.value })} placeholder="عدد مرات الشراء" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            <input type="number" value={form.sash_addon} onChange={e => setForm({ ...form, sash_addon: +e.target.value })} placeholder="سعر إضافة الوشاح" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            <input type="number" value={form.packaging_addon} onChange={e => setForm({ ...form, packaging_addon: +e.target.value })} placeholder="سعر التغليف" className="px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
          </div>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="الوصف" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />

          <div className="flex items-center gap-3">
            {form.image_url && <img src={form.image_url} alt="معاينة" className="w-16 h-16 rounded-xl object-cover" />}
            <label className="px-4 py-2.5 rounded-xl border border-dashed border-border bg-secondary/40 text-sm cursor-pointer hover:border-primary inline-flex items-center gap-2">
              {uploading ? 'جاري الرفع...' : <><Upload className="w-4 h-4" /> رفع الصورة الرئيسية</>}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>

          {/* Gallery images */}
          <div>
            <p className="text-sm font-medium mb-2">صور المعرض (Gallery)</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.gallery_images || []).map(url => (
                <div key={url} className="relative">
                  <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <button type="button" onClick={() => removeGalleryUrl(url)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={galleryInput} onChange={e => setGalleryInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addGalleryUrl())} placeholder="ألصق رابط صورة هنا" className="flex-1 px-3 py-2 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
              <button type="button" onClick={addGalleryUrl} className="px-4 py-2 rounded-xl bg-secondary text-sm">إضافة</button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-sm font-medium mb-2">المقاسات</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.sizes.map(s => <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-1">{s}<button type="button" onClick={() => removeSize(s)}><X className="w-3 h-3" /></button></span>)}
            </div>
            <div className="flex gap-2"><input value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())} placeholder="أضف مقاسًا" className="flex-1 px-3 py-2 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" /><button type="button" onClick={addSize} className="px-4 py-2 rounded-xl bg-secondary text-sm">إضافة</button></div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {TOGGLES.map(t => (
              <label key={t.k} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form[t.k] || false} onChange={e => setForm({ ...form, [t.k]: e.target.checked })} className="accent-primary w-4 h-4" />{t.l}</label>
            ))}
          </div>
          <p className="text-xs text-foreground/50 -mt-3">
            "محاكي الوشاح" يُظهر معاينة حية لاسم العميل والتاريخ ولون الوشاح فوق صورة المنتج الحقيقية في صفحة المنتج — فعّله مع أي من (اسم / تاريخ / وشاح / كاب) لتظهر المعاينة.
          </p>

          <div className="flex gap-2"><button type="submit" className="flex-1 py-3 btn-primary">حفظ</button><button type="button" onClick={cancel} className="px-5 py-3 rounded-full border border-border text-sm">إلغاء</button></div>
        </form>
      )}

      {!products ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-48 rounded-xl bg-secondary/60 animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map(p => (
            <div key={p.id} className={`card-soft overflow-hidden group ${savedId === p.id ? 'ring-2 ring-green-400' : ''}`}>
              <div className="aspect-square bg-secondary relative">
                {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-10 h-10 text-foreground/20 absolute inset-0 m-auto" />}
                {p.bestseller && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-bold">الأكثر مبيعًا</span>}
                {savedId === p.id && <div className="absolute inset-0 bg-green-400/20 flex items-center justify-center"><Check className="w-8 h-8 text-green-600" /></div>}
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-primary"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{p.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-primary">السعر: <InlineEdit value={p.price} onSave={v => updateField(p.id, 'price', v)} suffix=" ر.س" /></span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-foreground/55">المخزون: <InlineEdit value={p.stock_quantity || 0} onSave={v => updateField(p.id, 'stock_quantity', v)} /></span>
                  <span className={`text-xs font-medium ${p.in_stock ? 'text-green-600' : 'text-red-500'}`}>{p.in_stock ? 'متوفر' : 'نفذ'}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {p.simulator_enabled && <span className="chip bg-accent/40 text-primary text-[10px]">محاكي</span>}
                  {p.has_sash && <span className="chip bg-violet/10 text-violet text-[10px]">وشاح</span>}
                  {p.has_name && <span className="chip bg-blue-100 text-blue-600 text-[10px]">اسم</span>}
                  {!p.in_stock && <span className="chip bg-red-100 text-red-600 text-[10px]">نفذ</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}