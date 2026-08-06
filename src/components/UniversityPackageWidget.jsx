import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { Type, Palette, RotateCcw, ShoppingBag, Check, ZoomIn, Image as ImageIcon, Upload, X, Loader2, GraduationCap, Ruler } from 'lucide-react';
import { FONTS, THREAD_COLORS, SASH_COLORS, SASH_DATES, DATE_DESIGNS, SashCanvas } from './SashSimulatorWidget';
import { uploadFile } from '@/api/storage';

// أسماء جامعات شائعة + لون وشاح وشعار مقترح لكل واحدة (شعارات تصميم أصلي بسيط، يقدر الزبون يستبدلها برفع شعاره الخاص)
const UNIVERSITIES = [
  { id: 'custom', name: 'تصميم حر (بدون جامعة)', sash: 1, thread: 0, logo: '' },
  { id: 'jeddah', name: 'جامعة جدة', sash: 2, thread: 0, logo: '/images/universities/jeddah.svg' },
  { id: 'kau', name: 'جامعة الملك عبدالعزيز', sash: 1, thread: 0, logo: '/images/universities/kau.svg' },
  { id: 'uqu', name: 'جامعة أم القرى', sash: 4, thread: 0, logo: '/images/universities/uqu.svg' },
  { id: 'taibah', name: 'جامعة طيبة', sash: 6, thread: 0, logo: '/images/universities/taibah.svg' },
  { id: 'taif', name: 'جامعة الطائف', sash: 3, thread: 5, logo: '/images/universities/taif.svg' },
  { id: 'ksu', name: 'جامعة الملك سعود', sash: 0, thread: 0, logo: '/images/universities/ksu.svg' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function UniversityPackageWidget({ productName = 'صمم وشاحك', productPrice = 190 }) {
  const [uni, setUni] = useState(UNIVERSITIES[0]);
  const [sashColor, setSashColor] = useState(SASH_COLORS[UNIVERSITIES[0].sash]);
  const [thread, setThread] = useState(THREAD_COLORS[UNIVERSITIES[0].thread]);
  const [name, setName] = useState('');
  const [year, setYear] = useState(SASH_DATES[0]);
  const [dateDesign, setDateDesign] = useState(null);
  const [font, setFont] = useState(FONTS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const fileRef = useRef(null);

  const text = name;

  const pickUniversity = (u) => {
    setUni(u);
    setSashColor(SASH_COLORS[u.sash]);
    setThread(THREAD_COLORS[u.thread]);
    setLogoUrl(u.logo || '');
  };

  const handleLogoPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadFile({ file });
      setLogoUrl(file_url);
    } catch (err) {
      console.error('logo upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const clearLogo = () => {
    setLogoUrl('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const reset = () => {
    pickUniversity(UNIVERSITIES[0]);
    setName('');
    setYear(SASH_DATES[0]);
    setFont(FONTS[0]);
    setSize(SIZES[1]);
    clearLogo();
  };

  const handleAdd = () => {
    const config = {
      university: uni.name,
      name: name || 'بدون اسم',
      year,
      font: font.name,
      size,
      sashColor: sashColor.name,
      thread: thread.name,
      logo_url: logoUrl || '',
    };
    addItem({
      id: `uni-pkg-${Date.now()}`,
      name: `${productName} — ${uni.name} (${size})`,
      price: productPrice,
      image_url: logoUrl || '',
      sash_config: JSON.stringify(config),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* المعاينة الحية: الوشاح على الصورة الحقيقية */}
      <div className="lg:col-span-3 space-y-4">
        <div className="card-soft overflow-hidden bg-gradient-to-b from-secondary/20 to-card p-2 sm:p-4 max-w-md mx-auto">
          <SashCanvas
            text={text}
            date={year}
            fontStyle={font.style}
            sashColor={sashColor.value}
            threadColor={thread.value}
            threadGlow={thread.glow}
            fontSize={26}
            logoUrl={logoUrl}
            dateImgUrl={dateDesign?.img}
          />
        </div>
        <p className="text-center text-xs text-foreground/50 flex items-center justify-center gap-1">
          <ZoomIn className="w-3 h-3" />
          معاينة حية على صورة المنتج الحقيقية
        </p>

        {/* اختيار الجامعة */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-3"><GraduationCap className="w-4 h-4 text-primary" /> اختر الجامعة (تعبئة ألوان تلقائية، وتقدر تعدّلها بعدين)</label>
          <div className="flex flex-wrap gap-2">
            {UNIVERSITIES.map(u => (
              <button
                key={u.id}
                onClick={() => pickUniversity(u)}
                className={`px-3.5 py-2 rounded-full border text-sm transition-all ${uni.id === u.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* خيارات التخصيص */}
      <div className="lg:col-span-2 space-y-3">
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Type className="w-4 h-4 text-primary" /> اسم الخريج</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            placeholder="اكتب اسمك هنا"
            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/40 focus:bg-card focus:border-primary focus:outline-none text-lg text-center"
            style={{ fontFamily: font.style }}
          />
        </div>

        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2">سنة التخرج / التاريخ</label>
          <select value={year} onChange={e => { setYear(e.target.value); setDateDesign(null); }} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:outline-none focus:border-primary mb-3">
            {SASH_DATES.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <p className="text-xs text-foreground/50 mb-2">أو اختر تصميم سنة مزخرف جاهز:</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setDateDesign(null)} className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${!dateDesign ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40'}`}>كتابة عادية</button>
            {DATE_DESIGNS.map(d => (
              <button key={d.id} onClick={() => setDateDesign(d)} className={`p-1.5 rounded-xl border-2 transition-all ${dateDesign?.id === d.id ? 'border-primary scale-105' : 'border-border'}`}>
                <img src={d.img} alt={d.label} className="w-10 h-14 object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Type className="w-4 h-4 text-primary" /> نوع الخط</label>
          <div className="grid grid-cols-4 gap-1.5">
            {FONTS.map(f => (
              <button
                key={f.id}
                onClick={() => setFont(f)}
                className={`py-2 rounded-lg border text-sm transition-all ${font.id === f.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}
                style={{ fontFamily: f.style }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Ruler className="w-4 h-4 text-primary" /> مقاس العباية</label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(s => (
              <button key={s} onClick={() => setSize(s)} className={`min-w-[48px] px-4 py-2 rounded-xl border text-sm font-medium transition-all ${size === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-3"><ImageIcon className="w-4 h-4 text-primary" /> شعار الجامعة</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {UNIVERSITIES.filter(u => u.logo).map(u => (
              <button key={u.id} onClick={() => setLogoUrl(u.logo)} title={u.name} className={`aspect-square rounded-xl border-2 overflow-hidden transition-all ${logoUrl === u.logo ? 'border-primary scale-105' : 'border-border hover:border-primary/40'}`}>
                <img src={u.logo} alt={u.name} className="w-full h-full object-cover" />
              </button>
            ))}
            <button onClick={clearLogo} className={`aspect-square rounded-xl border-2 flex items-center justify-center text-[10px] font-medium transition-all ${!logoUrl ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground/50 hover:border-primary/40'}`}>بدون</button>
          </div>
          {logoUrl && !UNIVERSITIES.some(u => u.logo === logoUrl) && (
            <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-secondary/40">
              <img src={logoUrl} alt="الشعار" className="w-10 h-10 rounded-lg object-cover border border-border" />
              <span className="text-xs text-foreground/60">شعارك المرفوع</span>
              <button onClick={clearLogo} className="text-xs text-destructive inline-flex items-center gap-1 hover:opacity-70 mr-auto"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center gap-2 text-xs text-foreground/60 transition-colors"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'جاري الرفع...' : 'جامعتك مو موجودة؟ ارفع شعارها بنفسك'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoPick} className="hidden" />
        </div>


        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون الوشاح</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {SASH_COLORS.map(c => (
              <button key={c.value} onClick={() => setSashColor(c)} title={c.name} className={`w-7 h-7 rounded-full border-2 transition-all ${sashColor.value === c.value ? 'border-primary scale-125' : 'border-border'}`} style={{ background: `linear-gradient(135deg, ${c.light}, ${c.value})` }} />
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون التطريز</label>
          <div className="flex flex-wrap gap-2">
            {THREAD_COLORS.map(c => (
              <button key={c.value} onClick={() => setThread(c)} title={c.name} className={`w-7 h-7 rounded-full border-2 transition-all ${thread.value === c.value ? 'border-primary scale-125' : 'border-border'}`} style={{ background: c.value }} />
            ))}
          </div>
        </div>

        <div className="flex gap-2.5">
          <button onClick={reset} className="px-4 py-3 rounded-full border border-border bg-card font-medium text-sm hover:bg-secondary inline-flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> إعادة
          </button>
          <button onClick={handleAdd} className="flex-1 py-3 btn-primary inline-flex items-center justify-center gap-2">
            {added
              ? <><Check className="w-4 h-4" /> تمت الإضافة</>
              : <><ShoppingBag className="w-4 h-4" /> أضف وشاحك للسلة — {productPrice} </>}
          </button>
        </div>
      </div>
    </div>
  );
}
