import React from 'react';
import { X, Loader2, Info, Camera } from 'lucide-react';
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

// مربع تصميم مرقّم — يجمع الاختيار ورفع الصورة الخاصة بنفس الرقم في مكان واحد
// - غير مُختار: مربع فاتح فيه رقم التصميم وسعره (مجاني / +15 ريال)، الضغط عليه يختاره
// - مُختار بدون صورة: يفتح رفع صورة مباشرة عند الضغط على المربع
// - مُختار وفيه صورة: يعرض الصورة نفسها داخل المربع (بالضغط عليها تفتح بحجمها الكامل)، مع رقم التصميم كشارة ثابتة
function DesignTile({ option, selected, photo, uploading, onToggle, onUpload }) {
  return (
    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all ${selected ? 'border-primary' : 'border-border'} ${photo ? 'bg-card' : selected ? 'bg-primary/10' : 'bg-secondary/40 hover:border-primary/40'}`}>
      {photo ? (
        <a href={photo} target="_blank" rel="noreferrer" className="absolute inset-0" title="اضغط لمشاهدة الصورة بحجمها الكامل">
          <img src={photo} alt={`تصميم ${option.id}`} className="w-full h-full object-cover" />
        </a>
      ) : selected ? (
        <label className="absolute inset-0 flex flex-col items-center justify-center gap-1 cursor-pointer">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Camera className="w-5 h-5 text-primary" />}
          <span className="text-[9px] text-primary font-bold">{uploading ? 'جارٍ الرفع' : 'ارفع صورة'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      ) : (
        <button type="button" onClick={onToggle} className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[10px] font-bold ${option.free ? 'text-green-600' : 'text-amber-600'}`}>{option.free ? 'مجاني' : `+${JACKET_CUSTOM_DESIGN_FEE} ﷼`}</span>
        </button>
      )}

      {/* شارة رقم التصميم — دائمًا ظاهرة، والضغط عليها يختار/يلغي الاختيار */}
      <button
        type="button"
        onClick={onToggle}
        title={selected ? 'إلغاء اختيار هذا التصميم' : 'اختيار هذا التصميم'}
        className={`absolute top-1 right-1 w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center z-10 shadow ${selected ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background'}`}
      >
        {option.id}
      </button>

      {/* زر إزالة الصورة فقط (يبقى التصميم مختارًا) */}
      {photo && (
        <button type="button" onClick={() => onUpload(null, true)} title="إزالة الصورة" className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center z-10">
          <X className="w-3 h-3" />
        </button>
      )}

      {/* شريط السعر أسفل المربع لما فيه صورة، عشان يبقى واضح حتى بعد الرفع */}
      {photo && (
        <div className={`absolute bottom-0 inset-x-0 text-[9px] text-center py-0.5 text-white font-bold ${option.free ? 'bg-green-700/70' : 'bg-amber-700/75'}`}>
          {option.free ? 'مجاني' : `+${JACKET_CUSTOM_DESIGN_FEE} ﷼`}
        </div>
      )}
    </div>
  );
}

