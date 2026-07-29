// Supabase Edge Function: create-shipment
// يُنشئ طلب شحن (Order) وبوليصة شحن (AWB) تلقائيًا عند Tryoto (OTO)
// لطلب معيّن، ويحفظ رابط طباعة البوليصة ورقم التتبع على الطلب.
//
// يُستدعى تلقائيًا من verify-payment بعد تأكيد أي دفع أونلاين (إصدار تلقائي)،
// ويقدر الأدمن يستدعيه يدويًا من لوحة التحكم لأي طلب (زر "إصدار بوليصة"/"إعادة محاولة").
//
// النشر:
//   supabase functions deploy create-shipment
//   supabase secrets set TRYOTO_REFRESH_TOKEN=xxxxxxxx
//   supabase secrets set TRYOTO_PICKUP_LOCATION_CODE=your-warehouse-code
//
// طريقة الحصول على القيم:
//   1) TRYOTO_REFRESH_TOKEN: من لوحة تحكم Tryoto → Settings → Developers → API Integrations → Connect
//   2) TRYOTO_PICKUP_LOCATION_CODE: كود المستودع/الفرع اللي سجّلته بلوحة Tryoto (Settings → Warehouses/Locations)
//      — تأكد إنك حاطط له "Short Address" (عنوانك الوطني أنت كمرسل) من نفس الإعدادات

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TRYOTO_REFRESH_TOKEN = Deno.env.get('TRYOTO_REFRESH_TOKEN');
const TRYOTO_PICKUP_LOCATION_CODE = Deno.env.get('TRYOTO_PICKUP_LOCATION_CODE');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const TRYOTO_BASE = 'https://api.tryoto.com/rest/v2';

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
    if (!TRYOTO_REFRESH_TOKEN || !TRYOTO_PICKUP_LOCATION_CODE || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ ok: false, error: 'إعدادات Tryoto ناقصة على السيرفر (TRYOTO_REFRESH_TOKEN أو TRYOTO_PICKUP_LOCATION_CODE)' }),
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

    // تجهيز عناصر الطلب لـ Tryoto
    const items = Array.isArray(order.items) ? order.items : [];
    const orderItems = items.length
      ? items.map((it) => ({
          name: it.name || it.product_name || 'منتج',
          sku: it.sku || it.product_id || 'SKU',
          qty: it.quantity || it.qty || 1,
          unitPrice: it.price || it.unit_price || 0,
        }))
      : [{ name: `طلب ${order.order_number || order.id}`, sku: 'ORDER', qty: 1, unitPrice: order.total || 0 }];

    const accessToken = await getAccessToken();

    const createOrderBody = {
      orderId: String(order.order_number || order.id),
      pickupLocationCode: TRYOTO_PICKUP_LOCATION_CODE,
      createShipment: true,
      currency: 'SAR',
      paymentType: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
      codAmount: order.payment_method === 'cod' ? order.total : 0,
      customerFirstName: order.customer_name || 'عميل',
      customerLastName: '',
      customerPhone: order.phone,
      customerEmail: order.email || undefined,
      address: order.address,
      city: order.city,
      country: order.country || 'Saudi Arabia',
      shortAddressCode: order.short_address_code || undefined,
      latitude: order.lat || undefined,
      longitude: order.lng || undefined,
      items: orderItems,
    };

    const createRes = await fetch(`${TRYOTO_BASE}/createOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(createOrderBody),
    });
    const createData = await createRes.json();

    if (!createRes.ok || createData.success === false) {
      const errMsg = createData.message || createData.error || JSON.stringify(createData);
      await supabase.from('orders').update({ awb_status: 'failed', shipping_error: errMsg }).eq('id', order_id);
      return new Response(JSON.stringify({ ok: false, error: errMsg }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // محاولة الحصول على رابط طباعة البوليصة (AWB) — إما من نفس الرد أو عبر endpoint الطباعة
    let awbUrl = createData.printAWBURL || createData.awbUrl || null;
    let trackingNumber = createData.trackingNumber || createData.dcTrackingNumber || null;

    if (!awbUrl) {
      try {
        const printRes = await fetch(`${TRYOTO_BASE}/print/${encodeURIComponent(createOrderBody.orderId)}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const printData = await printRes.json();
        awbUrl = printData.printAWBURL || printData.url || null;
      } catch (_e) {
        // ما تعطلنا لو فشلت خطوة الطباعة، البوليصة صارت موجودة عند Tryoto أصلاً
      }
    }

    await supabase
      .from('orders')
      .update({
        awb_status: 'shipped',
        oto_order_id: String(createData.otoId || createData.orderId || ''),
        tracking_number: trackingNumber,
        awb_url: awbUrl,
        shipping_error: null,
      })
      .eq('id', order_id);

    return new Response(JSON.stringify({ ok: true, awb_url: awbUrl, tracking_number: trackingNumber }), {
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
