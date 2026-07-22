// إرسال بريد إلكتروني (تذكير سلة متروكة). Supabase لا يوفر إرسال بريد مخصص
// جاهز من المتصفح مباشرة، لذا هذا يستدعي Edge Function باسم send-email —
// راجع supabase/functions/send-email و SETUP.md لخطوات التفعيل عبر مزوّد بريد
// مثل Resend. إن لم تُفعّلها بعد، سترجع الدالة خطأ واضح بدل فشل صامت.
import { supabase } from '@/lib/supabaseClient';

export async function sendEmail({ to, subject, body }) {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: { to, subject, html: body },
  });
  if (error) throw error;
  return data;
}
