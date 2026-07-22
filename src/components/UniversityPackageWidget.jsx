import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { Type, Palette, RotateCcw, ShoppingBag, Check, ZoomIn, Image as ImageIcon, Upload, X, Loader2, GraduationCap, Ruler } from 'lucide-react';
import { FONTS, THREAD_COLORS, SASH_COLORS, SashCanvas } from './SashSimulatorWidget';
import { CAP_COLORS, TASSEL_COLORS, CapCanvas } from './CapSimulatorWidget';
import { uploadFile } from '@/api/storage';

// أسماء جامعات شائعة + مجموعة ألوان مقترحة لكل واحدة (تصميم أصلي، يقدر الزبون يغيّرها بحرية)
const UNIVERSITIES = [
  { id: 'custom', name: 'تصميم حر (بدون جامعة)', sash: 1, cap: 5, tassel: 0, thread: 0 },
  { id: 'jeddah', name: 'جامعة جدة', sash: 2, cap: 1, tassel: 0, thread: 0 },
  { id: 'kau', name: 'جامعة الملك عبدالعزيز', sash: 1, cap: 0, tassel: 0, thread: 0 },
  { id: 'uqu', name: 'جامعة أم القرى', sash: 4, cap: 4, tassel: 0, thread: 0 },
  { id: 'taibah', name: 'جامعة طيبة', sash: 6, cap: 4, tassel: 0, thread: 0 },
  { id: 'taif', name: 'جامعة الطائف', sash: 3, cap: 3, tassel: 3, thread: 5 },
  { id: 'ksu', name: 'جامعة الملك سعود', sash: 0, cap: 2, tassel: 0, thread: 0 },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const YEARS = ['2026', '1447', '2027', '1448'];

export default function UniversityPackageWidget({ productName = 'بكج تخرج جامعي (عباية + كاب + وشاح)', productPrice = 190 }) {
  const [uni, setUni] = useState(UNIVERSITIES[0]);
  const [sashColor, setSashColor] = useState(SASH_COLORS[UNIVERSITIES[0].sash]);
  const [capColor, setCapColor] = useState(CAP_COLORS[UNIVERSITIES[0].cap]);
  const [tassel, setTassel] = useState(TASSEL_COLORS[UNIVERSITIES[0].tassel]);
  const [thread, setThread] = useState(THREAD_COLORS[UNIVERSITIES[0].thread]);
  const [name, setName] = useState('');
  const [year, setYear] = useState(YEARS[0]);
  const [font, setFont] = useState(FONTS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoImg, setLogoImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const fileRef = useRef(null);

  const text = [name, year].filter(Boolean).join(' — ');

  const pickUniversity = (u) => {
    setUni(u);
    setSashColor(SASH_COLORS[u.sash]);
    setCapColor(CAP_COLORS[u.cap]);
    setTassel(TASSEL_COLORS[u.tassel]);
    setThread(THREAD_COLORS[u.thread]);
  };

  const handleLogoPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadFile({ file });
      setLogoUrl(file_url);
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setLogoImg(img);
      img.src = file_url;
    } catch (err) {
      console.error('logo upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const clearLogo = () => {
    setLogoUrl('');
    setLogoImg(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const reset = () => {
    pickUniversity(UNIVERSITIES[0]);
    setName('');
    setYear(YEARS[0]);
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
      capColor: capColor.name,
      tassel: tassel.name,
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
      {/* المعاينة الحية: الوشاح + الكاب معاً */}
      <div className="lg:col-span-3 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card-soft overflow-hidden bg-gradient-to-b from-secondary/20 to-card p-2 sm:p-3">
            <SashCanvas
              text={text}
              fontStyle={font.style}
              sashColor={sashColor.value}
              sashLight={sashColor.light}
              threadColor={thread.value}
              threadGlow={thread.glow}
              fontSize={22}
            />
          </div>
          <div className="card-soft overflow-hidden bg-gradient-to-b from-secondary/20 to-card p-2 sm:p-3">
            <CapCanvas
              capColor={capColor.value}
              capLight={capColor.light}
              tasselColor={tassel.value}
              mode={logoImg ? 'logo' : 'text'}
              text={name}
              fontStyle={font.style}
              threadColor={thread.value}
              threadGlow={thread.glow}
              logoImg={logoImg}
            />
          </div>
        </div>
        <p className="text-center text-xs text-foreground/50 flex items-center justify-center gap-1">
          <ZoomIn className="w-3 h-3" />
          معاينة حية للبكج الكامل — عباية + كاب + وشاح
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
          <label className="flex items-center gap-2 text-sm font-bold mb-2">سنة التخرج</label>
          <div className="flex flex-wrap gap-2">
            {YEARS.map(y => (
              <button key={y} onClick={() => setYear(y)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${year === y ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}>{y}</button>
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
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><ImageIcon className="w-4 h-4 text-primary" /> شعار الجامعة على الكاب (اختياري)</label>
          {!logoUrl ? (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full py-5 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-sm text-foreground/60 transition-colors"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {uploading ? 'جاري الرفع...' : 'اضغط لرفع صورة الشعار'}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="الشعار" className="w-14 h-14 rounded-lg object-cover border border-border" />
              <button onClick={clearLogo} className="text-sm text-destructive inline-flex items-center gap-1 hover:opacity-70">
                <X className="w-4 h-4" /> إزالة
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoPick} className="hidden" />
        </div>

        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون الوشاح</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {SASH_COLORS.map(c => (
              <button key={c.value} onClick={() => setSashColor(c)} title={c.name} className={`w-7 h-7 rounded-full border-2 transition-all ${sashColor.value === c.value ? 'border-primary scale-125' : 'border-border'}`} style={{ background: `linear-gradient(135deg, ${c.light}, ${c.value})` }} />
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون الكاب</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {CAP_COLORS.map(c => (
              <button key={c.value} onClick={() => setCapColor(c)} title={c.name} className={`w-7 h-7 rounded-full border-2 transition-all ${capColor.value === c.value ? 'border-primary scale-125' : 'border-border'}`} style={{ background: `linear-gradient(135deg, ${c.light}, ${c.value})` }} />
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
              : <><ShoppingBag className="w-4 h-4" /> أضف البكج للسلة — {productPrice} ر.س</>}
          </button>
        </div>
      </div>
    </div>
  );
}
