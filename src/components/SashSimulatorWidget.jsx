import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { uploadFile } from '@/api/storage';
import { Type, Palette, RotateCcw, ShoppingBag, Check, Ruler, ZoomIn, Image as ImageIcon, Loader2, X } from 'lucide-react';

const FONTS = [
  { id: 'thuluth-light', name: 'ثلث لايت', cls: 'font-thuluth', style: '"Amiri", serif' },
  { id: 'thuluth', name: 'الثلث', cls: 'font-thuluth', style: '"Amiri", serif' },
  { id: 'diwani', name: 'ديواني', cls: 'font-diwani', style: '"Aref Ruqaa", serif' },
  { id: 'monotype', name: 'Great Vibes (إنجليزي)', cls: 'font-body', style: '"Great Vibes", cursive' },
  { id: 'calisto', name: 'Playfair (إنجليزي)', cls: 'font-body', style: '"Playfair Display", serif' },
];

const SASH_COLORS = [
  { name: '(S001) كحلي شمواه', value: '#16233F', light: '#2C4066' },
  { name: '(S002) اسود شمواه', value: '#1C1C1C', light: '#3A3A3A' },
  { name: '(S003) زيتي شمواه', value: '#3D4A2A', light: '#5E7040' },
  { name: '(S004) عودي شمواه', value: '#4A1F2B', light: '#743349' },
  { name: '(F001) اسود', value: '#141414', light: '#333333' },
  { name: '(F002) ابيض', value: '#F5F5F5', light: '#FFFFFF' },
  { name: '(F003) سكري', value: '#EFE6D8', light: '#FBF6EC' },
  { name: '(F005) بيج غامق', value: '#8A7455', light: '#AC9670' },
  { name: '(F006) رمادي فاتح', value: '#B8B8B8', light: '#D6D6D6' },
  { name: '(F007) رمادي غامق', value: '#4A4A4A', light: '#6A6A6A' },
  { name: '(F008) سماوي', value: '#7EC8E3', light: '#A6DCEF' },
  { name: '(F009) ازرق', value: '#2455A4', light: '#4A78C8' },
  { name: '(F010) نيلي', value: '#2E2F6E', light: '#4B4C94' },
  { name: '(F011) كحلي', value: '#14213D', light: '#28395F' },
  { name: '(F012) تركواز', value: '#17A398', light: '#3FC4B8' },
  { name: '(F013) تيفني فاتح', value: '#A8DAD5', light: '#C8E9E5' },
  { name: '(F015) زيتي', value: '#556B2F', light: '#748F45' },
  { name: '(F016) وردي', value: '#E4A5C0', light: '#F0C4D6' },
  { name: '(F017) لحمي', value: '#E8B49C', light: '#F2CEB9' },
  { name: '(F018) عودي', value: '#5C1F2E', light: '#824156' },
];

const SASH_EDGE_COLORS = [
  { name: 'ذهبي', value: '#D4AF37' },
  { name: 'فضي', value: '#C0C0C0' },
  { name: 'بدون', value: 'transparent' },
];

const SASH_DATES = ['2026', '2026 S', '2026 C', 'ClassC 26', 'Class 26', 'ClassO 26', '1447', '1447 هـ', '2025', '2025C', '2025S', 'عبارة'];

const THREAD_COLORS = [
  { name: 'ذهبي', value: '#D4AF37', glow: '#f5d76e' },
  { name: 'فضي', value: '#C0C0C0', glow: '#e8e8e8' },
  { name: 'اسود', value: '#2A2A2A', glow: '#555' },
];

export { FONTS, SASH_COLORS, THREAD_COLORS, SASH_EDGE_COLORS, SASH_DATES, SashCanvas };

// الصورة الحقيقية للوشاح — نفس المنتج الفعلي (مو رسم توضيحي)
const SASH_IMG_SRC = '/images/products/sash/view1.webp';

