import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, TrendingUp, Tag, Truck, ArrowRight, Lock, ShoppingCart, Settings, Plus, BarChart3, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { auth } from '@/api/auth';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminCustomers from '@/components/admin/AdminCustomers';
import AdminProfits from '@/components/admin/AdminProfits';
import AdminDiscountCodes from '@/components/admin/AdminDiscountCodes';
import AdminSuppliers from '@/components/admin/AdminSuppliers';
import AdminAbandonedCarts from '@/components/admin/AdminAbandonedCarts';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminSalesCharts from '@/components/admin/AdminSalesCharts';

const TABS = [
  { key: 'dashboard', label: 'لوحة المبيعات', icon: BarChart3 },
  { key: 'orders', label: 'الطلبات', icon: Package },
  { key: 'products', label: 'المنتجات', icon: Plus },
  { key: 'customers', label: 'العملاء', icon: Users },
  { key: 'profits', label: 'الأرباح والتكاليف', icon: TrendingUp },
  { key: 'abandoned', label: 'السلات المتروكة', icon: ShoppingCart },
  { key: 'discounts', label: 'أكواد الخصم', icon: Tag },
  { key: 'suppliers', label: 'الموردين', icon: Truck },
  { key: 'settings', label: 'الإعدادات', icon: Settings },
];

// تسجيل دخول حقيقي عبر Supabase بدل رمز PIN ثابت في الكود — رمز PIN وحده لا
// يحمي عمليات الكتابة على قاعدة البيانات (يمكن لأي شخص يفتح أدوات المطوّر
// تجاوزه)، بينما هذا يتحقق من صلاحية "admin" الفعلية عبر RLS في Supabase.
function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.loginViaEmailPassword(email, password);
      // useAuth سيُحدّث الحالة تلقائيًا بعد تسجيل الدخول عبر onAuthStateChange
    } catch {
      setError('بيانات الدخول غير صحيحة');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="card-soft p-8 w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-primary/10">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-heading font-extrabold text-xl mb-1">لوحة التحكم</h1>
        <p className="text-sm text-foreground/55 mb-5">سجّل دخولك بحساب الأدمن</p>
        <form onSubmit={handleSubmit} className="space-y-3 text-right">
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
          </div>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3.5 btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} دخول
          </button>
        </form>
        <Link to="/" className="text-xs text-foreground/50 hover:text-primary mt-4 inline-block">← العودة للمتجر</Link>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoadingAuth, authChecked, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');

  if (isLoadingAuth || !authChecked) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-extrabold text-lg">لوحة التحكم</h1>
            <p className="text-xs text-foreground/55">إدارة المتجر — الطلبات، المنتجات، الأرباح، الموردين</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={logout} className="text-sm text-foreground/60 font-medium hover:text-destructive">تسجيل الخروج</button>
            <Link to="/" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:opacity-70">عرض المتجر <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-1.5 mb-6 overflow-x-auto no-scrollbar pb-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap inline-flex items-center gap-2 transition-all ${tab === t.key ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground/60 hover:border-primary/40'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <><AdminDashboardStats /><AdminSalesCharts /></>}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'products' && <AdminProducts />}
        {tab === 'customers' && <AdminCustomers />}
        {tab === 'profits' && <AdminProfits />}
        {tab === 'abandoned' && <AdminAbandonedCarts />}
        {tab === 'discounts' && <AdminDiscountCodes />}
        {tab === 'suppliers' && <AdminSuppliers />}
        {tab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
}
