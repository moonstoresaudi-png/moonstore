import React, { useState } from 'react';
import { Star, Plus, Minus, ShoppingBag, Check, Flame, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import ProductGallery from './ProductGallery';
import MeasurementGuide from './MeasurementGuide';
import { useCart } from '@/lib/cartContext';

const FONTS = [
  { label: 'ثلث', cls: 'font-thuluth' },
  { label: 'ديواني', cls: 'font-diwani' },
  { label: 'كوفي', cls: 'font-kufi' },
  { label: 'نسخ', cls: 'font-naskh' },
  { label: 'لطيف', cls: 'font-lateef' },
  { label: 'مصري', cls: 'font-messiri' },
  { label: 'قاهرة', cls: 'font-cairo' },
  { label: 'طاجوال', cls: 'font-body' },
];

const THREAD_COLORS = [
  { label: 'ذهبي', value: '#D4AF37' },
  { label: 'فضي', value: '#C0C0C0' },
  { label: 'أبيض', value: '#FFFFFF' },
  { label: 'أسود', value: '#222222' },
  { label: 'أحمر', value: '#DC2626' },
  { label: 'أزرق', value: '#2563EB' },
];

const SASH_COLORS = [
  { label: 'بنفسجي', value: '#6B4D6C' },
  { label: 'أسود', value: '#1a1a2e' },
  { label: 'كحلي', value: '#1B2A4A' },
  { label: 'أخضر زيتي', value: '#556B2F' },
  { label: 'خمري', value: '#800020' },
  { label: 'وردي', value: '#C58B8B' },
];

const YEARS = ['2025', '2026', '1446', '1447'];
const CAP_TYPES = ['دائري', 'مثلث'];

function Section({ label, required, children }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-bold mb-2">{label} {required && <span className="text-destructive">*</span>}</label>
      {children}
    </div>
  );
}

