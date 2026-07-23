import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { ShoppingBag, Check, RotateCcw } from 'lucide-react';

export const JACKET_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

export const JACKET_THREAD_COLORS = [
  { name: 'أبيض', value: '#F5F5F5' },
  { name: 'ذهبي', value: '#D4AF37' },
  { name: 'فضي', value: '#C0C0C0' },
  { name: 'أحمر', value: '#B8232F' },
  { name: 'أزرق', value: '#1F4FA0' },
];

export const JACKET_FONTS = [
  { id: 'varsity', name: 'فارسيتي', style: "'Georgia', serif", weight: 800, italic: false },
  { id: 'script', name: 'مائل كلاسيكي', style: "'Brush Script MT', cursive", weight: 500, italic: true },
  { id: 'block', name: 'بلوك', style: "'Arial Black', sans-serif", weight: 900, italic: false },
];

// أيقونات باتشات أصلية (رسم بسيط SVG) — بدائل عامة غير محفوظة الحقوق
function PatchIcon({ type, color = '#D4AF37' }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: color };
  switch (type) {
    case 'star':
      return <svg {...common}><path d="M12 1.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.27 5.82 20.5 7 13.63l-5-4.87 6.91-1L12 1.5z" /></svg>;
    case 'heart':
      return <svg {...common}><path d="M12 21s-7.5-4.9-10-9.1C0.3 8.6 1.8 5 5.3 4.2 7.6 3.7 9.9 4.7 12 7c2.1-2.3 4.4-3.3 6.7-2.8 3.5.8 5 4.4 3.3 7.7C19.5 16.1 12 21 12 21z" /></svg>;
    case 'moon':
      return <svg {...common}><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5z" /></svg>;
    case 'crown':
      return <svg {...common}><path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8zm2 12h14v2H5v-2z" /></svg>;
    case 'flower':
      return <svg {...common}><circle cx="12" cy="12" r="2.5" /><circle cx="12" cy="5" r="3" opacity="0.85" /><circle cx="12" cy="19" r="3" opacity="0.85" /><circle cx="5" cy="12" r="3" opacity="0.85" /><circle cx="19" cy="12" r="3" opacity="0.85" /></svg>;
    default:
      return null;
  }
}

const PATCH_OPTIONS = ['none', 'star', 'heart', 'moon', 'crown', 'flower'];
const PATCH_POSITIONS = [
  { key: 'topLeft', label: 'باتش يسار علوي', cls: 'top-[16%] left-[14%]' },
  { key: 'bottomLeft', label: 'باتش يسار سفلي', cls: 'top-[34%] left-[14%]' },
  { key: 'topRight', label: 'باتش يمين علوي', cls: 'top-[16%] right-[14%]' },
  { key: 'bottomRight', label: 'باتش يمين سفلي', cls: 'top-[34%] right-[14%]' },
];

