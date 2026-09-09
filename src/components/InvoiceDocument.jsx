import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Loader2 } from 'lucide-react';
import { buildZatcaQrPayload, splitVat } from '@/lib/zatca';

// تفاصيل تخصيص مفهومة من sash_config (نفس منطق ConfigDetails بلوحة الأدمين) — نص مبسّط للفاتورة
function summarizeConfig(raw) {
  if (!raw) return [];
  return raw.split(' | ').filter(Boolean).map(seg => {
    try {
      const obj = JSON.parse(seg);
      if (obj && typeof obj === 'object') {
        return Object.entries(obj)
          .filter(([, v]) => v && typeof v !== 'object')
          .map(([, v]) => String(v));
      }
    } catch { /* نص عادي */ }
    return [seg];
  }).flat();
}

// فاتورة ضريبية مبسّطة مطابقة لمتطلبات هيئة الزكاة والضريبة والجمارك (ZATCA) — شعار المتجر، الرقم
// الضريبي، رمز QR (TLV/Base64)، بيانات العميل والطلب، وتفاصيل الحساب. تدعم التحميل كملف PDF مباشرة.
export default function InvoiceDocument({ order, settings, onClose }) {
  const printRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [downloading, setDownloading] = useState(false);

  const total = Number(order.total || 0);
  const { base, vat } = splitVat(total);
  const timestamp = new Date(order.created_at || order.created_date || Date.now()).toISOString();
  const hasVat = !!(settings.vat_number && settings.vat_number.trim());

  useEffect(() => {
    let cancelled = false;
    const payload = buildZatcaQrPayload({
      sellerName: settings.store_name || 'Moon Store',
      vatNumber: settings.vat_number || '',
      timestamp,
      totalWithVat: total,
      vatAmount: hasVat ? vat : 0,
    });
    QRCode.toDataURL(payload, { width: 160, margin: 0 }).then(url => { if (!cancelled) setQrDataUrl(url); }).catch(() => {});
    return () => { cancelled = true; };
  }, [order.id, settings.vat_number]);

  const configLines = summarizeConfig(order.sash_config);

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
      pdf.addImage(imgData, 'PNG', 0, 0, pageW, imgH);
      pdf.save(`فاتورة-${order.order_number || order.id}.pdf`);
    } catch { /* لو فشل التحميل لأي سبب، الفاتورة تبقى ظاهرة بالصفحة يقدر يطبعها من المتصفح */ }
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-3 sm:p-6" dir="rtl">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-border p-3 flex items-center justify-between z-10">
          <h3 className="font-bold text-sm">الفاتورة الضريبية</h3>
          <div className="flex items-center gap-2">
            <button onClick={downloadPdf} disabled={downloading} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-60">
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {downloading ? 'جارٍ التحميل...' : 'تحميل PDF'}
            </button>
            {onClose && <button onClick={onClose} className="px-3 py-2 rounded-full bg-secondary text-xs font-medium">إغلاق</button>}
          </div>
        </div>

        <div ref={printRef} className="p-8 text-foreground" style={{ fontFamily: 'system-ui, sans-serif' }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <img src="/images/brand/logo.png" alt={settings.store_name} className="h-14 object-contain mb-2" />
              <p className="font-bold text-sm">{settings.store_name}</p>
              {settings.address && <p className="text-xs text-foreground/60">{settings.address}</p>}
              {settings.phone && <p className="text-xs text-foreground/60">{settings.phone}</p>}
              {settings.email && <p className="text-xs text-foreground/60">{settings.email}</p>}
            </div>
            <div className="text-left">
              <h2 className="font-bold text-lg mb-1">فاتورة ضريبية مبسّطة</h2>
              <p className="text-xs text-foreground/60">Simplified Tax Invoice</p>
              {settings.cr_number && <p className="text-xs text-foreground/60 mt-2">رقم السجل التجاري: {settings.cr_number}</p>}
              <p className="text-xs text-foreground/60">
                الرقم الضريبي: {hasVat ? settings.vat_number : <span className="text-amber-600">غير مسجّل</span>}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="rounded-xl bg-secondary/40 p-3">
              <p className="text-xs text-foreground/50 mb-1">رقم الفاتورة / الطلب</p>
              <p className="font-bold">#{order.order_number}</p>
              <p className="text-xs text-foreground/50 mt-2 mb-1">تاريخ الإصدار</p>
              <p className="font-medium">{new Date(timestamp).toLocaleString('ar-SA')}</p>
            </div>
            <div className="rounded-xl bg-secondary/40 p-3">
              <p className="text-xs text-foreground/50 mb-1">بيانات العميل</p>
              <p className="font-bold">{order.customer_name}</p>
              {order.phone && <p className="text-xs text-foreground/70" dir="ltr">{order.phone}</p>}
              {(order.address || order.city) && <p className="text-xs text-foreground/70">{[order.address, order.city].filter(Boolean).join('، ')}</p>}
            </div>
          </div>

          <table className="w-full text-sm mb-6 border border-border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-foreground text-white text-right">
                <th className="p-2.5">الوصف</th>
                <th className="p-2.5 text-center">الكمية</th>
                <th className="p-2.5 text-left">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-2.5">
                  <p className="font-medium">{order.product_name}</p>
                  {configLines.length > 0 && (
                    <p className="text-xs text-foreground/50 mt-1 leading-relaxed">{configLines.join(' — ')}</p>
                  )}
                </td>
                <td className="p-2.5 text-center">{order.quantity || 1}</td>
                <td className="p-2.5 text-left">{total} ﷼</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-foreground/60">الإجمالي (غير شامل الضريبة)</span><span>{base.toFixed(2)} ﷼</span></div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600"><span>الخصم {order.discount_code ? `(${order.discount_code})` : ''}</span><span>-{order.discount_amount} ﷼</span></div>
              )}
              <div className="flex justify-between"><span className="text-foreground/60">ضريبة القيمة المضافة 15%</span><span>{hasVat ? vat.toFixed(2) : '0.00'} ﷼</span></div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-1.5 mt-1.5"><span>الإجمالي شامل الضريبة</span><span className="text-primary">{total.toFixed(2)} ﷼</span></div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-5">
            <div className="text-xs text-foreground/45 max-w-xs leading-relaxed">
              فاتورة إلكترونية مبسّطة صادرة عبر متجر {settings.store_name}. للاستفسارات: {settings.phone || settings.email}
              {!hasVat && <p className="text-amber-600 mt-1">* المنشأة غير مسجّلة بضريبة القيمة المضافة حاليًا.</p>}
            </div>
            {qrDataUrl && <img src={qrDataUrl} alt="ZATCA QR" className="w-24 h-24" />}
          </div>
        </div>
      </div>
    </div>
  );
}
