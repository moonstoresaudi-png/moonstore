// Supabase Edge Function: verify-national-address
// يتحقق من صحة "الرمز المختصر للعنوان الوطني" (مثل RRRD2929) عبر واجهة
// البريد السعودي الرسمية (SPL National Address API)، ويرجّع العنوان الكامل
// المطابق له إذا كان صحيحًا.
//
// النشر:
//   supabase functions deploy verify-national-address
//   supabase secrets set SNA_API_KEY=xxxxxxxx
//
// طريقة الحصول على المفتاح:
//   سجّل حساب مطوّر على https://api.address.gov.sa (البريد السعودي)
//   واحصل على API Key (يوجد باقة تجريبية مجانية Development محدودة الطلبات شهريًا)

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const SNA_API_KEY = Deno.env.get('SNA_API_KEY');
const SNA_BASE = 'https://apina.address.gov.sa/NationalAddress';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SHORT_ADDRESS_PATTERN = /^[A-Z]{4}[0-9]{4}$/;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { short_address } = await req.json();
    const code = String(short_address || '').trim().toUpperCase();

    if (!SHORT_ADDRESS_PATTERN.test(code)) {
      return new Response(JSON.stringify({ ok: true, valid: false, reason: 'صيغة الرمز غير صحيحة (4 حروف + 4 أرقام)' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!SNA_API_KEY) {
      // ما زبطنا مفتاح البريد السعودي بعد — نرجّع النتيجة بناءً على صيغة الرمز فقط
      // بدل ما نمنع العميل من إكمال الطلب.
      return new Response(
        JSON.stringify({ ok: true, valid: true, verified: false, reason: 'التحقق الرسمي غير مفعّل بعد على السيرفر (SNA_API_KEY)، تم قبول الصيغة فقط' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `${SNA_BASE}/NationalAddressByShortAddress/NationalAddressByShortAddress?shortaddress=${encodeURIComponent(code)}&format=json&language=E`;
    const res = await fetch(url, {
      headers: { api_key: SNA_API_KEY, accept: 'application/json' },
    });

    // رد البريد السعودي يجي بترميز windows-1256 القديم، نفكّه يدويًا
    const buf = await res.arrayBuffer();
    const text = new TextDecoder('windows-1256').decode(buf);
    const data = JSON.parse(text);

    const found = (data?.totalSearchResults ?? 0) > 0;
    const addr = data?.Addresses?.[0] || null;

    return new Response(
      JSON.stringify({
        ok: true,
        valid: found,
        verified: true,
        address: addr
          ? {
              city: addr.City,
              district: addr.District,
              street: addr.Street,
              postCode: addr.PostCode,
              buildingNumber: addr.BuildingNumber,
              additionalNumber: addr.AdditionalNumber,
            }
          : null,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
