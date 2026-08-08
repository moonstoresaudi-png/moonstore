import React from 'react';
import { Info } from 'lucide-react';
import {
  ROBE_SHAPES, SLEEVE_STYLES, SASH_SHAPES, SASH_TRIM, EMBROIDERY_DIRECTIONS,
  CAP_EMBROIDERY_DESIGNS, UNIVERSITIES, UNIVERSITY_WRITING_COLORS, UNIVERSITY_SASH_TRIM,
  UNIVERSITY_SASH_LAYOUTS, UNIVERSITY_SASH_SHAPES,
} from '@/lib/robeOptions';

function Block({ title, hint, children }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-bold mb-1">{title}</label>
      {hint && <p className="text-xs text-foreground/45 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function ChipGroup({ options, value, onChange, addonLabel }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`px-3.5 py-2 rounded-xl border text-sm transition-all text-right ${value === o.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}
        >
          <span>{o.label}</span>
          {o.hint && <span className={`block text-[10px] mt-0.5 ${value === o.id ? 'text-primary-foreground/75' : 'text-foreground/40'}`}>{o.hint}</span>}
          {o.addonKey && addonLabel && <span className={`block text-[10px] mt-0.5 font-bold ${value === o.id ? 'text-primary-foreground' : 'text-primary'}`}>{addonLabel(o.addonKey)}</span>}
        </button>
      ))}
    </div>
  );
}

// خيارات مفصّلة لتصميم الروب/عباية التخرج والوشاح والكاب — تحوّل ورقة
// الخيارات اللي تستخدمها متجر مون مع عملائها لتجربة طلب تفاعلية بالموقع.
export default function RobeBuilder({ product, config, update }) {
  const addonLabel = (key) => `+${product[key] ?? 0} ريال`;

  return (
    <div>
      {product.has_university && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 mb-6">
          <p className="text-sm font-bold text-primary mb-3">🎓 روب الجامعة</p>

          <Block title="اسم الجامعة" hint="حسب موديل روب جامعتك">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {UNIVERSITIES.map(u => (
                <button key={u.id} type="button" onClick={() => update('university', u.id)} className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${config.university === u.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>{u.label}</button>
              ))}
            </div>
          </Block>

          <Block title="ترتيب عناصر الوشاح">
            <select value={config.universitySashLayout} onChange={e => update('universitySashLayout', +e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm focus:border-primary focus:outline-none">
              {UNIVERSITY_SASH_LAYOUTS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </Block>

          <div className="grid grid-cols-2 gap-4">
            <Block title="شكل الوشاح">
              <ChipGroup options={UNIVERSITY_SASH_SHAPES} value={config.universitySashShape} onChange={v => update('universitySashShape', v)} />
            </Block>
            <Block title="لون الكتابة">
              <ChipGroup options={UNIVERSITY_WRITING_COLORS} value={config.universityWritingColor} onChange={v => update('universityWritingColor', v)} />
            </Block>
          </div>

          <Block title="طرف الوشاح">
            <ChipGroup options={UNIVERSITY_SASH_TRIM} value={config.universitySashTrim} onChange={v => update('universitySashTrim', v)} />
          </Block>
        </div>
      )}

      {product.has_robe_builder && (
        <>
          <Block title="شكل الروب" hint="اختر الشكل اللي يناسبك — الأسعار الإضافية تُحسب تلقائيًا">
            <ChipGroup options={ROBE_SHAPES} value={config.robeShape} onChange={v => update('robeShape', v)} addonLabel={addonLabel} />
          </Block>

          <Block title="موديل الكُم">
            <ChipGroup options={SLEEVE_STYLES} value={config.sleeveStyle} onChange={v => update('sleeveStyle', v)} />
          </Block>

          {config.addSash && (
            <>
              <Block title="شكل الوشاح">
                <ChipGroup options={SASH_SHAPES} value={config.sashShape} onChange={v => update('sashShape', v)} />
              </Block>

              <div className="grid grid-cols-2 gap-4">
                <Block title="طرف الوشاح">
                  <ChipGroup options={SASH_TRIM} value={config.sashTrim} onChange={v => update('sashTrim', v)} />
                </Block>
                <Block title="اتجاه التطريز">
                  <ChipGroup options={EMBROIDERY_DIRECTIONS} value={config.embroideryDirection} onChange={v => update('embroideryDirection', v)} />
                </Block>
              </div>

              <Block title="تطريز إضافي بخلف الوشاح">
                <div className="flex gap-2">
                  <button type="button" onClick={() => update('sashBackEmbroidery', true)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${config.sashBackEmbroidery ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>إضافة {addonLabel('sash_back_embroidery_addon')}</button>
                  <button type="button" onClick={() => update('sashBackEmbroidery', false)} className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${!config.sashBackEmbroidery ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>بدون</button>
                </div>
              </Block>
            </>
          )}

          {product.has_cap && (
            <Block title="تصميم تطريز القبعة" hint={`اختياري — إضافة تطريز على القبعة ${addonLabel('cap_embroidery_addon')}`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <button type="button" onClick={() => update('capEmbroideryDesign', null)} className={`px-2.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${!config.capEmbroideryDesign ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>بدون تطريز</button>
                {CAP_EMBROIDERY_DESIGNS.map(d => (
                  <button key={d.id} type="button" onClick={() => update('capEmbroideryDesign', d.id)} className={`px-2.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${config.capEmbroideryDesign === d.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>{d.id}. {d.label}</button>
                ))}
              </div>
            </Block>
          )}

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2 mb-5">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">يجب أن يكون الطلب موحّد بكل تفاصيله. أي تعديل خارج هذا الفورم بعد تأكيد الطلب يرجى التواصل معنا مباشرة قبل التنفيذ.</p>
          </div>
        </>
      )}
    </div>
  );
}
