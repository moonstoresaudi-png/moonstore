import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import GoogleIcon from '@/components/GoogleIcon';
import { auth } from '@/api/auth';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.loginViaEmailPassword(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      title="تسجيل الدخول"
      subtitle="سجّل دخولك لمتابعة طلباتك"
      footer={<span>ليس لديك حساب؟ <Link to="/register" className="text-primary font-medium hover:underline">إنشاء حساب</Link></span>}
    >
      <button
        onClick={() => auth.loginWithProvider('google', '/account')}
        className="w-full py-3 rounded-xl border border-border font-medium text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-colors mb-5"
      >
        <GoogleIcon className="w-4 h-4" /> الدخول عبر Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-foreground/40">أو</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground/60 mb-1 block">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-foreground/60">كلمة المرور</label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">نسيت كلمة المرور؟</Link>
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={loading} className="w-full py-3.5 btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} تسجيل الدخول
        </button>
      </form>
    </AuthLayout>
  );
}
