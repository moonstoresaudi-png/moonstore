// Supabase Edge Function: send-email
// ترسل بريدًا إلكترونيًا عبر Resend (https://resend.com) — بديل بسيط ورخيص
// لإرسال البريد بدل خدمة base44 المدمجة.
//
// النشر:
//   supabase functions deploy send-email
//   supabase secrets set RESEND_API_KEY=your_resend_api_key
//   supabase secrets set SENDER_EMAIL="Moon Store <orders@yourdomain.com>"

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') || 'onboarding@resend.dev';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { to, subject, html } = await req.json();

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY غير مُعرّف. شغّل: supabase secrets set RESEND_API_KEY=...' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: SENDER_EMAIL, to, subject, html }),
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
