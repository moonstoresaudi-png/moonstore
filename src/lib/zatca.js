// توليد رمز QR المطابق لمواصفة هيئة الزكاة والضريبة والجمارك (ZATCA) للفاتورة الضريبية المبسّطة
// المواصفة: كل حقل يُشفّر بصيغة TLV (Tag-Length-Value)، ثم كل الحقول تُدمج وتُشفّر بـ Base64
// الحقول المطلوبة (Simplified Tax Invoice):
//   1) اسم البائع   2) الرقم الضريبي   3) الطابع الزمني (ISO 8601)
//   4) إجمالي الفاتورة شامل الضريبة   5) قيمة ضريبة القيمة المضافة

function tlvField(tag, value) {
  const valueBytes = new TextEncoder().encode(String(value ?? ''));
  const out = new Uint8Array(2 + valueBytes.length);
  out[0] = tag;
  out[1] = valueBytes.length;
  out.set(valueBytes, 2);
  return out;
}

function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// يبني نص Base64 (TLV) الجاهز لتحويله لرمز QR
export function buildZatcaQrPayload({ sellerName, vatNumber, timestamp, totalWithVat, vatAmount }) {
  const fields = [
    tlvField(1, sellerName),
    tlvField(2, vatNumber),
    tlvField(3, timestamp),
    tlvField(4, Number(totalWithVat).toFixed(2)),
    tlvField(5, Number(vatAmount).toFixed(2)),
  ];
  const totalLen = fields.reduce((s, f) => s + f.length, 0);
  const merged = new Uint8Array(totalLen);
  let offset = 0;
  for (const f of fields) { merged.set(f, offset); offset += f.length; }
  return bytesToBase64(merged);
}

// السعودية: ضريبة القيمة المضافة 15% — المبلغ المخزّن بالطلب شامل الضريبة، نستخرج القيمة الأساسية والضريبة منه
export function splitVat(totalWithVat, rate = 0.15) {
  const base = totalWithVat / (1 + rate);
  const vat = totalWithVat - base;
  return { base: Math.round(base * 100) / 100, vat: Math.round(vat * 100) / 100 };
}
