import React, { useState } from 'react';
import { Star, Plus, Minus, ShoppingBag, Check, Flame, Truck, ShieldCheck, Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import ProductGallery from './ProductGallery';
import MeasurementGuide from './MeasurementGuide';
import RobeBuilder from './RobeBuilder';
import JacketBuilder from './JacketBuilder';
import { useCart } from '@/lib/cartContext';
import { uploadFile } from '@/api/storage';
import { FONTS, THREAD_COLORS, SASH_COLORS, SASH_DATES, DATE_DESIGNS } from './SashSimulatorWidget';
import { ROBE_SHAPES, UNIVERSITIES, UNIVERSITY_SASH_LAYOUTS } from '@/lib/robeOptions';
import { JACKET_CUSTOM_DESIGN_FEE } from '@/lib/jacketOptions';

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
  const [logoUploading, setLogoUploading] = useState(false);
  const [sashLayoutUploading, setSashLayoutUploading] = useState(false);
  const { addItem } = useCart();

  const [config, setConfig] = useState({
    addSash: false,
    name: '',
    font: FONTS[0],
    date: '',
    dateDesign: null,
    size: product.sizes?.[0] || '',
    height: '',
    capType: 'دائري',
    capText: '',
    capTasselColor: 'gold',
    thread: THREAD_COLORS[0],
    sash: SASH_COLORS[0],
    logoUrl: '',
    packaging: false,
    // الوشاح (منتج مستقل)
    leftText: '',
    lineStyle: 'decorative',
    lineColor: 'gold',
    addPlainCap: false,
    sashLayoutPhoto: '',
    // خيارات الروب التفصيلية
    robeShape: ROBE_SHAPES[0].id,
    sleeveStyle: 'plain',
    sashShape: 'regular',
    sashTrim: 'braid',
    embroideryDirection: 'length',
    sashBackEmbroidery: false,
    capEmbroideryDesign: null,
    // روب الجامعة
    university: UNIVERSITIES[0].id,
    universitySashLayout: UNIVERSITY_SASH_LAYOUTS[0].id,
    universitySashShape: 'regular',
    universityWritingColor: 'gold',
    universitySashTrim: 'braid',
    // الجاكيت
    sleeveColor: '',
    frontDesigns: [],
    leftSleeveDesigns: [],
    rightSleeveDesigns: [],
    backDesign: null,
    designPhotos: {},
    referencePhotos: [],
  });

  const update = (key, val) => setConfig(c => ({ ...c, [key]: val }));

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const { file_url } = await uploadFile({ file });
      update('logoUrl', file_url);
    } catch { /* الشعار اختياري، نتجاهل الخطأ بصمت */ }
    setLogoUploading(false);
    e.target.value = '';
  };

  const handleSashLayoutUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSashLayoutUploading(true);
    try {
      const { file_url } = await uploadFile({ file });
      if (file_url) update('sashLayoutPhoto', file_url);
    } catch { /* لو فشل الرفع، الصورة تبقى فاضية والعميل يقدر يعيد المحاولة */ }
    setSashLayoutUploading(false);
    e.target.value = '';
  };

  const gallery = product.gallery_images?.length ? product.gallery_images : [product.image_url].filter(Boolean);
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  const robeShapeAddon = (() => {
    if (!product.has_robe_builder) return 0;
    const shape = ROBE_SHAPES.find(s => s.id === config.robeShape);
    return shape?.addonKey ? (product[shape.addonKey] || 0) : 0;
  })();
  const capEmbroideryAddon = (product.has_robe_builder && product.has_cap && config.capEmbroideryDesign) ? (product.cap_embroidery_addon || 20) : 0;
  const sashBackEmbroideryAddon = ((product.has_robe_builder && config.addSash) || product.has_sash) && config.sashBackEmbroidery ? (product.sash_back_embroidery_addon || 20) : 0;
  const plainCapAddon = (product.has_sash && config.addPlainCap) ? (product.plain_cap_addon || 30) : 0;

  const jacketCustomDesignCount = product.has_jacket_builder
    ? [(config.frontDesigns || []).includes(2), (config.leftSleeveDesigns || []).includes(5), (config.rightSleeveDesigns || []).includes(8)].filter(Boolean).length
    : 0;
  const jacketCustomDesignFee = jacketCustomDesignCount * JACKET_CUSTOM_DESIGN_FEE;

  const addonPrice = (config.addSash ? (product.sash_addon || 50) : 0)
    + (config.packaging ? (product.packaging_addon || 15) : 0)
    + robeShapeAddon + capEmbroideryAddon + sashBackEmbroideryAddon + jacketCustomDesignFee + plainCapAddon;
  const unitPrice = product.price + addonPrice;
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    const summary = [
      config.addSash && `وشاح (${config.sash.name})`,
      config.name && !product.has_jacket_builder && !product.has_sash && `الاسم: ${config.name}`,
      product.has_sash && config.name && `الجهة اليمين: ${config.name}`,
      product.has_sash && config.leftText && `الجهة اليسار: ${config.leftText}`,
      product.has_sash && `نوع الخط: ${config.lineStyle === 'decorative' ? 'مزخرف' : 'بدون زخرفة'}`,
      product.has_sash && `لون الخط: ${config.lineColor === 'gold' ? 'ذهبي' : 'فضي'}`,
      config.date && `التاريخ: ${config.date}`,
      config.dateDesign && `تصميم سنة مزخرف: ${config.dateDesign.label}`,
      config.size && `مقاس: ${config.size}`,
      config.height && `الطول المطلوب: ${config.height} سم`,
      product.has_cap && config.capText && `النص: ${config.capText}`,
      product.has_cap && `شكل القبعة: ${config.capType} | لون الهدب: ${config.capTasselColor === 'gold' ? 'ذهبي' : 'فضي'}`,
      config.logoUrl && 'مع شعار',
      config.packaging && 'تغليف فاخر',
      plainCapAddon > 0 && `إضافة قبعة سادة (+${plainCapAddon} ريال)`,
      // خيارات الروب التفصيلية
      product.has_university && `الجامعة: ${UNIVERSITIES.find(u => u.id === config.university)?.label}`,
      product.has_university && `تصميم وشاح الجامعة: ${UNIVERSITY_SASH_LAYOUTS.find(l => l.id === config.universitySashLayout)?.label}`,
      product.has_university && `لون كتابة الوشاح: ${config.universityWritingColor}`,
      product.has_robe_builder && `شكل الروب: ${ROBE_SHAPES.find(s => s.id === config.robeShape)?.label}`,
      product.has_robe_builder && `موديل الكم: ${config.sleeveStyle}`,
      product.has_robe_builder && config.addSash && `شكل الوشاح: ${config.sashShape} | طرف الوشاح: ${config.sashTrim} | اتجاه التطريز: ${config.embroideryDirection}`,
      sashBackEmbroideryAddon > 0 && `تطريز إضافي بخلف الوشاح (+${sashBackEmbroideryAddon} ريال)`,
      capEmbroideryAddon > 0 && `تطريز القبعة: تصميم رقم ${config.capEmbroideryDesign}`,
    ].filter(Boolean).join(' | ');

    // تفاصيل الجاكيت تُبنى كـ JSON مستقل حتى تظهر الصور المرفقة كصور قابلة للفتح في لوحة تحكم الأدمن
    const jacketSegment = product.has_jacket_builder ? JSON.stringify({
      jacketName: config.name || undefined,
      sleeveColor: config.sleeveColor || undefined,
      frontDesign: config.frontDesigns?.length ? config.frontDesigns.map(id => `${id}${id === 2 ? ' (خاص +' + JACKET_CUSTOM_DESIGN_FEE + ' ريال)' : ' (مجاني)'}`).join(' + ') : undefined,
      leftSleeveDesign: config.leftSleeveDesigns?.length ? config.leftSleeveDesigns.map(id => `${id}${id === 5 ? ' (خاص +' + JACKET_CUSTOM_DESIGN_FEE + ' ريال)' : ' (مجاني)'}`).join(' + ') : undefined,
      rightSleeveDesign: config.rightSleeveDesigns?.length ? config.rightSleeveDesigns.map(id => `${id}${id === 8 ? ' (خاص +' + JACKET_CUSTOM_DESIGN_FEE + ' ريال)' : ' (مجاني)'}`).join(' + ') : undefined,
      backDesign: config.backDesign ? 'مفعّل (مجاني)' : undefined,
      designPhotos: Object.keys(config.designPhotos || {}).length ? config.designPhotos : undefined,
      referencePhotos: config.referencePhotos?.length ? config.referencePhotos : undefined,
      customDesignFee: jacketCustomDesignFee > 0 ? `${jacketCustomDesignFee} ريال (${jacketCustomDesignCount} تصميم خاص)` : undefined,
    }) : null;

    // صورة توضيح ترتيب الكلام على الوشاح (لو رفعها العميل) — JSON مستقل حتى تظهر كصورة قابلة للفتح
    const sashSegment = (product.has_sash && config.sashLayoutPhoto) ? JSON.stringify({
      sashLayoutPhoto: config.sashLayoutPhoto,
    }) : null;

    const fullSummary = [summary, jacketSegment, sashSegment].filter(Boolean).join(' | ');

    addItem({ ...product, product_id: product.id, id: `${product.id}-${Date.now()}`, price: unitPrice, qty, size: config.size, sash_config: fullSummary });
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

          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">{product.name}</h1>
          <p className="kicker mb-3">{product.category}</p>

          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-foreground/60">تم شراءه: <strong className="text-foreground">{product.purchase_count || 0}</strong> مرة</span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display text-3xl font-bold text-primary">{unitPrice} </span>
            {product.old_price > 0 && <span className="text-foreground/40 text-lg line-through">{product.old_price}</span>}
          </div>

          <div className="bg-secondary/40 rounded-xl p-3 mb-5 text-sm">
            <span className="text-foreground/60">ابتداءً من <strong className="text-primary">{Math.ceil(unitPrice / 4)} </strong> /شهر أو على 4 دفعات بدون فوائد</span>
          </div>

          {product.has_sash && (
            <Section label="إضافة وشاح" required>
              <div className="flex gap-2">
                <button onClick={() => update('addSash', true)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.addSash ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>إضافة وشاح +{product.sash_addon || 50} </button>
                <button onClick={() => update('addSash', false)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${!config.addSash ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>بدون</button>
              </div>
            </Section>
          )}

          {(product.has_robe_builder || product.has_university) && <RobeBuilder product={product} config={config} update={update} />}

          {product.has_jacket_builder && <JacketBuilder config={config} update={update} />}

          {product.has_name && (
            <Section label="اكتب اسمك" required>
              <input value={config.name} onChange={e => update('name', e.target.value)} placeholder="الاسم ثنائي أو ثلاثي" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            </Section>
          )}


          {product.has_date && (
            <Section label="إضافة تاريخ" required>
              <select value={config.date} onChange={e => { update('date', e.target.value); update('dateDesign', null); }} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:outline-none focus:border-primary mb-3">
                <option value="">اختر...</option>
                {SASH_DATES.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {product.has_sash && (
                <>
                  <p className="text-xs text-foreground/50 mb-2">أو اختر تصميم سنة مزخرف جاهز:</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => update('dateDesign', null)} className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${!config.dateDesign ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40'}`}>كتابة عادية</button>
                    {DATE_DESIGNS.map(d => (
                      <button type="button" key={d.id} onClick={() => update('dateDesign', d)} className={`p-1.5 rounded-xl border-2 transition-all ${config.dateDesign?.id === d.id ? 'border-primary scale-105' : 'border-border'}`}>
                        <img src={d.img} alt={d.label} className="w-10 h-14 object-contain" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Section>
          )}

          {product.has_sash && (
            <>
              <Section label="الجهة اليمين ( يُفضل كتابة إسمك فقط )" required>
                <input value={config.name} onChange={e => update('name', e.target.value)} placeholder="مثال: فاطمه عبدالله" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
              </Section>

              <Section label="الجهة اليسار ( ممكن تكتب عام التخرج وتخصصك وسوف يتم ترتيبها بالطريقة المناسبة )" required>
                <input value={config.leftText} onChange={e => update('leftText', e.target.value)} placeholder="مثال: ادارة أعمال جامعة الملك فيصل 2025" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
              </Section>

              <Section label="نوع الخط" required>
                <div className="flex gap-2">
                  <button onClick={() => update('lineStyle', 'decorative')} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.lineStyle === 'decorative' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>مزخرف</button>
                  <button onClick={() => update('lineStyle', 'plain')} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.lineStyle === 'plain' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>بدون زخرفة</button>
                </div>
              </Section>

              <Section label="لون الخط" required>
                <div className="flex gap-2">
                  <button onClick={() => update('lineColor', 'gold')} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.lineColor === 'gold' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>ذهبي</button>
                  <button onClick={() => update('lineColor', 'silver')} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.lineColor === 'silver' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>فضي</button>
                </div>
              </Section>

              <Section label="الاضافات" required>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => update('addPlainCap', true)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.addPlainCap ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>اضافة قبعة سادة (+{product.plain_cap_addon || 30} )</button>
                  <button onClick={() => update('addPlainCap', false)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${!config.addPlainCap ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>فقط وشاح تخرج</button>
                </div>
              </Section>

              <Section label="اضافة تطريز على الظهر ( خلفي )" required>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => update('sashBackEmbroidery', false)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${!config.sashBackEmbroidery ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>بدون تطريز خلفي</button>
                  <button onClick={() => update('sashBackEmbroidery', true)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.sashBackEmbroidery ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>مع تطريز خلفي (+{product.sash_back_embroidery_addon || 20} )</button>
                </div>
              </Section>

              <Section label="ارفع صورة توضح لنا ترتيب الكلام على الوشاح (اختياري)">
                {config.sashLayoutPhoto ? (
                  <div className="flex items-center gap-3">
                    <img src={config.sashLayoutPhoto} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                    <button type="button" onClick={() => update('sashLayoutPhoto', '')} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary text-xs font-medium cursor-pointer hover:bg-primary/5 transition-colors">
                    {sashLayoutUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {sashLayoutUploading ? 'جارٍ الرفع...' : 'ارفع صورة'}
                    <input type="file" accept="image/*" onChange={handleSashLayoutUpload} disabled={sashLayoutUploading} className="hidden" />
                  </label>
                )}
              </Section>
            </>
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

          {product.sizes?.length > 0 && !product.has_jacket_builder && (
            <Section label="طولك (سم)">
              <input
                type="number"
                inputMode="numeric"
                min="100"
                max="230"
                placeholder="مثال: 165"
                value={config.height}
                onChange={(e) => update('height', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-xs text-foreground/45 mt-1.5">اختياري — يساعدنا نتأكد إن المقاس مناسب لطولك. لو غير متأكد، سيبه فاضي.</p>
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

          {product.has_cap && (
            <Section label="الإسم + العبارة المطلوبة + عام التخرج" required>
              <input value={config.capText} onChange={e => update('capText', e.target.value)} placeholder="مثال: سارة أحمد - إدارة أعمال - 2025" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
            </Section>
          )}

          {product.has_cap && (
            <Section label="لون هدب القبعة ( خيط القبعة )" required>
              <div className="flex gap-2">
                <button onClick={() => update('capTasselColor', 'gold')} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.capTasselColor === 'gold' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>ذهبي</button>
                <button onClick={() => update('capTasselColor', 'silver')} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.capTasselColor === 'silver' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>فضي</button>
              </div>
            </Section>
          )}

          {config.addSash && (
            <Section label="لون الوشاح">
              <div className="flex flex-wrap gap-2">
                {SASH_COLORS.map(c => (
                  <button key={c.value} onClick={() => update('sash', c)} className={`w-9 h-9 rounded-full border-2 transition-all ${config.sash.value === c.value ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-border'}`} style={{ background: `linear-gradient(135deg, ${c.light}, ${c.value})` }} title={c.name} />
                ))}
              </div>
            </Section>
          )}

          <Section label="التغليف">
            <div className="flex gap-2">
              <button onClick={() => update('packaging', true)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.packaging ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>إضافة تغليف +{product.packaging_addon || 15} </button>
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
              {added ? <><Check className="w-4 h-4" /> تمت الإضافة</> : <><ShoppingBag className="w-4 h-4" /> إضافة إلى السلة — {totalPrice} </>}
            </button>
          </div>

          {!product.in_stock && <p className="text-sm text-destructive font-medium mb-4">غير متوفر حاليًا</p>}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && product.in_stock && (
            <p className="text-sm text-orange-500 font-medium mb-4">متبقي {product.stock_quantity} قطع فقط — اطلب الآن!</p>
          )}

          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border">
            {[{ icon: Truck, label: 'توصيل سريع' }, { icon: ShieldCheck, label: 'ضمان الجودة' }].map((t, i) => (
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
        {activeTab === 'size' && <MeasurementGuide category={product.category || ''} />}
      </div>
    </div>
  );
}