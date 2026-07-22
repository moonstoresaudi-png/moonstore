import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import { auth } from '@/api/auth';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.resetPasswordRequest(email);
      setSent(true);
    } catch {
      setError('تعذّر إرسال الرابط، تحقق من البريد الإلكتروني');
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <AuthLayout title="تحقق من بريدك">
        <div className="text-center py-4">
          <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-3" />
          <p className="text-sm text-foreground/60 mb-6">أرسلنا رابط إعادة تعيين كلمة المرور إلى <span className="font-medium text-foreground">{email}</span></p>
          <Link to="/login" className="w-full inline-block text-center py-3.5 btn-primary">العودة لتسجيل الدخول</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="نسيت كلمة المرور؟"
      subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين"
      footer={<span>تذكرت كلمة المرور؟ <Link to="/login" className="text-primary font-medium hover:underline">تسجيل الدخول</Link></span>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground/60 mb-1 block">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={loading} className="w-full py-3.5 btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} إرسال رابط إعادة التعيين
        </button>
      </form>
    </AuthLayout>
  );
}
