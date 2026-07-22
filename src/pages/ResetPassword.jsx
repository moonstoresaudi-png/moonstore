import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import { auth } from '@/api/auth';
import { supabase } from '@/lib/supabaseClient';
import { Lock, Loader2 } from 'lucide-react';

// Supabase يرسل رابط استرجاع كلمة المرور يحتوي رمزًا في الرابط نفسه، ويُنشئ
// جلسة "recovery" تلقائيًا عند فتح الرابط — لا نحتاج قراءة أي token يدويًا.
export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    // إن كانت الجلسة موجودة أصلاً (مثلاً بعد إعادة تحميل الصفحة)
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    if (password !== confirmPassword) { setError('كلمتا المرور غير متطابقتين'); return; }
    setLoading(true);
    try {
      await auth.resetPassword({ newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('تعذّر تحديث كلمة المرور، جرّب طلب رابط جديد');
    }
    setLoading(false);
  };

  if (success) {
    return <AuthLayout title="تم التحديث بنجاح" subtitle="جاري تحويلك لصفحة تسجيل الدخول..." />;
  }

  if (!ready) {
    return (
      <AuthLayout title="رابط غير صالح" subtitle="افتح هذه الصفحة من رابط إعادة تعيين كلمة المرور المرسل إلى بريدك">
        <a href="/forgot-password" className="w-full inline-block text-center py-3.5 btn-primary">طلب رابط جديد</a>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="كلمة مرور جديدة" subtitle="أدخل كلمة المرور الجديدة لحسابك">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground/60 mb-1 block">كلمة المرور الجديدة</label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-foreground/60 mb-1 block">تأكيد كلمة المرور</label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={loading} className="w-full py-3.5 btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} تحديث كلمة المرور
        </button>
      </form>
    </AuthLayout>
  );
}
