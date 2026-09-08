import React from 'react';
import { Upload, X, Loader2, Info, Sparkles } from 'lucide-react';
import { uploadFile } from '@/api/storage';
import {
  JACKET_FRONT_DESIGNS, JACKET_LEFT_SLEEVE_DESIGNS, JACKET_RIGHT_SLEEVE_DESIGNS, JACKET_BACK_DESIGN,
  JACKET_CUSTOM_DESIGN_FEE,
} from '@/lib/jacketOptions';

function Block({ title, hint, children }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-bold mb-1">{title}</label>
      {hint && <p className="text-xs text-foreground/45 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function DesignGrid({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o.id} type="button" onClick={() => onChange(o.id)} className={`px-3.5 py-2 rounded-xl border text-sm transition-all ${value === o.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>
          {o.label} {o.free ? (
            <span className={`text-[10px] font-bold ${value === o.id ? 'text-primary-foreground/80' : 'text-green-600'}`}>مجاني</span>
          ) : (
            <span className={`text-[10px] font-bold ${value === o.id ? 'text-primary-foreground/80' : 'text-amber-600'}`}>تصميم خاص +{JACKET_CUSTOM_DESIGN_FEE} ريال</span>
          )}
        </button>
      ))}
    </div>
  );
}

// صندوق رفع صور مخصّص لتصميم غير مجاني — يظهر مباشرة تحت التصميم المختار، ويدعم أكثر من صورة
function CustomDesignUpload({ label, photos, uploading, onUpload, onRemove }) {
  return (
    <div className="mt-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <p className="text-xs font-bold text-amber-700">{label} — تصميم خاص، يرجى إرفاق صورة أو أكثر توضح الشكل المطلوب</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {(photos || []).map(url => (
          <div key={url} className="relative w-16 h-16">
            <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
            <button type="button" onClick={() => onRemove(url)} className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
      <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-amber-400/50 text-amber-700 text-xs font-medium cursor-pointer hover:bg-amber-100/60 transition-colors">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? 'جارٍ الرفع...' : 'ارفع صورة أو أكثر للتصميم المطلوب'}
        <input type="file" accept="image/*" multiple onChange={onUpload} disabled={uploading} className="hidden" />
      </label>
    </div>
  );
}