export default function JacketSimulatorWidget({
  productName = 'جاكيت تخرج سينيور',
  productPrice = 195,
  images = {
    front: '/images/products/senior-jacket/front.jpg',
    side: '/images/products/senior-jacket/side.png',
    back: '/images/products/senior-jacket/back.png',
  },
}) {
  const [size, setSize] = useState('M');
  const [name, setName] = useState('');
  const [font, setFont] = useState(JACKET_FONTS[0]);
  const [thread, setThread] = useState(JACKET_THREAD_COLORS[0]);
  const [patches, setPatches] = useState({ topLeft: 'none', bottomLeft: 'none', topRight: 'none', bottomRight: 'none' });
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const initials = (name || '').toUpperCase().slice(0, 2);

  const setPatch = (key, value) => setPatches(p => ({ ...p, [key]: value }));

  const reset = () => {
    setSize('M');
    setName('');
    setFont(JACKET_FONTS[0]);
    setThread(JACKET_THREAD_COLORS[0]);
    setPatches({ topLeft: 'none', bottomLeft: 'none', topRight: 'none', bottomRight: 'none' });
  };

  const handleAdd = () => {
    const config = {
      type: 'jacket',
      size,
      name: initials || 'بدون اسم',
      font: font.name,
      thread: thread.name,
      patches,
    };
    addItem({
      id: `jacket-${Date.now()}`,
      name: `${productName} — مقاس ${size}${initials ? ` — ${initials}` : ''}`,
      price: productPrice,
      image_url: images.front,
      sash_config: JSON.stringify(config),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* المعاينة الحية */}
      <div className="space-y-3">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary card-soft">
          <img src={images.back} alt={productName} className="w-full h-full object-cover" />
          {initials && (
            <div
              className="absolute inset-x-0 top-[30%] text-center pointer-events-none select-none"
              style={{
                fontFamily: font.style,
                fontWeight: font.weight,
                fontStyle: font.italic ? 'italic' : 'normal',
                color: thread.value,
                fontSize: 'clamp(28px, 9vw, 56px)',
                textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.3)',
                letterSpacing: '2px',
              }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="relative rounded-xl overflow-hidden bg-secondary card-soft" style={{ aspectRatio: '4/5' }}>
          <img src={images.front} alt={`${productName} أمامي`} className="w-full h-full object-cover" />
          {PATCH_POSITIONS.map(pos => patches[pos.key] !== 'none' && (
            <div key={pos.key} className={`absolute ${pos.cls} bg-white/90 rounded-full p-1.5 shadow-md`}>
              <PatchIcon type={patches[pos.key]} color={thread.value === '#F5F5F5' ? '#D4AF37' : thread.value} />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <img src={images.side} alt={`${productName} جانبي`} className="w-1/3 aspect-square object-cover rounded-lg" />
        </div>
      </div>

      {/* عناصر التحكم */}
      <div className="space-y-5">
        <div>
          <p className="text-sm font-bold mb-2">المقاس</p>
          <div className="flex flex-wrap gap-2">
            {JACKET_SIZES.map(s => (
              <button key={s} onClick={() => setSize(s)}
                className={`w-11 h-10 rounded-lg text-sm font-bold border-2 transition-all ${size === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/40'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold mb-2">الاسم في الخلف (حرفين إنجليزي)</p>
          <input
            value={name}
            maxLength={2}
            onChange={e => setName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
            placeholder="AB"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <p className="text-sm font-bold mb-2">خط التطريز</p>
          <div className="flex flex-wrap gap-2">
            {JACKET_FONTS.map(f => (
              <button key={f.id} onClick={() => setFont(f)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold border-2 transition-all ${font.id === f.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40'}`}>
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold mb-2">لون الخيط</p>
          <div className="flex flex-wrap gap-2">
            {JACKET_THREAD_COLORS.map(t => (
              <button key={t.name} onClick={() => setThread(t)}
                className={`w-9 h-9 rounded-full border-2 transition-all ${thread.name === t.name ? 'border-primary scale-110' : 'border-border/50'}`}
                style={{ background: t.value }} title={t.name} />
            ))}
          </div>
        </div>

        {PATCH_POSITIONS.map(pos => (
          <div key={pos.key}>
            <p className="text-sm font-bold mb-2">{pos.label}</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setPatch(pos.key, 'none')}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold transition-all ${patches[pos.key] === 'none' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40'}`}>
                بدون
              </button>
              {PATCH_OPTIONS.filter(o => o !== 'none').map(opt => (
                <button key={opt} onClick={() => setPatch(pos.key, opt)}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${patches[pos.key] === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}>
                  <PatchIcon type={opt} color="#4A2060" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button onClick={reset} className="px-4 py-3 rounded-xl border border-border hover:bg-secondary transition-colors" title="إعادة تعيين">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={handleAdd} className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2">
            {added ? <><Check className="w-4 h-4" /> أُضيف للسلة</> : <><ShoppingBag className="w-4 h-4" /> أضف للسلة — {productPrice} ر.س</>}
          </button>
        </div>
      </div>
    </div>
  );
}