// فورم طلب تخصيص الجاكيت (اسم بالخلف، مقاس، لون الأكمام، تصاميم الأمام/الأكمام/الظهر)
// التصميم الأمامي يدعم اختيار متعدد (1 و2 مع بعض)، الأكمام والظهر اختيار مفرد.
// كل رقم تصميم له مربعه الخاص لرفع صورة مرجعية ومعاينتها مباشرة بنفس المربع.
export default function JacketBuilder({ config, update }) {
  const [uploadingId, setUploadingId] = React.useState(null);

  const designPhotos = config.designPhotos || {};
  const frontDesigns = config.frontDesigns || [];

  const setPhoto = (id, url) => update('designPhotos', { ...designPhotos, [id]: url });
  const clearPhoto = (id) => {
    const next = { ...designPhotos };
    delete next[id];
    update('designPhotos', next);
  };

  const handleUpload = (id) => async (e, removeOnly) => {
    if (removeOnly) { clearPhoto(id); return; }
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(id);
    try {
      const { file_url } = await uploadFile({ file });
      if (file_url) setPhoto(id, file_url);
    } catch { /* اختياري نتجاهل الخطأ بصمت، العميل يقدر يعيد المحاولة */ }
    setUploadingId(null);
    e.target.value = '';
  };

  // التصميم الأمامي: اختيار متعدد — يقدر العميل يختار 1 و2 مع بعض
  const toggleFrontDesign = (id) => {
    const active = frontDesigns.includes(id);
    if (active) {
      update('frontDesigns', frontDesigns.filter(x => x !== id));
      clearPhoto(id);
    } else {
      update('frontDesigns', [...frontDesigns, id]);
    }
  };

  // الأكمام: اختيار مفرد — اختيار تصميم جديد يلغي القديم، والضغط على المختار حاليًا يلغيه
  const toggleSingle = (key) => (id) => {
    if (config[key] === id) {
      update(key, null);
      clearPhoto(id);
    } else {
      if (config[key]) clearPhoto(config[key]);
      update(key, id);
    }
  };

  return (
    <div>
      <Block title="الاسم بالخلف">
        <input value={config.name} onChange={e => update('name', e.target.value)} placeholder="الاسم اللي تبيه مطرّز بخلف الجاكيت" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
      </Block>

      <Block title="لون الأكمام">
        <input value={config.sleeveColor} onChange={e => update('sleeveColor', e.target.value)} placeholder="مثال: أسود، كحلي..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" />
      </Block>

      <Block title="التصميم الأمامي" hint="تقدر تختار 1 و2 مع بعض — اختيار 2 يضيف رسوم فورًا">
        <div className="flex flex-wrap gap-2.5">
          {JACKET_FRONT_DESIGNS.map(o => (
            <DesignTile key={o.id} option={o} selected={frontDesigns.includes(o.id)} photo={designPhotos[o.id]} uploading={uploadingId === o.id} onToggle={() => toggleFrontDesign(o.id)} onUpload={handleUpload(o.id)} />
          ))}
        </div>
      </Block>

      <Block title="تصميم الكم الأيسر">
        <div className="flex flex-wrap gap-2.5">
          {JACKET_LEFT_SLEEVE_DESIGNS.map(o => (
            <DesignTile key={o.id} option={o} selected={config.leftSleeveDesign === o.id} photo={designPhotos[o.id]} uploading={uploadingId === o.id} onToggle={() => toggleSingle('leftSleeveDesign')(o.id)} onUpload={handleUpload(o.id)} />
          ))}
        </div>
      </Block>

      <Block title="تصميم الكم الأيمن">
        <div className="flex flex-wrap gap-2.5">
          {JACKET_RIGHT_SLEEVE_DESIGNS.map(o => (
            <DesignTile key={o.id} option={o} selected={config.rightSleeveDesign === o.id} photo={designPhotos[o.id]} uploading={uploadingId === o.id} onToggle={() => toggleSingle('rightSleeveDesign')(o.id)} onUpload={handleUpload(o.id)} />
          ))}
        </div>
      </Block>

      <Block title="تصميم الظهر">
        <div className="flex flex-wrap gap-2.5">
          <DesignTile
            option={JACKET_BACK_DESIGN}
            selected={config.backDesign === JACKET_BACK_DESIGN.id}
            photo={designPhotos[JACKET_BACK_DESIGN.id]}
            uploading={uploadingId === JACKET_BACK_DESIGN.id}
            onToggle={() => toggleSingle('backDesign')(JACKET_BACK_DESIGN.id)}
            onUpload={handleUpload(JACKET_BACK_DESIGN.id)}
          />
        </div>
      </Block>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2 mb-2">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">لن يتم اعتماد أي تغيير خارج هذا الفورم — يرجى التأكد من جميع التفاصيل قبل تأكيد الطلب. التصميم والألوان مقاربة لصورة الجاكيت بنسبة 85%. التصاميم الخاصة (غير المجانية) تُضاف عليها {JACKET_CUSTOM_DESIGN_FEE} ريال لكل تصميم، وتتطلب صورة مرفقة لتنفيذها بدقة.</p>
      </div>
    </div>
  );
}
