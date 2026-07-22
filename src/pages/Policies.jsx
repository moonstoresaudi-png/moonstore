import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Truck, RotateCcw, Clock, MapPin, Package, ShieldCheck } from 'lucide-react';

export default function Policies() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-12">
          <span className="chip bg-accent/40 text-primary mb-3">سياسات المتجر</span>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold">التوصيل <span className="text-grad-violet">والإرجاع</span></h1>
        </div>

        {/* Delivery Policy */}
        <div className="card-soft p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Truck className="w-6 h-6 text-primary" /></div>
            <h2 className="font-heading font-bold text-xl">سياسة التوصيل</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex gap-3 p-4 rounded-xl bg-secondary/40">
              <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div><p className="font-bold text-sm mb-1">مدة التجهيز</p><p className="text-xs text-foreground/60">1-3 أيام عمل لتجهيز الطلب قبل الشحن</p></div>
            </div>
            <div className="flex gap-3 p-4 rounded-xl bg-secondary/40">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div><p className="font-bold text-sm mb-1">مناطق التوصيل</p><p className="text-xs text-foreground/60">جميع مناطق المملكة العربية السعودية</p></div>
            </div>
          </div>

          <h3 className="font-bold text-sm mb-3">رسوم ومدة الشحن:</h3>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead><tr className="bg-secondary/50 text-right"><th className="p-3 font-medium">المنطقة</th><th className="p-3 font-medium">المدة</th><th className="p-3 font-medium">الرسوم</th></tr></thead>
              <tbody className="divide-y divide-border">
                <tr><td className="p-3">الرياض، جدة، الدمام</td><td className="p-3">2-3 أيام</td><td className="p-3 font-bold text-primary">25 ر.س</td></tr>
                <tr><td className="p-3">باقي المدن الرئيسية</td><td className="p-3">3-5 أيام</td><td className="p-3 font-bold text-primary">30 ر.س</td></tr>
                <tr><td className="p-3">المناطق النائية</td><td className="p-3">5-7 أيام</td><td className="p-3 font-bold text-primary">40 ر.س</td></tr>
                <tr className="bg-green-50/50"><td className="p-3 font-medium">شحن مجاني</td><td className="p-3">—</td><td className="p-3 font-bold text-green-600">للطلبات فوق 400 ر.س</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-foreground/50 mt-3">* الطلبات المخصصة (مع تطريز اسم) قد تحتاج يومين إضافيين للتجهيز.</p>
        </div>

        {/* Return Policy */}
        <div className="card-soft p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><RotateCcw className="w-6 h-6 text-primary" /></div>
            <h2 className="font-heading font-bold text-xl">سياسة الإرجاع والاستبدال</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <div><p className="font-bold text-sm mb-1">مدة الإرجاع</p><p className="text-sm text-foreground/60">يمكن إرجاع المنتج خلال 7 أيام من تاريخ الاستلام، بشرط أن يكون بحالته الأصلية وغير مستخدم.</p></div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <div><p className="font-bold text-sm mb-1">المنتجات غير القابلة للإرجاع</p><p className="text-sm text-foreground/60">المنتجات المطرزة بأسماء مخصصة والوشاح المصمم شخصيًا لا يمكن إرجاعها إلا في حال وجود عيب مصنعي.</p></div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <div><p className="font-bold text-sm mb-1">طريقة الإرجاع</p><p className="text-sm text-foreground/60">تواصل معنا عبر واتساب برقم الطلب، وسنرسل مندوب الشحن لاستلام المنتج. تُخصم رسوم شحن الإرجاع (15 ر.س) من المبلغ المسترد.</p></div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <div><p className="font-bold text-sm mb-1">المبلغ المسترد</p><p className="text-sm text-foreground/60">يُعاد المبلغ خلال 5-7 أيام عمل بنفس وسيلة الدفع الأصلية.</p></div>
            </div>
          </div>
        </div>

        {/* Quality Guarantee */}
        <div className="card-soft p-6 sm:p-8 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-primary" /></div>
            <h2 className="font-heading font-bold text-xl">ضمان الجودة</h2>
          </div>
          <p className="text-sm text-foreground/60 leading-relaxed">نضمن لك جودة جميع منتجاتنا. في حال وصول منتج بعيب مصنعي أو تالف، يُستبدل مجانًا خلال 14 يومًا من الاستلام. تواصل معنا فورًا مع صورة للمنتج.</p>
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-foreground/50 mb-3">لديك استفسار حول الطلبات؟</p>
          <a href="/track-order" className="inline-flex items-center gap-2 px-6 py-3 btn-primary"><Package className="w-4 h-4" /> تتبع طلبك</a>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}