// إحداثيات محسوبة بدقة من أبعاد الصورة الحقيقية (933×700) لتحديد مكان
// الشريطين المستقيمين بالضبط، حتى يوضع النص بمكانه الصحيح تمامًا
const STRAP_LEFT_X = 0.374;   // مركز الشريط الأيسر (كنسبة من عرض الصورة)
const STRAP_RIGHT_X = 0.639;  // مركز الشريط الأيمن
const STRAP_MAX_TEXT_W = 0.30; // أقصى عرض نص داخل شريط واحد
const TEXT_CENTER_Y = 0.60;    // منتصف المنطقة المستقيمة (كنسبة من ارتفاع الصورة) — للاسم
const LOGO_CENTER_X = STRAP_RIGHT_X; // الشعار يوضع أعلى الشريط الأيمن (نفس شريط التاريخ)
const LOGO_CENTER_Y = 0.40;
const LOGO_MAX_W = 0.16;
const DATE_CENTER_Y = 0.66;    // أسفل الشعار على نفس الشريط — أرقام السنة مرصوصة عموديًا

// معاينة الوشاح على الصورة الحقيقية بـ Canvas — إعادة تلوين + نص التطريز
// تصاميم سنة جاهزة (أرقام مرصوصة بشكل مزخرف + كاب تخرج) — بديل اختياري
// عن الكتابة العادية للتاريخ، تختار منها بدل ما تكتب رقم عادي
export const DATE_DESIGNS = [
  { id: '2026', label: '2026', img: '/images/dates/2026.svg' },
  { id: '2027', label: '2027', img: '/images/dates/2027.svg' },
  { id: '2028', label: '2028', img: '/images/dates/2028.svg' },
];

