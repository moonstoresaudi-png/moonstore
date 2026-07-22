import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { Type, Palette, RotateCcw, ShoppingBag, Check, ZoomIn, Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import { FONTS, THREAD_COLORS } from './SashSimulatorWidget';
import { uploadFile } from '@/api/storage';

const CAP_COLORS = [
  { name: 'أسود', value: '#16161a', light: '#3a3a40' },
  { name: 'كحلي', value: '#0F2044', light: '#2A4070' },
  { name: 'بنفسجي ملكي', value: '#4A2060', light: '#7B4FA0' },
  { name: 'خمري', value: '#5C1A28', light: '#903040' },
  { name: 'أخضر زيتي', value: '#2A4020', light: '#4A6A38' },
  { name: 'رمادي', value: '#3A3A4A', light: '#6A6A80' },
];

const TASSEL_COLORS = [
  { name: 'ذهبي', value: '#D4AF37' },
  { name: 'فضي', value: '#C0C0C0' },
  { name: 'أبيض', value: '#F5F5F5' },
  { name: 'أسود', value: '#2A2A2A' },
];

export { CAP_COLORS, TASSEL_COLORS, CapCanvas };

// رسم كاب التخرج (منظر علوي) + مساحة تطريز على اللوح الأمامي
function CapCanvas({ capColor, capLight, tasselColor, mode, text, fontStyle, threadColor, threadGlow, logoImg }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#f8f4f0';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H * 0.42;
    const half = W * 0.36;

    // اللوح المربع (منظر علوي منحرف قليلاً كأنه معروض)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.scale(1, 0.62); // منظور علوي

    const grad = ctx.createLinearGradient(-half, -half, half, half);
    grad.addColorStop(0, capLight);
    grad.addColorStop(0.5, capColor);
    grad.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(-half, -half, half * 2, half * 2);

    // حدود خفيفة
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-half, -half, half * 2, half * 2);
    ctx.restore();

    // الزر المركزي
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = tasselColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // الشرابة (تاسل) متدلية من الزاوية الأمامية اليمنى
    const tx = cx + half * 0.98;
    const ty = cy + half * 0.15;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo((cx + tx) / 2, cy - 15, tx, ty);
    ctx.strokeStyle = tasselColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // شراشيب الشرابة
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx + i * 2.2, ty + 46 + Math.abs(i) * 2);
      ctx.strokeStyle = tasselColor;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(tx, ty, 5, 0, Math.PI * 2);
    ctx.fillStyle = tasselColor;
    ctx.fill();
    ctx.restore();

    // ===== مساحة التطريز (باتش دائري على الوجه الأمامي من الكاب) =====
    const patchY = cy + H * 0.32;
    const patchR = W * 0.14;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, patchY, patchR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
    ctx.strokeStyle = threadColor;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    if (mode === 'logo' && logoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, patchY, patchR - 3, 0, Math.PI * 2);
      ctx.clip();
      const s = Math.max((patchR * 2) / logoImg.width, (patchR * 2) / logoImg.height);
      const w = logoImg.width * s, h = logoImg.height * s;
      ctx.drawImage(logoImg, cx - w / 2, patchY - h / 2, w, h);
      ctx.restore();
    } else if (mode === 'text' && text && text.trim()) {
      ctx.save();
      ctx.font = `bold ${Math.min(22, patchR * 0.5)}px ${fontStyle}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = threadColor;
      ctx.globalAlpha = 0.95;
      // التفاف النص إن كان طويلاً
      const words = text.trim().split(/\s+/);
      const lines = words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [text];
      lines.forEach((line, i) => {
        const ly = patchY + (i - (lines.length - 1) / 2) * (patchR * 0.5);
        ctx.fillText(line, cx, ly);
      });
      ctx.shadowBlur = 6;
      ctx.shadowColor = threadGlow;
      ctx.globalAlpha = 0.4;
      lines.forEach((line, i) => {
        const ly = patchY + (i - (lines.length - 1) / 2) * (patchR * 0.5);
        ctx.fillText(line, cx, ly);
      });
      ctx.restore();
    } else {
      ctx.save();
      ctx.font = `12px Tajawal, sans-serif`;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('التطريز هنا', cx, patchY);
      ctx.restore();
    }
  }, [capColor, capLight, tasselColor, mode, text, fontStyle, threadColor, threadGlow, logoImg]);

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={360}
      className="w-full h-auto rounded-xl"
      style={{ background: '#f8f4f0' }}
    />
  );
}

export default function CapSimulatorWidget({ productName = 'كاب تخرج مخصص', productPrice = 90, compact = false }) {
  const [mode, setMode] = useState('text'); // 'text' | 'logo'
  const [text, setText] = useState('');
  const [font, setFont] = useState(FONTS[0]);
  const [capColor, setCapColor] = useState(CAP_COLORS[0]);
  const [tassel, setTassel] = useState(TASSEL_COLORS[0]);
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
    setText('');
    setFont(FONTS[0]);
    setCapColor(CAP_COLORS[0]);
    setTassel(TASSEL_COLORS[0]);
    setThread(THREAD_COLORS[0]);
    clearLogo();
  };

  const handleAdd = () => {
    const config = {
      mode,
      text: mode === 'text' ? (text || 'بدون اسم') : '',
      logo_url: mode === 'logo' ? logoUrl : '',
      font: font.name,
      capColor: capColor.name,
      tassel: tassel.name,
      thread: thread.name,
    };
    addItem({
      id: `cap-${Date.now()}`,
      name: `${productName} — ${mode === 'logo' ? 'شعار مرفوع' : config.text}`,
      price: productPrice,
      image_url: logoUrl || '',
      sash_config: JSON.stringify(config),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className={`grid ${compact ? 'md:grid-cols-2' : 'lg:grid-cols-5'} gap-6`}>
      {/* معاينة الكاب */}
      <div className={compact ? '' : 'lg:col-span-3'}>
        <div className="card-soft overflow-hidden bg-gradient-to-b from-secondary/20 to-card p-2 sm:p-4">
          <CapCanvas
            capColor={capColor.value}
            capLight={capColor.light}
            tasselColor={tassel.value}
            mode={mode}
            text={text}
            fontStyle={font.style}
            threadColor={thread.value}
            threadGlow={thread.glow}
            logoImg={logoImg}
          />
        </div>
        <p className="text-center text-xs text-foreground/50 mt-2 flex items-center justify-center gap-1">
          <ZoomIn className="w-3 h-3" />
          معاينة حية للكاب — المنتج الفعلي بتطريز يدوي
        </p>
      </div>

      {/* خيارات التخصيص */}
      <div className={`${compact ? '' : 'lg:col-span-2'} space-y-3`}>
        {/* اختيار طريقة التخصيص */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2">طريقة التطريز</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('text')}
              className={`flex-1 py-2.5 rounded-xl border text-sm inline-flex items-center justify-center gap-1.5 transition-all ${mode === 'text' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}
            >
              <Type className="w-4 h-4" /> نص / اسم
            </button>
            <button
              onClick={() => setMode('logo')}
              className={`flex-1 py-2.5 rounded-xl border text-sm inline-flex items-center justify-center gap-1.5 transition-all ${mode === 'logo' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/40 hover:border-primary/40'}`}
            >
              <ImageIcon className="w-4 h-4" /> شعار / صورة
            </button>
          </div>
        </div>

        {mode === 'text' && (
          <>
            <div className="card-soft p-4">
              <label className="flex items-center gap-2 text-sm font-bold mb-2"><Type className="w-4 h-4 text-primary" /> النص على الكاب</label>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={16}
                placeholder="اسمك أو تاريخ التخرج"
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/40 focus:bg-card focus:border-primary focus:outline-none text-lg text-center"
                style={{ fontFamily: font.style }}
              />
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
          </>
        )}

        {mode === 'logo' && (
          <div className="card-soft p-4">
            <label className="flex items-center gap-2 text-sm font-bold mb-2"><ImageIcon className="w-4 h-4 text-primary" /> ارفع شعار الجامعة / صورتك</label>
            {!logoUrl ? (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full py-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-sm text-foreground/60 transition-colors"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'جاري الرفع...' : 'اضغط لرفع صورة (PNG/JPG)'}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="الشعار" className="w-16 h-16 rounded-lg object-cover border border-border" />
                <button onClick={clearLogo} className="text-sm text-destructive inline-flex items-center gap-1 hover:opacity-70">
                  <X className="w-4 h-4" /> إزالة الصورة
                </button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoPick} className="hidden" />
          </div>
        )}

        {/* لون الكاب */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون الكاب</label>
          <div className="flex flex-wrap gap-2">
            {CAP_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => setCapColor(c)}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 transition-all ${capColor.value === c.value ? 'border-primary scale-125' : 'border-border'}`}
                style={{ background: `linear-gradient(135deg, ${c.light}, ${c.value})` }}
              />
            ))}
          </div>
          <p className="text-xs text-foreground/50 mt-1.5">{capColor.name}</p>
        </div>

        {/* لون الشرابة */}
        <div className="card-soft p-4">
          <label className="flex items-center gap-2 text-sm font-bold mb-2"><Palette className="w-4 h-4 text-primary" /> لون الشرابة</label>
          <div className="flex flex-wrap gap-2">
            {TASSEL_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => setTassel(c)}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 transition-all ${tassel.value === c.value ? 'border-primary scale-125' : 'border-border'}`}
                style={{ background: c.value }}
              />
            ))}
          </div>
          <p className="text-xs text-foreground/50 mt-1.5">{tassel.name}</p>
        </div>

        {/* لون التطريز (للنص) */}
        {mode === 'text' && (
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
        )}

        {/* الأزرار */}
        <div className="flex gap-2.5">
          <button onClick={reset} className="px-4 py-3 rounded-full border border-border bg-card font-medium text-sm hover:bg-secondary inline-flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> إعادة
          </button>
          <button onClick={handleAdd} className="flex-1 py-3 btn-primary inline-flex items-center justify-center gap-2">
            {added
              ? <><Check className="w-4 h-4" /> تمت الإضافة</>
              : <><ShoppingBag className="w-4 h-4" /> أضف للسلة — {productPrice} ر.س</>}
          </button>
        </div>
      </div>
    </div>
  );
}
