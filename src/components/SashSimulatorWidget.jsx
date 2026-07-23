import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { Type, Palette, RotateCcw, ShoppingBag, Check, Ruler, ZoomIn } from 'lucide-react';

const FONTS = [
  { id: 'thuluth-light', name: 'ثلث لايت', cls: 'font-thuluth', style: '"Amiri", serif' },
  { id: 'thuluth', name: 'الثلث', cls: 'font-thuluth', style: '"Amiri", serif' },
  { id: 'diwani', name: 'ديواني', cls: 'font-diwani', style: '"Aref Ruqaa", serif' },
  { id: 'monotype', name: 'Monotype (إنجليزي)', cls: 'font-body', style: '"Monotype Corsiva", cursive' },
  { id: 'calisto', name: 'Calisto (إنجليزي)', cls: 'font-body', style: '"Calisto MT", serif' },
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

// معاينة الوشاح الحقيقية بـ Canvas
function SashCanvas({ text, fontStyle, sashColor, sashLight, threadColor, threadGlow, fontSize }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // خلفية المشهد (كتف)
    ctx.fillStyle = '#f8f4f0';
    ctx.fillRect(0, 0, W, H);

    // شبح الجسم / الروب
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#4A2060';
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.18, W * 0.32, H * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(W * 0.22, H * 0.28, W * 0.56, H * 0.65, 20);
    ctx.fill();
    ctx.restore();

    // ===== رسم الوشاح =====
    // الوشاح شريط مائل من أعلى الكتف الأيمن إلى أسفل الخصر الأيسر
    const x1 = W * 0.72, y1 = H * 0.12;   // نقطة البداية (الكتف الأيمن)
    const x2 = W * 0.28, y2 = H * 0.88;   // نقطة النهاية (الخصر الأيسر)
    const W_SASH = 54; // عرض الوشاح بالبكسل

    // حساب المتجه العمودي على اتجاه الوشاح
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len, ny = dx / len; // المتجه العمودي

    // تدرج قماش الوشاح
    const gradFabric = ctx.createLinearGradient(
      x1 + nx * W_SASH * 0.5, y1 + ny * W_SASH * 0.5,
      x1 - nx * W_SASH * 0.5, y1 - ny * W_SASH * 0.5
    );
    gradFabric.addColorStop(0, sashLight);
    gradFabric.addColorStop(0.3, sashColor);
    gradFabric.addColorStop(0.7, sashColor);
    gradFabric.addColorStop(1, '#111');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1 + nx * W_SASH * 0.5, y1 + ny * W_SASH * 0.5);
    ctx.lineTo(x2 + nx * W_SASH * 0.5, y2 + ny * W_SASH * 0.5);
    ctx.lineTo(x2 - nx * W_SASH * 0.5, y2 - ny * W_SASH * 0.5);
    ctx.lineTo(x1 - nx * W_SASH * 0.5, y1 - ny * W_SASH * 0.5);
    ctx.closePath();
    ctx.fillStyle = gradFabric;
    ctx.fill();
    // حدود الوشاح
    ctx.strokeStyle = threadColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.restore();

    // بريق / لمعة على الوشاح
    ctx.save();
    ctx.globalAlpha = 0.12;
    const gradSheen = ctx.createLinearGradient(x1 + nx * W_SASH * 0.2, y1, x1 - nx * W_SASH * 0.1, y1);
    gradSheen.addColorStop(0, '#ffffff');
    gradSheen.addColorStop(1, 'transparent');
    ctx.fillStyle = gradSheen;
    ctx.beginPath();
    ctx.moveTo(x1 + nx * W_SASH * 0.2, y1 + ny * W_SASH * 0.2);
    ctx.lineTo(x2 + nx * W_SASH * 0.2, y2 + ny * W_SASH * 0.2);
    ctx.lineTo(x2 + nx * W_SASH * 0.0, y2 + ny * W_SASH * 0.0);
    ctx.lineTo(x1 + nx * W_SASH * 0.0, y1 + ny * W_SASH * 0.0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // خطوط التطريز على الحواف
    ['0.48', '-0.48'].forEach(frac => {
      const f = parseFloat(frac);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1 + nx * W_SASH * f, y1 + ny * W_SASH * f);
      ctx.lineTo(x2 + nx * W_SASH * f, y2 + ny * W_SASH * f);
      ctx.strokeStyle = threadColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.75;
      ctx.stroke();
      ctx.restore();
    });

    // الهدابة / الشراشيب في الأسفل
    ctx.save();
    ctx.globalAlpha = 0.85;
    const fringeCount = 12;
    for (let i = 0; i < fringeCount; i++) {
      const t = (i - fringeCount / 2) / fringeCount;
      const fx = x2 + nx * W_SASH * t * 0.9;
      const fy = y2 + ny * W_SASH * t * 0.9;
      const flen = 28 + Math.sin(i * 1.7) * 6;
      const ex = fx + (dx / len) * flen;
      const ey = fy + (dy / len) * flen;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = threadColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();

    // ===== النص المطرّز =====
    if (text && text.trim()) {
      ctx.save();
      // حساب منتصف الوشاح وزاوية الميل
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const angle = Math.atan2(dy, dx);

      ctx.translate(midX, midY);
      ctx.rotate(angle);

      const fs = Math.min(fontSize, 32);
      ctx.font = `bold ${fs}px ${fontStyle}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // ظل النص (تأثير التطريز)
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = threadColor;
      ctx.globalAlpha = 0.95;
      ctx.fillText(text, 0, 0);

      // بريق النص
      ctx.shadowBlur = 6;
      ctx.shadowColor = threadGlow;
      ctx.globalAlpha = 0.4;
      ctx.fillText(text, 0, 0);

      ctx.restore();
    }

  }, [text, fontStyle, sashColor, sashLight, threadColor, threadGlow, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={420}
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
  const [fontSize, setFontSize] = useState(28);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const reset = () => {
    setText('');
    setFont(FONTS[0]);
    setSashColor(SASH_COLORS[0]);
    setThread(THREAD_COLORS[0]);
    setEdge(SASH_EDGE_COLORS[0]);
    setDate(SASH_DATES[0]);
    setFontSize(28);
  };

  const handleAdd = () => {
    const config = { text: text || 'بدون اسم', date, font: font.name, sashColor: sashColor.name, thread: thread.name, edge: edge.name };
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
            fontStyle={font.style}
            sashColor={sashColor.value}
            sashLight={sashColor.light}
            threadColor={thread.value}
            threadGlow={thread.glow}
            fontSize={fontSize}
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
          <select value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:outline-none focus:border-primary">
            {SASH_DATES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
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
              : <><ShoppingBag className="w-4 h-4" /> أضف للسلة — {productPrice} ر.س</>}
          </button>
        </div>
      </div>
    </div>
  );
}