function SashCanvas({ text, date, fontStyle, sashColor, threadColor, threadGlow, fontSize, logoUrl, dateImgUrl }) {
  const canvasRef = useRef(null);
  const [baseImg, setBaseImg] = useState(null);
  const [logoImg, setLogoImg] = useState(null);
  const [dateImg, setDateImg] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setBaseImg(img);
    img.src = SASH_IMG_SRC;
  }, []);

  useEffect(() => {
    if (!logoUrl) { setLogoImg(null); return; }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setLogoImg(img);
    img.onerror = () => setLogoImg(null);
    img.src = logoUrl;
  }, [logoUrl]);

  useEffect(() => {
    if (!dateImgUrl) { setDateImg(null); return; }
    const img = new window.Image();
    img.onload = () => setDateImg(img);
    img.onerror = () => setDateImg(null);
    img.src = dateImgUrl;
  }, [dateImgUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImg) return;
    let cancelled = false;

    async function draw() {
      const ctx = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // خلفية ناعمة خلف الصورة
      ctx.fillStyle = '#f8f4f0';
      ctx.fillRect(0, 0, W, H);

      // ===== إعادة تلوين الصورة الحقيقية حسب اللون المختار (تحافظ على الطيات والظلال) =====
      const off = document.createElement('canvas');
      off.width = W; off.height = H;
      const octx = off.getContext('2d');
      octx.drawImage(baseImg, 0, 0, W, H);
      octx.globalCompositeOperation = 'source-atop';
      octx.fillStyle = sashColor;
      octx.fillRect(0, 0, W, H);
      octx.globalCompositeOperation = 'soft-light';
      octx.globalAlpha = 0.55;
      octx.drawImage(baseImg, 0, 0, W, H);
      octx.globalAlpha = 1;
      octx.globalCompositeOperation = 'source-over';

      ctx.drawImage(off, 0, 0);

      // مهم: لازم ننتظر تحميل الخط فعليًا قبل ما نرسمه على الكانفاس، وإلا
      // المتصفح يرسم بخط افتراضي بصمت حتى لو الخط المختار محمّل أصلاً بالصفحة
      // (مشكلة شائعة جدًا مع Canvas + خطوط ويب مخصصة)
      try {
        await document.fonts.load(`bold ${Math.min(fontSize, 30)}px ${fontStyle}`);
        await document.fonts.ready;
      } catch { /* لو فشل التحميل، يرجع للخط الافتراضي بدل ما يتوقف */ }
      if (cancelled) return;

      // ===== نص مطرّز بالمقاس الصحيح داخل حدود كل شريط (للاسم) =====
      const drawFittedText = (str, xFrac, yFrac) => {
        if (!str || !str.trim()) return;
        const x = W * xFrac;
        const y = H * yFrac;
        const maxWidth = W * STRAP_MAX_TEXT_W;
        let fs = Math.min(fontSize, 30);

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${fs}px ${fontStyle}`;
        while (ctx.measureText(str).width > maxWidth && fs > 10) {
          fs -= 1;
          ctx.font = `bold ${fs}px ${fontStyle}`;
        }
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = threadColor;
        ctx.globalAlpha = 0.95;
        ctx.fillText(str, x, y);
        ctx.shadowBlur = 6;
        ctx.shadowColor = threadGlow;
        ctx.globalAlpha = 0.35;
        ctx.fillText(str, x, y);
        ctx.restore();
      };

      // ===== التاريخ مرصوص عموديًا (رقم فوق رقم) — نفس أسلوب أيال =====
      const drawStackedDate = (str, xFrac, yFrac) => {
        if (!str || !str.trim()) return;
        const chars = str.trim().split('');
        const x = W * xFrac;
        const areaH = H * 0.34; // المساحة المتاحة أسفل الشعار على الشريط
        const lineH = Math.min(areaH / chars.length, W * 0.09);
        let fs = lineH * 0.85;
        const startY = H * yFrac - (lineH * (chars.length - 1)) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `800 ${fs}px ${fontStyle}`;
        chars.forEach((ch, i) => {
          const y = startY + i * lineH;
          ctx.shadowColor = 'rgba(0,0,0,0.55)';
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          ctx.fillStyle = threadColor;
          ctx.globalAlpha = 0.95;
          ctx.fillText(ch, x, y);
          ctx.shadowBlur = 6;
          ctx.shadowColor = threadGlow;
          ctx.globalAlpha = 0.35;
          ctx.fillText(ch, x, y);
        });
        ctx.restore();
      };

      if (dateImg) {
        const dh = H * 0.42;
        const dw = dh * (dateImg.width / dateImg.height);
        ctx.drawImage(dateImg, W * STRAP_RIGHT_X - dw / 2, H * 0.36, dw, dh);
      } else {
        drawStackedDate(date, STRAP_RIGHT_X, DATE_CENTER_Y);
      }
      drawFittedText(text, STRAP_LEFT_X, TEXT_CENTER_Y);

      // ===== الشعار: أعلى الشريط لو ما فيه تصميم سنة، أو بمكان أصغر أعلى لو موجود =====
      if (logoImg) {
        const logoY = dateImg ? 0.20 : LOGO_CENTER_Y;
        const lw = W * (dateImg ? LOGO_MAX_W * 0.75 : LOGO_MAX_W);
        const lh = lw * (logoImg.height / logoImg.width);
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.drawImage(logoImg, W * LOGO_CENTER_X - lw / 2, H * logoY - lh / 2, lw, lh);
        ctx.restore();
      }
    }

    draw();
    return () => { cancelled = true; };
  }, [baseImg, logoImg, dateImg, text, date, fontStyle, sashColor, threadColor, threadGlow, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      width={466}
      height={350}
      className="w-full h-auto rounded-xl"
      style={{ background: '#f8f4f0' }}
    />
  );
}

export default function SashSimulatorWidget({ productName = 'وشاح تخرج مخصص', productPrice = 150, compact = false }) {
  const [text, setText] = useState('');
  const [font, setFont] = useState(FONTS[0]);
  const [sashColor, setSashColor] = useState(SASH_COLORS[0]);
  const [thread, setThread] = useState(THREAD_COLORS[0]);
  const [edge, setEdge] = useState(SASH_EDGE_COLORS[0]);
  const [date, setDate] = useState(SASH_DATES[0]);
  const [dateDesign, setDateDesign] = useState(null);
  const [fontSize, setFontSize] = useState(28);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const { file_url } = await uploadFile({ file });
      setLogoUrl(file_url);
    } catch { /* تجاهل بصمت — الشعار اختياري */ }
    setLogoUploading(false);
    e.target.value = '';
  };

  const reset = () => {
    setText('');
    setFont(FONTS[0]);
    setSashColor(SASH_COLORS[0]);
    setThread(THREAD_COLORS[0]);
    setEdge(SASH_EDGE_COLORS[0]);
    setDate(SASH_DATES[0]);
    setDateDesign(null);
    setFontSize(28);
    setLogoUrl('');
  };

  const handleAdd = () => {
    const config = { text: text || 'بدون اسم', date, dateDesign: dateDesign?.label || '', font: font.name, sashColor: sashColor.name, thread: thread.name, edge: edge.name, logoUrl };
    addItem({
      id: `sash-${Date.now()}`,
      name: `${productName} — ${config.text}`,
      price: productPrice,
      image_url: '',
      sash_config: JSON.stringify(config),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className={`grid ${compact ? 'md:grid-cols-2' : 'lg:grid-cols-5'} gap-6`}>
      {/* معاينة الوشاح */}
      <div className={compact ? '' : 'lg:col-span-3'}>
        <div className="card-soft overflow-hidden bg-gradient-to-b from-secondary/20 to-card p-2 sm:p-4">
          <SashCanvas
            text={text}
            date={date}
            fontStyle={font.style}
            sashColor={sashColor.value}
            threadColor={thread.value}
            threadGlow={thread.glow}
            fontSize={fontSize}
            logoUrl={logoUrl}
            dateImgUrl={dateDesign?.img}
          />
        </div>
        <p className="text-center text-xs text-foreground/50 mt-2 flex items-center justify-center gap-1">
          <ZoomIn className="w-3 h-3" />
          معاينة حية للوشاح — المنتج الفعلي بتطريز يدوي
        </p>
      </div>

      {/* خيارات التخصيص */}
      <div className={`${compact ? '' : 'lg:col-span-2'} space-y-3`}>
        {/* النص */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Type className="w-4 h-4 text-primary" /> النص على الوشاح</label>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={20}
            placeholder="اكتب اسمك هنا"
            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/40 focus:bg-card focus:border-primary focus:outline-none text-lg text-center"
            style={{ fontFamily: font.style }}
          />
        </div>

        {/* الخط */}
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

        {/* لون الوشاح */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون الوشاح</label>
          <div className="flex flex-wrap gap-2">
            {SASH_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => setSashColor(c)}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 transition-all ${sashColor.value === c.value ? 'border-primary scale-125' : 'border-border'}`}
                style={{ background: `linear-gradient(135deg, ${c.light}, ${c.value})` }}
              />
            ))}
          </div>
          <p className="text-xs text-foreground/50 mt-1.5">{sashColor.name}</p>
        </div>

        {/* لون التطريز */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون التطريز</label>
          <div className="flex flex-wrap gap-2">
            {THREAD_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => setThread(c)}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 transition-all ${thread.value === c.value ? 'border-primary scale-125' : 'border-border'}`}
                style={{ background: c.value, boxShadow: thread.value === c.value ? `0 0 0 2px white, 0 0 0 4px ${c.value}` : undefined }}
              />
            ))}
          </div>
          <p className="text-xs text-foreground/50 mt-1.5">{thread.name}</p>
        </div>

        {/* لون الطرف */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> طرف الوشاح</label>
          <div className="flex flex-wrap gap-2">
            {SASH_EDGE_COLORS.map(c => (
              <button key={c.name} onClick={() => setEdge(c)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold border-2 transition-all ${edge.name === c.name ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40'}`}>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* التاريخ */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Type className="w-4 h-4 text-primary" /> التاريخ</label>
          <select value={date} onChange={e => { setDate(e.target.value); setDateDesign(null); }} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:outline-none focus:border-primary mb-3">
            {SASH_DATES.map(d => <option key={d} value={d}>{d}</option>)}
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

        {/* الشعار */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><ImageIcon className="w-4 h-4 text-primary" /> إضافة شعار (اختياري)</label>
          {logoUrl ? (
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="" className="w-14 h-14 rounded-lg object-contain border border-border bg-secondary/30" />
              <button type="button" onClick={() => setLogoUrl('')} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><X className="w-4 h-4" /></button>
              <span className="text-xs text-foreground/50">تم رفع الشعار</span>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary text-xs font-medium cursor-pointer hover:bg-primary/5 transition-colors">
              {logoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {logoUploading ? 'جارٍ الرفع...' : 'ارفع شعار جامعتك من جهازك'}
              <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} className="hidden" />
            </label>
          )}
        </div>

        {/* حجم الخط */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Ruler className="w-4 h-4 text-primary" /> حجم الخط: {fontSize}px</label>
          <input type="range" min={16} max={36} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full accent-primary" />
        </div>

        {/* الأزرار */}
        <div className="flex gap-2.5">
          <button onClick={reset} className="px-4 py-3 rounded-full border border-border bg-card font-medium text-sm hover:bg-secondary inline-flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> إعادة
          </button>
          <button onClick={handleAdd} className="flex-1 py-3 btn-primary inline-flex items-center justify-center gap-2">
            {added
              ? <><Check className="w-4 h-4" /> تمت الإضافة</>
              : <><ShoppingBag className="w-4 h-4" /> أضف للسلة — {productPrice} </>}
          </button>
        </div>
      </div>
    </div>
  );
}