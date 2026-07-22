import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import GoogleIcon from '@/components/GoogleIcon';
import { auth } from '@/api/auth';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    try {
      const { data } = await auth.register({ email, password, full_name: fullName });
      if (data.session) {
        navigate('/account', { replace: true });
      } else {
        setDone(true);
      }
    } catch (err) {
      setError(err?.message?.includes('already') ? 'هذا البريد مسجّل مسبقًا' : 'تعذّر إنشاء الحساب، حاول مرة أخرى');
    }
    setLoading(false);
  };

  if (done) {
    return (
      <AuthLayout title="تحقق من بريدك" subtitle="أرسلنا رابط تفعيل إلى بريدك الإلكتروني — افتحه لإكمال إنشاء الحساب.">
        <Link to="/login" className="w-full inline-block text-center py-3.5 btn-primary">العودة لتسجيل الدخول</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="إنشاء حساب"
      subtitle="أنشئ حسابك لتتابع طلباتك بسهولة"
      footer={<span>لديك حساب بالفعل؟ <Link to="/login" className="text-primary font-medium hover:underline">تسجيل الدخول</Link></span>}
    >
      <button
        onClick={() => auth.loginWithProvider('google', '/account')}
        className="w-full py-3 rounded-xl border border-border font-medium text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-colors mb-5"
      >
        <GoogleIcon className="w-4 h-4" /> التسجيل عبر Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-foreground/40">أو</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground/60 mb-1 block">الاسم الكامل</label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-foreground/60 mb-1 block">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-foreground/60 mb-1 block">كلمة المرور</label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={loading} className="w-full py-3.5 btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} إنشاء الحساب
        </button>
      </form>
    </AuthLayout>
  );
}
