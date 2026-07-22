import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { Type, Palette, RotateCcw, ShoppingBag, Check, ZoomIn, Image as ImageIcon, Upload, X, Loader2, PanelTop, PanelBottom, Shapes } from 'lucide-react';
import { FONTS, THREAD_COLORS } from './SashSimulatorWidget';
import { uploadFile } from '@/api/storage';

const JACKET_COLORS = [
  { name: 'أسود', value: '#16161a', light: '#3a3a40' },
  { name: 'كحلي', value: '#0F2044', light: '#2A4070' },
  { name: 'خمري', value: '#5C1A28', light: '#903040' },
  { name: 'أخضر زيتي', value: '#2A4020', light: '#4A6A38' },
  { name: 'رمادي فحمي', value: '#2b2b30', light: '#54545c' },
];

const SLEEVE_COLORS = [
  { name: 'جلد أسود', value: '#0d0d0d' },
  { name: 'جلد بني', value: '#3d2a1e' },
  { name: 'نفس لون الجاكيت', value: 'same' },
];

// باتشات جاهزة (تصميم أصلي مرسوم بالكود، بدون أي ملفات صور خارجية) —
// العميل يقدر يختار وحدة منها بدل ما يكتب نص أو يرفع شعاره
const PATCH_PRESETS = [
  { id: 'laurel', name: 'غصن غار' },
  { id: 'star', name: 'نجمة' },
  { id: 'shield', name: 'شعار درعي' },
  { id: 'number', name: 'إطار رقم/سنة' },
  { id: 'ribbon', name: 'وسام' },
];

// رسم أيقونة الباتش الجاهز مباشرة بالكانفاس (متجهي، بدون صور خارجية)
function drawPresetIcon(ctx, cx, cy, r, iconId, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.4, r * 0.045);

  if (iconId === 'star') {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const ang = (Math.PI / 5) * i - Math.PI / 2;
      const rad = i % 2 === 0 ? r * 0.62 : r * 0.26;
      const x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.globalAlpha = 0.9;
    ctx.fill();
  } else if (iconId === 'shield') {
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.5, cy - r * 0.55);
    ctx.lineTo(cx + r * 0.5, cy - r * 0.55);
    ctx.lineTo(cx + r * 0.5, cy + r * 0.05);
    ctx.quadraticCurveTo(cx + r * 0.5, cy + r * 0.55, cx, cy + r * 0.65);
    ctx.quadraticCurveTo(cx - r * 0.5, cy + r * 0.55, cx - r * 0.5, cy + r * 0.05);
    ctx.closePath();
    ctx.globalAlpha = 0.9;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.32);
    ctx.lineTo(cx, cy + r * 0.32);
    ctx.moveTo(cx - r * 0.22, cy - r * 0.05);
    ctx.lineTo(cx + r * 0.22, cy - r * 0.05);
    ctx.stroke();
  } else if (iconId === 'number') {
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  } else if (iconId === 'ribbon') {
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.08, r * 0.42, 0, Math.PI * 2);
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.28, cy + r * 0.2);
    ctx.lineTo(cx - r * 0.05, cy + r * 0.65);
    ctx.lineTo(cx, cy + r * 0.42);
    ctx.lineTo(cx + r * 0.05, cy + r * 0.65);
    ctx.lineTo(cx + r * 0.28, cy + r * 0.2);
    ctx.closePath();
    ctx.fill();
  } else {
    // laurel — غصنا غار متقابلان (تصميم شعارات التخرج الكلاسيكي)
    [-1, 1].forEach((side) => {
      ctx.save();
      ctx.translate(cx + side * r * 0.05, cy);
      for (let i = 0; i < 6; i++) {
        const t = i / 5;
        const leafY = -r * 0.55 + t * r * 1.05;
        const leafX = side * (r * 0.18 + t * r * 0.22);
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, r * 0.12, r * 0.22, side * -0.5, 0, Math.PI * 2);
        ctx.globalAlpha = 0.85;
        ctx.fill();
      }
      ctx.restore();
    });
  }
  ctx.restore();
}

// معاينة مصغّرة (Canvas صغير) لكل أيقونة باتش داخل شبكة الاختيار
function PatchIconPreview({ iconId, color }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPresetIcon(ctx, canvas.width / 2, canvas.height / 2, canvas.width * 0.4, iconId, color);
  }, [iconId, color]);
  return <canvas ref={ref} width={40} height={40} />;
}