export default function ProductConfigurator({ product }) {
  const [activeTab, setActiveTab] = useState('description');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const [config, setConfig] = useState({
    addSash: false,
    name: '',
    fontType: 'ثلث',
    date: '2026',
    size: product.sizes?.[0] || '',
    capType: 'دائري',
    threadColor: '#D4AF37',
    sashColor: '#6B4D6C',
    packaging: false,
  });

  const update = (key, val) => setConfig(c => ({ ...c, [key]: val }));

  const gallery = product.gallery_images?.length ? product.gallery_images : [product.image_url].filter(Boolean);
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  const addonPrice = (config.addSash ? (product.sash_addon || 50) : 0) + (config.packaging ? (product.packaging_addon || 15) : 0);
  const unitPrice = product.price + addonPrice;
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    const summary = [
      config.addSash && `وشاح (${SASH_COLORS.find(c => c.value === config.sashColor)?.label || ''})`,
      config.name && `الاسم: ${config.name}`,
      `خط: ${config.fontType}`,
      config.size && `مقاس: ${config.size}`,
      product.has_cap && `كاب: ${config.capType}`,
      `تطريز: ${THREAD_COLORS.find(c => c.value === config.threadColor)?.label || ''}`,
      config.packaging && 'تغليف فاخر',
    ].filter(Boolean).join(' | ');

    addItem({ ...product, id: `${product.id}-${Date.now()}`, price: unitPrice, qty, size: config.size, sash_config: summary });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const tabs = [
    { k: 'description', l: 'الوصف' },
    { k: 'reviews', l: 'المراجعات' },
    { k: 'size', l: 'دليل المقاسات' },
  ];

  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <ProductGallery images={gallery} name={product.name} discount={discount} product={product} previewConfig={config} />

        <div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-foreground/20'}`} />
            ))}
            <span className="text-xs text-foreground/50 mr-2">({product.rating || 5})</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold mb-1">{product.name}</h1>
          <p className="text-sm text-foreground/60 mb-3">{product.category}</p>

          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-foreground/60">تم شراءه: <strong className="text-foreground">{product.purchase_count || 0}</strong> مرة</span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-heading text-3xl font-extrabold text-primary">{unitPrice} ر.س</span>
            {product.old_price > 0 && <span className="text-foreground/40 text-lg line-through">{product.old_price}</span>}
          </div>

          <div className="bg-secondary/40 rounded-xl p-3 mb-5 text-sm">
            <span className="text-foreground/60">ابتداءً من <strong className="text-primary">{Math.ceil(unitPrice / 4)} ر.س</strong> /شهر أو على 4 دفعات بدون فوائد</span>
          </div>

          {product.has_sash && (
            <Section label="إضافة وشاح" required>
              <div className="flex gap-2">
                <button onClick={() => update('addSash', true)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.addSash ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>إضافة وشاح +{product.sash_addon || 50} ر.س</button>
                <button onClick={() => update('addSash', false)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${!config.addSash ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>بدون</button>
              </div>
            </Section>
          )}

          {product.has_name && (
            <Section label="اكتب اسمك" required>
              <input value={config.name} onChange={e => update('name', e.target.value)} placeholder="الاسم ثنائي أو ثلاثي" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            </Section>
          )}

          <Section label="نوع الخط" required>
            <div className="flex flex-wrap gap-2">
              {FONTS.map(f => (
                <button key={f.label} onClick={() => update('fontType', f.label)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${f.cls} ${config.fontType === f.label ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>{f.label}</button>
              ))}
            </div>
          </Section>

          {product.has_date && (
            <Section label="إضافة تاريخ" required>
              <div className="flex flex-wrap gap-2">
                {YEARS.map(y => (
                  <button key={y} onClick={() => update('date', y)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.date === y ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>{y}</button>
                ))}
              </div>
            </Section>
          )}

          {product.sizes?.length > 0 && (
            <Section label="المقاس" required>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => update('size', s)} className={`min-w-[48px] px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${config.size === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>{s}</button>
                ))}
              </div>
            </Section>
          )}

          {product.has_cap && (
            <Section label="نوع الكاب" required>
              <div className="flex gap-2">
                {CAP_TYPES.map(c => (
                  <button key={c} onClick={() => update('capType', c)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.capType === c ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>{c}</button>
                ))}
              </div>
            </Section>
          )}

          <Section label="لون التطريز">
            <div className="flex gap-2">
              {THREAD_COLORS.map(c => (
                <button key={c.value} onClick={() => update('threadColor', c.value)} className={`w-9 h-9 rounded-full border-2 transition-all ${config.threadColor === c.value ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-border'}`} style={{ background: c.value }} title={c.label} />
              ))}
            </div>
          </Section>

          {config.addSash && (
            <Section label="لون الوشاح">
              <div className="flex gap-2">
                {SASH_COLORS.map(c => (
                  <button key={c.value} onClick={() => update('sashColor', c.value)} className={`w-9 h-9 rounded-full border-2 transition-all ${config.sashColor === c.value ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-border'}`} style={{ background: c.value }} title={c.label} />
                ))}
              </div>
            </Section>
          )}

          <Section label="التغليف">
            <div className="flex gap-2">
              <button onClick={() => update('packaging', true)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.packaging ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>إضافة تغليف +{product.packaging_addon || 15} ر.س</button>
              <button onClick={() => update('packaging', false)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${!config.packaging ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>بدون</button>
            </div>
          </Section>

          <div className="flex items-center gap-3 mb-4 mt-6">
            <div className="flex items-center gap-1 border border-border rounded-full p-1">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center"><Minus className="w-4 h-4" /></button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={handleAdd} disabled={!product.in_stock} className="flex-1 py-3.5 btn-primary disabled:opacity-50 inline-flex items-center justify-center gap-2 text-sm">
              {added ? <><Check className="w-4 h-4" /> تمت الإضافة</> : <><ShoppingBag className="w-4 h-4" /> إضافة إلى السلة — {totalPrice} ر.س</>}
            </button>
          </div>

          {!product.in_stock && <p className="text-sm text-destructive font-medium mb-4">غير متوفر حاليًا</p>}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && product.in_stock && (
            <p className="text-sm text-orange-500 font-medium mb-4">متبقي {product.stock_quantity} قطع فقط — اطلب الآن!</p>
          )}

          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border">
            {[{ icon: Truck, label: 'توصيل سريع' }, { icon: RotateCcw, label: 'إرجاع خلال 7 أيام' }, { icon: ShieldCheck, label: 'ضمان الجودة' }].map((t, i) => (
              <div key={i} className="text-center">
                <t.icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-xs text-foreground/55">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-2 border-b border-border mb-6">
          {tabs.map(t => (
            <button key={t.k} onClick={() => setActiveTab(t.k)} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t.k ? 'border-primary text-primary' : 'border-transparent text-foreground/50 hover:text-foreground'}`}>{t.l}</button>
          ))}
        </div>
        {activeTab === 'description' && (
          <div className="max-w-none text-foreground/70 leading-relaxed text-sm">
            <p>{product.description || 'منتج فاخر بخامات عالية وتطريز يدوي أنيق.'}</p>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-foreground/20'}`} />)}
            </div>
            <p className="font-bold text-2xl">{product.rating || 5}</p>
            <p className="text-sm text-foreground/55">بناءً على تقييمات العملاء</p>
          </div>
        )}
        {activeTab === 'size' && <MeasurementGuide />}
      </div>
    </div>
  );
}