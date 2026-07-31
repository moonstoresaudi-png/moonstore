// Supabase Edge Function: create-shipment
// يُنشئ طلب شحن تلقائي عند Tryoto (OTO) لطلب معيّن، على 4 خطوات حسب توثيق Tryoto:
//   1) POST /rest/v2/orders          — إنشاء الطلب عند Tryoto
//   2) GET  /rest/v2/delivery-fee    — جلب شركات التوصيل المتاحة وأسعارها
//   3) POST /rest/v2/shipments       — إنشاء الشحنة الفعلية (يختار أرخص شركة تلقائيًا)
//   4) GET  /rest/v2/orderStatus     — جلب رابط طباعة البوليصة ورقم التتبع
//
// يُستدعى تلقائيًا من verify-payment بعد تأكيد أي دفع أونلاين (إصدار تلقائي بدون
// تدخل بشري)، ويقدر الأدمن يستدعيه يدويًا من لوحة التحكم لأي طلب (زر "إصدار"/"إعادة محاولة").
//
// النشر:
//   supabase functions deploy create-shipment
//   supabase secrets set TRYOTO_REFRESH_TOKEN=xxxxxxxx
//
// طريقة الحصول على القيمة:
//   لوحة تحكم Tryoto → Settings → Developers → API Integrations → Connect
//
// ملاحظة: ما نحتاج TRYOTO_PICKUP_LOCATION_CODE — نرسل عنوان المرسل (senderInformation)
// مباشرة بكل طلب بدلها (معبّى أدناه بعنوانك الفعلي بجدة). لو غيّرت مستودعك مستقبلاً
// عدّل القيم بـ SENDER_INFO تحت.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TRYOTO_REFRESH_TOKEN = Deno.env.get('TRYOTO_REFRESH_TOKEN');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const TRYOTO_BASE = 'https://api.tryoto.com/rest/v2';

// عنوان المرسل (متجرك) — من بياناتك المرسلة
const SENDER_INFO = {
  name: 'موقع الإرسال الخاص بي',
  city: 'Jeddah',
  address: 'jjsb7989, 7989, Kamal Al Deen Al Farsi, 3239, As Sanabel Dist., 22444, Jeddah, Kingdom of Saudi Arabia',
  country: 'Saudi Arabia',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function getAccessToken() {
  const res = await fetch(`${TRYOTO_BASE}/refreshToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: TRYOTO_REFRESH_TOKEN }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`Tryoto auth failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

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
    if (!TRYOTO_REFRESH_TOKEN || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ ok: false, error: 'إعدادات Tryoto ناقصة على السيرفر (TRYOTO_REFRESH_TOKEN)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ ok: false, error: 'order_id مفقود' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: order, error: fetchErr } = await supabase.from('orders').select('*').eq('id', order_id).single();
    if (fetchErr || !order) {
      return new Response(JSON.stringify({ ok: false, error: 'الطلب غير موجود' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase.from('orders').update({ awb_status: 'processing', shipping_error: null }).eq('id', order_id);

    const accessToken = await getAccessToken();
    const otoOrderId = String(order.order_number || order.id);
    const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };

    // ---------- 1) إنشاء الطلب عند Tryoto ----------
    const orderBody = {
      orderId: otoOrderId,
      customer: {
        name: order.customer_name || 'عميل',
        mobile: order.phone,
      },
      senderInformation: SENDER_INFO,
      item_description: order.product_name || `طلب ${otoOrderId}`,
      packageWeight: 1,
      amount: order.total || 0,
      currency: 'SAR',
      paymentType: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
      codAmount: order.payment_method === 'cod' ? order.total : 0,
      // لو عندنا رمز العنوان الوطني يكفي وحده، وإلا نرسل تفاصيل العنوان كاملة
      ...(order.short_address_code
        ? { shortAddressCode: order.short_address_code }
        : { address: order.address, city: order.city, country: order.country || 'Saudi Arabia' }),
      latitude: order.lat || undefined,
      longitude: order.lng || undefined,
    };

    const createRes = await fetch(`${TRYOTO_BASE}/orders`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(orderBody),
    });
    const createData = await createRes.json();

    if (!createRes.ok || createData.success === false) {
      const errMsg = createData.message || createData.error || JSON.stringify(createData);
      await supabase.from('orders').update({ awb_status: 'failed', shipping_error: `إنشاء الطلب: ${errMsg}` }).eq('id', order_id);
      return new Response(JSON.stringify({ ok: false, error: errMsg }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---------- 2) جلب شركات التوصيل المتاحة والأسعار ----------
    const feeRes = await fetch(`${TRYOTO_BASE}/delivery-fee?orderId=${encodeURIComponent(otoOrderId)}`, {
      headers: authHeaders,
    });
    const feeData = await feeRes.json();
    const options = Array.isArray(feeData) ? feeData : feeData?.deliveryOptions || feeData?.data || [];

    if (!options.length) {
      await supabase.from('orders').update({ awb_status: 'failed', shipping_error: 'لا توجد شركات توصيل متاحة لهذا العنوان' }).eq('id', order_id);
      return new Response(JSON.stringify({ ok: false, error: 'لا توجد شركات توصيل متاحة' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // اختيار أرخص شركة توصيل تلقائيًا (بدون تدخل بشري)
    const cheapest = options.reduce((best, cur) => {
      const curPrice = cur.priceAmount ?? cur.price ?? Infinity;
      const bestPrice = best.priceAmount ?? best.price ?? Infinity;
      return curPrice < bestPrice ? cur : best;
    }, options[0]);
    const deliveryOptionId = cheapest.deliveryOptionId ?? cheapest.id;

    // ---------- 3) إنشاء الشحنة الفعلية (البوليصة) ----------
    const shipRes = await fetch(`${TRYOTO_BASE}/shipments`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ orderId: otoOrderId, deliveryOptionId }),
    });
    const shipData = await shipRes.json();

    if (!shipRes.ok || shipData.success === false) {
      const errMsg = shipData.message || shipData.error || JSON.stringify(shipData);
      await supabase.from('orders').update({ awb_status: 'failed', shipping_error: `إنشاء الشحنة: ${errMsg}` }).eq('id', order_id);
      return new Response(JSON.stringify({ ok: false, error: errMsg }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---------- 4) جلب رابط طباعة البوليصة ورقم التتبع ----------
    let awbUrl = shipData.printAWBURL || null;
    let trackingNumber = shipData.trackingNumber || shipData.trackingURL || null;

    if (!awbUrl) {
      try {
        const statusRes = await fetch(`${TRYOTO_BASE}/orderStatus?orderId=${encodeURIComponent(otoOrderId)}`, {
          headers: authHeaders,
        });
        const statusData = await statusRes.json();
        awbUrl = statusData.printAWBURL || null;
        trackingNumber = trackingNumber || statusData.trackingURL || null;
      } catch (_e) {
        // البوليصة صارت موجودة عند Tryoto أصلاً حتى لو تعذّر جلب الرابط هنا
      }
    }

    await supabase
      .from('orders')
      .update({
        awb_status: 'shipped',
        oto_order_id: otoOrderId,
        tracking_number: trackingNumber,
        awb_url: awbUrl,
        shipping_error: null,
      })
      .eq('id', order_id);

    return new Response(JSON.stringify({ ok: true, awb_url: awbUrl, tracking_number: trackingNumber, carrier: cheapest.name }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