// فورم طلب تخصيص الجاكيت (اسم بالخلف، مقاس، لون الأكمام، تصاميم الأمام/الأكمام/الظهر)
// + إمكانية رفع صور مرجعية من جهاز العميل مباشرة، مع رسوم إضافية وصورة مطلوبة لأي تصميم خاص (غير مجاني).
export default function JacketBuilder({ config, update }) {
  const [uploading, setUploading] = React.useState(false);
  const [slotUploading, setSlotUploading] = React.useState(null);

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const { file_url } = await uploadFile({ file });
        if (file_url) uploaded.push(file_url);
      }
      update('referencePhotos', [...(config.referencePhotos || []), ...uploaded]);
    } catch { /* لو فشل رفع صورة نتجاهلها بصمت، العميل يقدر يعيد المحاولة */ }
    setUploading(false);
    e.target.value = '';
  };

  const removePhoto = (url) => update('referencePhotos', (config.referencePhotos || []).filter(u => u !== url));

  // رفع صورة أو أكثر مرتبطة بتصميم خاص محدد (رقم 2 أو 5 أو 8)
  const handleSlotUpload = (slotKey) => async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSlotUploading(slotKey);
    try {
      const uploaded = [];
      for (const file of files) {
        const { file_url } = await uploadFile({ file });
        if (file_url) uploaded.push(file_url);
      }
      update(slotKey, [...(config[slotKey] || []), ...uploaded]);
    } catch { /* اختياري نتجاهل الخطأ بصمت، العميل يقدر يعيد المحاولة */ }
    setSlotUploading(null);
    e.target.value = '';
  };

  const removeSlotPhoto = (slotKey) => (url) => update(slotKey, (config[slotKey] || []).filter(u => u !== url));

  return (
    <div>
      <Block title="الاسم بالخلف">
        <input value={config.name} onChange={e => update('name', e.target.value)} placeholder="الاسم اللي تبيه مطرّز بخلف الجاكيت" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
      </Block>

      <Block title="لون الأكمام">
        <input value={config.sleeveColor} onChange={e => update('sleeveColor', e.target.value)} placeholder="مثال: أسود، كحلي..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
      </Block>

      <Block title="التصميم الأمامي">
        <DesignGrid options={JACKET_FRONT_DESIGNS} value={config.frontDesign} onChange={v => update('frontDesign', v)} />
        {config.frontDesign === 2 && (
          <CustomDesignUpload
            label="التصميم الأمامي 2"
            photos={config.frontDesignPhotos}
            uploading={slotUploading === 'frontDesignPhotos'}
            onUpload={handleSlotUpload('frontDesignPhotos')}
            onRemove={removeSlotPhoto('frontDesignPhotos')}
          />
        )}
      </Block>

      <Block title="تصميم الكم الأيسر">
        <DesignGrid options={JACKET_LEFT_SLEEVE_DESIGNS} value={config.leftSleeveDesign} onChange={v => update('leftSleeveDesign', v)} />
        {config.leftSleeveDesign === 5 && (
          <CustomDesignUpload
            label="الكم الأيسر — تصميم 5"
            photos={config.leftSleeveDesignPhotos}
            uploading={slotUploading === 'leftSleeveDesignPhotos'}
            onUpload={handleSlotUpload('leftSleeveDesignPhotos')}
            onRemove={removeSlotPhoto('leftSleeveDesignPhotos')}
          />
        )}
      </Block>

      <Block title="تصميم الكم الأيمن">
        <DesignGrid options={JACKET_RIGHT_SLEEVE_DESIGNS} value={config.rightSleeveDesign} onChange={v => update('rightSleeveDesign', v)} />
        {config.rightSleeveDesign === 8 && (
          <CustomDesignUpload
            label="الكم الأيمن — تصميم 8"
            photos={config.rightSleeveDesignPhotos}
            uploading={slotUploading === 'rightSleeveDesignPhotos'}
            onUpload={handleSlotUpload('rightSleeveDesignPhotos')}
            onRemove={removeSlotPhoto('rightSleeveDesignPhotos')}
          />
        )}
      </Block>

      <Block title="تصميم الظهر">
        <div className="flex gap-2">
          <button type="button" onClick={() => update('backDesign', JACKET_BACK_DESIGN.id)} className={`px-3.5 py-2 rounded-xl border text-sm transition-all ${config.backDesign === JACKET_BACK_DESIGN.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`}>
            {JACKET_BACK_DESIGN.label} <span className={`text-[10px] font-bold ${config.backDesign === JACKET_BACK_DESIGN.id ? 'text-primary-foreground/80' : 'text-green-600'}`}>مجاني</span>
          </button>
        </div>
      </Block>

      <Block title="صور مرجعية إضافية (اختياري)" hint="ارفع صور من جهازك لأي تصميم أو شعار إضافي تحب نطبّقه بالجاكيت">
        <div className="flex flex-wrap gap-2 mb-2">
          {(config.referencePhotos || []).map(url => (
            <div key={url} className="relative w-16 h-16">
              <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
              <button type="button" onClick={() => removePhoto(url)} className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary text-xs font-medium cursor-pointer hover:bg-primary/5 transition-colors">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'جارٍ الرفع...' : 'ارفع صورة أو أكثر من جهازك'}
          <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} disabled={uploading} className="hidden" />
        </label>
      </Block>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2 mb-2">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">لن يتم اعتماد أي تغيير خارج هذا الفورم — يرجى التأكد من جميع التفاصيل قبل تأكيد الطلب. التصميم والألوان مقاربة لصورة الجاكيت بنسبة 85%. التصاميم الخاصة (غير المجانية) تُضاف عليها {JACKET_CUSTOM_DESIGN_FEE} ريال لكل تصميم، وتتطلب صورة مرفقة لتنفيذها بدقة.</p>
      </div>
    </div>
  );
}
