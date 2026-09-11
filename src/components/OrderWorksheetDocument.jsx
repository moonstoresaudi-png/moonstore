import React, { useRef, useState } from 'react';
import { Download, Loader2, User } from 'lucide-react';

// نفس منطق تحليل sash_config المستخدم بلوحة الأدمين (JSON لكل قسم أو نص عادي)
const IMAGE_KEYS = ['logo_url'];
const IMAGE_ARRAY_KEYS = ['referencePhotos'];
const IMAGE_MAP_KEYS = ['designPhotos'];

const FIELD_LABELS = {
  mode: 'طريقة التطريز', text: 'النص', name: 'الاسم', year: 'سنة التخرج', date: 'التاريخ',
  font: 'الخط', size: 'المقاس', university: 'الجامعة', sashColor: 'لون الوشاح', capColor: 'لون الكاب',
  capType: 'نوع الكاب', tassel: 'لون الشرابة', thread: 'لون التطريز', logo_url: 'الشعار', addSash: 'وشاح إضافي',
  fontType: 'نوع الخط', packaging: 'تغليف فاخر', jacketName: 'الاسم بالخلف', sleeveColor: 'لون الأكمام',
  frontDesign: 'التصميم الأمامي', leftSleeveDesign: 'الكم الأيسر', rightSleeveDesign: 'الكم الأيمن',
  backDesign: 'تصميم الظهر', designPhotos: 'صور تصاميم الجاكيت', sashLayoutPhoto: 'صورة ترتيب كلام الوشاح',
  referencePhotos: 'صور مرجعية إضافية', customDesignFee: 'رسوم تصاميم خاصة',
};

function parseConfigSegments(raw) {
  if (!raw) return [];
  return raw.split(' | ').filter(Boolean).map((seg) => {
    try {
      const obj = JSON.parse(seg);
      if (obj && typeof obj === 'object') return { type: 'json', data: obj };
    } catch { /* نص عادي */ }
    return { type: 'text', data: seg };
  });
}

// ورقة تجهيز الطلب — تجمع كل تفاصيل التخصيص والصور المرفوعة باسم العميل، بدون أي إشارة للسعر
// أو بيانات دفع، مناسبة لتسليمها لقسم التنفيذ/التطريز مباشرة.
export default function OrderWorksheetDocument({ order, onClose }) {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const segments = parseConfigSegments(order.sash_config);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const node = printRef.current;
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const imgH = (canvas.height * pageW) / canvas.width;
      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pageW, imgH);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        position -= pdf.internal.pageSize.getHeight();
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageW, imgH);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save(`طلب-${order.order_number || order.id}.pdf`);
    } catch { /* لو فشل، الورقة تبقى ظاهرة بالصفحة يقدر يطبعها من المتصفح */ }
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-3 sm:p-6" dir="rtl">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-border p-3 flex items-center justify-between z-10">
          <h3 className="font-bold text-sm">ورقة تجهيز الطلب</h3>
          <div className="flex items-center gap-2">
            <button onClick={downloadPdf} disabled={downloading} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-60">
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {downloading ? 'جارٍ التحميل...' : 'تحميل PDF'}
            </button>
            {onClose && <button onClick={onClose} className="px-3 py-2 rounded-full bg-secondary text-xs font-medium">إغلاق</button>}
          </div>
        </div>

        <div ref={printRef} className="p-8" style={{ fontFamily: 'system-ui, sans-serif' }}>
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <div>
              <h2 className="font-bold text-lg">ورقة تجهيز الطلب</h2>
              <p className="text-xs text-foreground/50">Order Worksheet</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-foreground/50">رقم الطلب</p>
              <p className="font-bold text-primary">#{order.order_number}</p>
            </div>
          </div>

          <div className="rounded-xl bg-secondary/40 p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-foreground/50">الطلب باسم</p>
              <p className="font-bold text-base">{order.customer_name}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-foreground/50 mb-1">المنتج</p>
            <p className="font-bold">{order.product_name}</p>
          </div>

          <div className="space-y-4">
            {segments.length === 0 ? (
              <p className="text-sm text-foreground/50">لا توجد تفاصيل تخصيص إضافية لهذا الطلب.</p>
            ) : segments.map((seg, i) => (
              <div key={i} className="rounded-xl border border-border bg-secondary/20 p-4">
                {seg.type === 'text' ? (
                  <p className="text-sm">{seg.data}</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(seg.data).map(([k, v]) => {
                      if (!v) return null;
                      if (IMAGE_KEYS.includes(k)) {
                        return (
                          <div key={k}>
                            <p className="text-xs text-foreground/50 mb-1.5">{FIELD_LABELS[k] || k}</p>
                            <img src={v} alt={k} className="w-32 h-32 rounded-lg object-cover border border-border" />
                          </div>
                        );
                      }
                      if (IMAGE_ARRAY_KEYS.includes(k) && Array.isArray(v)) {
                        return (
                          <div key={k}>
                            <p className="text-xs text-foreground/50 mb-1.5">{FIELD_LABELS[k] || k}</p>
                            <div className="flex flex-wrap gap-2">
                              {v.map((url, idx) => <img key={url} src={url} alt={`${k}-${idx}`} className="w-28 h-28 rounded-lg object-cover border border-border" />)}
                            </div>
                          </div>
                        );
                      }
                      if (IMAGE_MAP_KEYS.includes(k) && typeof v === 'object') {
                        return (
                          <div key={k}>
                            <p className="text-xs text-foreground/50 mb-1.5">{FIELD_LABELS[k] || k}</p>
                            <div className="flex flex-wrap gap-3">
                              {Object.entries(v).map(([designId, url]) => (
                                <div key={designId} className="relative">
                                  <img src={url} alt={`تصميم ${designId}`} className="w-28 h-28 rounded-lg object-cover border border-border" />
                                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-white text-xs font-extrabold flex items-center justify-center">{designId}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={k} className="flex items-center gap-2 text-sm">
                          <span className="text-xs text-foreground/50 min-w-[100px]">{FIELD_LABELS[k] || k}:</span>
                          <span className="font-medium">{String(v)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
