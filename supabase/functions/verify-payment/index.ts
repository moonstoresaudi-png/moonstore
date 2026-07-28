// Supabase Edge Function: verify-payment
// يتحقق من حالة الدفع الفعلية عند Moyasar (سيرفر لسيرفر بالمفتاح السري)
// قبل ما يعتمد الطلب كـ "مدفوع". هذا يمنع أي شخص من تزوير رابط الرجوع
// (?status=paid&id=xxx) وتأكيد طلب بدون ما يكون دفع فعليًا.
//
// النشر:
//   supabase functions deploy verify-payment
//   supabase secrets set MOYASAR_SECRET_KEY=sk_live_xxxxxxxx
//
// ملاحظة: SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY متوفرة تلقائيًا
// داخل بيئة Edge Functions، لا حاجة لضبطها يدويًا.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MOYASAR_SECRET_KEY = Deno.env.get('MOYASAR_SECRET_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
    if (!MOYASAR_SECRET_KEY || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'إعدادات السيرفر ناقصة (MOYASAR_SECRET_KEY أو مفاتيح Supabase)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { order_id, payment_id } = await req.json();
    if (!order_id || !payment_id) {
      return new Response(JSON.stringify({ error: 'order_id و payment_id مطلوبين' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // 1) اجلب الطلب الحقيقي من قاعدة البيانات (المبلغ والحالة) — لا نثق بأي شيء يجي من المتصفح
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, total, status, payment_method')
      .eq('id', order_id)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: 'الطلب غير موجود' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (order.status !== 'pending') {
      // الطلب مؤكّد مسبقًا أو ملغي — لا تكرر التحديث
      return new Response(JSON.stringify({ ok: order.status === 'new', status: order.status }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2) اسأل Moyasar مباشرة (سيرفر لسيرفر) عن حالة هذه العملية الفعلية
    const moyasarRes = await fetch(`https://api.moyasar.com/v1/payments/${payment_id}`, {
      headers: { Authorization: 'Basic ' + btoa(MOYASAR_SECRET_KEY + ':') },
    });
    const payment = await moyasarRes.json();

    if (!moyasarRes.ok) {
      return new Response(JSON.stringify({ error: 'تعذّر التحقق من الدفع عند مويسر', details: payment }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3) تحقق أن العملية "مدفوعة فعلًا" وأن المبلغ مطابق تمامًا لمبلغ الطلب (بالهللة)
    const expectedHalalas = Math.round(Number(order.total) * 100);
    const paidHalalas = Number(payment.amount);
    const isPaid = payment.status === 'paid';
    const amountMatches = paidHalalas === expectedHalalas;

    if (!isPaid || !amountMatches) {
      return new Response(
        JSON.stringify({ ok: false, status: payment.status, amount_matches: amountMatches }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4) كل شيء متحقق منه فعليًا — الآن فقط نحدّث حالة الطلب (بصلاحية السيرفر الكاملة)
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status: 'new', payment_method: 'card', payment_id: payment.id })
      .eq('id', order_id)
      .eq('status', 'pending');

    if (updateErr) {
      return new Response(JSON.stringify({ error: 'تم التحقق من الدفع لكن تعذّر تحديث الطلب' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, status: 'paid' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