// رسم جاكيت السينيور — واجهة أمامية (باتش صدر) وخلفية (تصميم كبير للظهر)
function JacketCanvas({ view, jacketColor, jacketLight, sleeveColor, mode, chestText, backText, fontStyle, threadColor, threadGlow, logoImg, presetId }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f8f4f0';
    ctx.fillRect(0, 0, W, H);

    const bodyW = W * 0.5;
    const bodyX = (W - bodyW) / 2;
    const bodyY = H * 0.1;
    const bodyH = H * 0.72;
    const sleeveW = W * 0.16;
    const sleeveActualColor = sleeveColor === 'same' ? jacketColor : sleeveColor;

    // الأكمام
    ctx.save();
    const gradSleeve = ctx.createLinearGradient(0, bodyY, 0, bodyY + bodyH);
    gradSleeve.addColorStop(0, sleeveActualColor);
    gradSleeve.addColorStop(1, '#000000');
    ctx.fillStyle = gradSleeve;
    // كم أيسر
    ctx.beginPath();
    ctx.roundRect(bodyX - sleeveW - 6, bodyY + 6, sleeveW, bodyH * 0.92, 14);
    ctx.fill();
    // كم أيمن
    ctx.beginPath();
    ctx.roundRect(bodyX + bodyW + 6, bodyY + 6, sleeveW, bodyH * 0.92, 14);
    ctx.fill();
    ctx.restore();

    // جسم الجاكيت
    ctx.save();
    const gradBody = ctx.createLinearGradient(bodyX, bodyY, bodyX, bodyY + bodyH);
    gradBody.addColorStop(0, jacketLight);
    gradBody.addColorStop(0.4, jacketColor);
    gradBody.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradBody;
    ctx.beginPath();
    ctx.roundRect(bodyX, bodyY, bodyW, bodyH, 18);
    ctx.fill();
    ctx.restore();

    // ياقة
    ctx.save();
    ctx.fillStyle = sleeveActualColor;
    ctx.beginPath();
    ctx.roundRect(bodyX + bodyW * 0.28, bodyY - 6, bodyW * 0.44, 26, 10);
    ctx.fill();
    ctx.restore();

    if (view === 'front') {
      // سحاب أمامي
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, bodyY + 20);
      ctx.lineTo(W / 2, bodyY + bodyH - 15);
      ctx.stroke();
      ctx.restore();

      // باتش الصدر (دائري صغير يمين الصدر)
      const px = bodyX + bodyW * 0.72;
      const py = bodyY + bodyH * 0.22;
      const pr = bodyW * 0.16;
      drawPatch(ctx, px, py, pr, mode, chestText, fontStyle, threadColor, threadGlow, logoImg, 1, presetId);
    } else {
      // تصميم كبير على الظهر
      const px = bodyX + bodyW / 2;
      const py = bodyY + bodyH * 0.38;
      const pr = bodyW * 0.36;
      drawPatch(ctx, px, py, pr, mode, backText, fontStyle, threadColor, threadGlow, logoImg, 2, presetId);
    }
  }, [view, jacketColor, jacketLight, sleeveColor, mode, chestText, backText, fontStyle, threadColor, threadGlow, logoImg, presetId]);

  function drawPatch(ctx, cx, cy, r, mode, text, fontStyle, threadColor, threadGlow, logoImg, sizeMul, presetId) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();
    ctx.strokeStyle = threadColor;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    if (mode === 'logo' && logoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
      ctx.clip();
      const s = Math.max((r * 2) / logoImg.width, (r * 2) / logoImg.height);
      const w = logoImg.width * s, h = logoImg.height * s;
      ctx.drawImage(logoImg, cx - w / 2, cy - h / 2, w, h);
      ctx.restore();
    } else if (mode === 'preset' && presetId) {
      drawPresetIcon(ctx, cx, cy, r * 0.85, presetId, threadColor);
    } else if (mode === 'text' && text && text.trim()) {
      ctx.save();
      ctx.font = `bold ${Math.min(22 * sizeMul, r * 0.42)}px ${fontStyle}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = threadColor;
      ctx.globalAlpha = 0.95;
      const words = text.trim().split(/\s+/);
      const lines = words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [text];
      lines.forEach((line, i) => {
        const ly = cy + (i - (lines.length - 1) / 2) * (r * 0.42);
        ctx.fillText(line, cx, ly);
      });
      ctx.shadowBlur = 6;
      ctx.shadowColor = threadGlow;
      ctx.globalAlpha = 0.4;
      lines.forEach((line, i) => {
        const ly = cy + (i - (lines.length - 1) / 2) * (r * 0.42);
        ctx.fillText(line, cx, ly);
      });
      ctx.restore();
    } else {
      ctx.save();
      ctx.font = `11px Tajawal, sans-serif`;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('التطريز هنا', cx, cy);
      ctx.restore();
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={400}
      className="w-full h-auto rounded-xl"
      style={{ background: '#f8f4f0' }}
    />
  );
}

export default function JacketSimulatorWidget({ productName = 'جاكيت سينيور تخرج', productPrice = 195 }) {
  const [view, setView] = useState('front');
  const [mode, setMode] = useState('text');
  const [presetPatch, setPresetPatch] = useState(PATCH_PRESETS[0]);
  const [chestText, setChestText] = useState('');
  const [backText, setBackText] = useState('');
  const [font, setFont] = useState(FONTS[0]);
  const [jacketColor, setJacketColor] = useState(JACKET_COLORS[0]);
  const [sleeveColor, setSleeveColor] = useState(SLEEVE_COLORS[0]);
  const [thread, setThread] = useState(THREAD_COLORS[0]);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoImg, setLogoImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const fileRef = useRef(null);

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
      setMode('logo');
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
    setMode('text');
  };

  const reset = () => {
    setChestText('');
    setBackText('');
    setFont(FONTS[0]);
    setJacketColor(JACKET_COLORS[0]);
    setSleeveColor(SLEEVE_COLORS[0]);
    setThread(THREAD_COLORS[0]);
    setPresetPatch(PATCH_PRESETS[0]);
    setMode('text');
    clearLogo();
  };

  const handleAdd = () => {
    const config = {
      mode,
      chest_text: mode === 'text' ? (chestText || '') : '',
      back_text: mode === 'text' ? (backText || '') : '',
      patch_design: mode === 'preset' ? presetPatch.name : '',
      logo_url: mode === 'logo' ? logoUrl : '',
      font: font.name,
      jacketColor: jacketColor.name,
      sleeveColor: sleeveColor.name,
      thread: thread.name,
    };
    const label = mode === 'logo' ? 'شعار مرفوع' : mode === 'preset' ? `باتش ${presetPatch.name}` : (backText || chestText || 'بدون اسم');
    addItem({
      id: `jacket-${Date.now()}`,
      name: `${productName} — ${label}`,
      price: productPrice,
      image_url: logoUrl || '',
      sash_config: JSON.stringify(config),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* المعاينة */}
      <div className="lg:col-span-3">
        <div className="flex gap-2 mb-3 justify-center">
          <button onClick={() => setView('front')} className={`px-4 py-2 rounded-full border text-sm inline-flex items-center gap-1.5 transition-all ${view === 'front' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}>
            <PanelTop className="w-4 h-4" /> الأمام
          </button>
          <button onClick={() => setView('back')} className={`px-4 py-2 rounded-full border text-sm inline-flex items-center gap-1.5 transition-all ${view === 'back' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}>
            <PanelBottom className="w-4 h-4" /> الخلف
          </button>
        </div>
        <div className="card-soft overflow-hidden bg-gradient-to-b from-secondary/20 to-card p-2 sm:p-4">
          <JacketCanvas
            view={view}
            jacketColor={jacketColor.value}
            jacketLight={jacketColor.light}
            sleeveColor={sleeveColor.value}
            mode={mode}
            chestText={chestText}
            backText={backText}
            fontStyle={font.style}
            threadColor={thread.value}
            threadGlow={thread.glow}
            logoImg={logoImg}
            presetId={presetPatch.id}
          />
        </div>
        <p className="text-center text-xs text-foreground/50 mt-2 flex items-center justify-center gap-1">
          <ZoomIn className="w-3 h-3" />
          معاينة حية لجاكيت السينيور — تطريز يدوي على الصدر والظهر
        </p>
      </div>

      {/* خيارات التخصيص */}
      <div className="lg:col-span-2 space-y-3">
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2">طريقة التطريز</label>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setMode('text')} className={`py-2.5 rounded-xl border text-xs sm:text-sm inline-flex flex-col items-center justify-center gap-1 transition-all ${mode === 'text' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}>
              <Type className="w-4 h-4" /> نص / اسم
            </button>
            <button onClick={() => setMode('preset')} className={`py-2.5 rounded-xl border text-xs sm:text-sm inline-flex flex-col items-center justify-center gap-1 transition-all ${mode === 'preset' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}>
              <Shapes className="w-4 h-4" /> باتش جاهز
            </button>
            <button onClick={() => setMode('logo')} className={`py-2.5 rounded-xl border text-xs sm:text-sm inline-flex flex-col items-center justify-center gap-1 transition-all ${mode === 'logo' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}>
              <ImageIcon className="w-4 h-4" /> شعارك الخاص
            </button>
          </div>
        </div>

        {mode === 'preset' && (
          <div className="card-soft p-4">
            <label className="flex items-center gap-2 text-sm font-bold mb-2"><Shapes className="w-4 h-4 text-primary" /> اختر تصميم الباتش (يُطرّز على الصدر والظهر)</label>
            <div className="grid grid-cols-3 gap-2">
              {PATCH_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPresetPatch(p)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all ${presetPatch.id === p.id ? 'border-primary bg-primary/10' : 'border-border bg-secondary/30 hover:border-primary/40'}`}
                >
                  <PatchIconPreview iconId={p.id} color={thread.value} />
                  <span className="text-[11px] text-foreground/70">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'text' && (
          <>
            <div className="card-soft p-4">
              <label className="flex items-center gap-2 text-sm font-bold mb-2"><Type className="w-4 h-4 text-primary" /> تطريز الصدر (باتش صغير)</label>
              <input value={chestText} onChange={e => setChestText(e.target.value)} maxLength={14} placeholder="الحروف الأولى أو اسم مختصر" className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/40 focus:bg-card focus:border-primary focus:outline-none text-center" style={{ fontFamily: font.style }} />
            </div>
            <div className="card-soft p-4">
              <label className="flex items-center gap-2 text-sm font-bold mb-2"><Type className="w-4 h-4 text-primary" /> تطريز الظهر (تصميم كبير)</label>
              <input value={backText} onChange={e => setBackText(e.target.value)} maxLength={18} placeholder="اسمك أو سنة التخرج" className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/40 focus:bg-card focus:border-primary focus:outline-none text-center" style={{ fontFamily: font.style }} />
            </div>
            <div className="card-soft p-4">
              <label className="flex items-center gap-2 text-sm font-bold mb-2"><Type className="w-4 h-4 text-primary" /> نوع الخط</label>
              <div className="grid grid-cols-4 gap-1.5">
                {FONTS.map(f => (
                  <button key={f.id} onClick={() => setFont(f)} className={`py-2 rounded-lg border text-sm transition-all ${font.id === f.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`} style={{ fontFamily: f.style }}>{f.name}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {mode === 'logo' && (
          <div className="card-soft p-4">
            <label className="flex items-center gap-2 text-sm font-bold mb-2"><ImageIcon className="w-4 h-4 text-primary" /> ارفع شعارك (يُستخدم للصدر والظهر)</label>
            {!logoUrl ? (
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full py-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-sm text-foreground/60 transition-colors">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'جاري الرفع...' : 'اضغط لرفع صورة (PNG/JPG)'}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="الشعار" className="w-16 h-16 rounded-lg object-cover border border-border" />
                <button onClick={clearLogo} className="text-sm text-destructive inline-flex items-center gap-1 hover:opacity-70"><X className="w-4 h-4" /> إزالة الصورة</button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoPick} className="hidden" />
          </div>
        )}

        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون الجاكيت</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {JACKET_COLORS.map(c => (
              <button key={c.value} onClick={() => setJacketColor(c)} title={c.name} className={`w-8 h-8 rounded-full border-2 transition-all ${jacketColor.value === c.value ? 'border-primary scale-125' : 'border-border'}`} style={{ background: `linear-gradient(135deg, ${c.light}, ${c.value})` }} />
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون الأكمام</label>
          <div className="flex flex-wrap gap-2">
            {SLEEVE_COLORS.map(c => (
              <button key={c.name} onClick={() => setSleeveColor(c)} className={`px-3 py-1.5 rounded-full border text-xs transition-all ${sleeveColor.name === c.name ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}>{c.name}</button>
            ))}
          </div>
        </div>

        {(mode === 'text' || mode === 'preset') && (
          <div className="card-soft p-4">
            <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون التطريز</label>
            <div className="flex flex-wrap gap-2">
              {THREAD_COLORS.map(c => (
                <button key={c.value} onClick={() => setThread(c)} title={c.name} className={`w-8 h-8 rounded-full border-2 transition-all ${thread.value === c.value ? 'border-primary scale-125' : 'border-border'}`} style={{ background: c.value }} />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2.5">
          <button onClick={reset} className="px-4 py-3 rounded-full border border-border bg-card font-medium text-sm hover:bg-secondary inline-flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> إعادة
          </button>
          <button onClick={handleAdd} className="flex-1 py-3 btn-primary inline-flex items-center justify-center gap-2">
            {added ? <><Check className="w-4 h-4" /> تمت الإضافة</> : <><ShoppingBag className="w-4 h-4" /> أضف للسلة — {productPrice} ر.س</>}
          </button>
        </div>
      </div>
    </div>
  );
}
