import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cartContext';
import { entities, validateDiscountCode } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { useStoreSettings } from '@/lib/SettingsContext';
import PaymentCard from '@/components/PaymentCard';
import { Truck, CreditCard, Banknote, Lock, Check, ShoppingBag, ArrowLeft, ShieldCheck, Tag, X } from 'lucide-react';

const COUNTRIES = ['السعودية', 'الإمارات', 'الكويت', 'البحرين', 'قطر', 'سلطنة عمان'];

export default function Checkout() {
  const { items, total, setIsOpen } = useCart();
  const { user } = useAuth();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: '', phone: '', email: '', country: 'السعودية', city: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [discount, setDiscount] = useState(null); // { code, discount_percent }
  const [discountError, setDiscountError] = useState('');
  const [checkingDiscount, setCheckingDiscount] = useState(false);

  const shippingCost = settings.shipping_cost;
  const codFee = paymentMethod === 'cod' ? settings.cod_fee : 0;
  const discountAmount = discount ? Math.round((total * discount.discount_percent) / 100) : 0;
  const grandTotal = Math.max(0, total - discountAmount) + shippingCost + codFee;

  const generateOrderNum = () => `MS-${Date.now().toString().slice(-8)}`;

  const applyDiscount = async () => {
    if (!discountInput.trim()) return;
    setCheckingDiscount(true);
    setDiscountError('');
    try {
      const result = await validateDiscountCode(discountInput.trim());
      if (result) {
        setDiscount(result);
      } else {
        setDiscount(null);
        setDiscountError('كود الخصم غير صالح أو منتهي');
      }
    } catch {
      setDiscountError('تعذّر التحقق من الكود، حاول لاحقًا');
    }
    setCheckingDiscount(false);
  };

  const createOrder = (status = 'new') => {
    const orderNum = orderNumber || generateOrderNum();
    if (!orderNumber) setOrderNumber(orderNum);
    return entities.Order.create({
      user_id: user?.id || null,
      order_number: orderNum,
      customer_name: form.customer_name,
      phone: form.phone,
      email: form.email,
      city: form.city,
      address: form.address,
      country: form.country,
      product_name: items.map(i => i.name).join(', '),
      quantity: items.reduce((s, i) => s + i.qty, 0),
      total: grandTotal,
      cost: items.reduce((s, i) => s + (i.cost || 0) * i.qty, 0),
      status,
      payment_method: paymentMethod,
      tracking_stage: 'placed',
      discount_code: discount?.code || null,
      discount_amount: discountAmount,
      notes: form.notes,
      sash_config: items.map(i => i.sash_config).filter(Boolean).join(' | '),
    });
  };

  const handleCardPaid = async () => {
    setSubmitting(true);
    try {
      const order = await createOrder('new');
      setOrderId(order.id);
      setStep(3);
      setIsOpen(false);
    } catch {}
    setSubmitting(false);
  };

  const handleCodSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const order = await createOrder('new');
      setOrderId(order.id);
      setStep(3);
      setIsOpen(false);
    } catch {}
    setSubmitting(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    // نحفظه كـ "pending" مؤقتًا لتتبع السلات المتروكة إن لم يكمل الدفع
    createOrder('pending').catch(() => {});
  };

  if (step === 3) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"><Check className="w-10 h-10 text-green-600" /></div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold mb-2">تم استلام طلبك بنجاح!</h1>
          <p className="text-foreground/60 mb-5">سنتواصل معك قريبًا لتأكيد التوصيل</p>
          <div className="card-soft p-5 mb-6 inline-block">
            <p className="text-xs text-foreground/55">رقم الطلب</p>
            <p className="font-heading font-bold text-xl text-primary">#{orderNumber || orderId?.slice(-6) || '---'}</p>
            <p className="text-xs text-foreground/55 mt-2">طريقة الدفع: {paymentMethod === 'card' ? 'بطاقة' : 'الدفع عند الاستلام'}</p>
            <p className="text-sm font-bold text-primary mt-1">الإجمالي: {grandTotal} ر.س</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/track-order" className="px-6 py-3 btn-primary">تتبع الطلب</Link>
            <Link to="/" className="px-6 py-3 rounded-full border border-border font-medium hover:bg-secondary">الرئيسية</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
          <h1 className="font-heading text-xl font-bold mb-2">سلتك فارغة</h1>
          <p className="text-foreground/60 mb-5">أضف منتجات إلى السلة قبل إتمام الطلب</p>
          <Link to="/" className="px-6 py-3 btn-primary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> متابعة التسوق</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-6">
          <Link to="/" className="hover:text-primary">الرئيسية</Link>
          <ArrowLeft className="w-4 h-4" />
          <span className="text-foreground/70">إتمام الطلب</span>
        </nav>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['بيانات الشحن', 'الدفع', 'تأكيد'].map((label, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-2 ${step >= i + 1 ? 'text-primary' : 'text-foreground/40'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= i + 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>{i + 1}</div>
                <span className="text-xs sm:text-sm font-medium hidden sm:block">{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px ${step > i + 1 ? 'bg-primary' : 'bg-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <form onSubmit={handleFormSubmit} className="card-soft p-5 sm:p-6 space-y-4">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> بيانات الشحن</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-foreground/60 mb-1 block">الاسم الكامل *</label><input required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" /></div>
                  <div><label className="text-xs font-medium text-foreground/60 mb-1 block">رقم الجوال *</label><input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="05xxxxxxxx" className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" /></div>
                  <div><label className="text-xs font-medium text-foreground/60 mb-1 block">البريد الإلكتروني</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" /></div>
                  <div><label className="text-xs font-medium text-foreground/60 mb-1 block">الدولة *</label><select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none">{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div><label className="text-xs font-medium text-foreground/60 mb-1 block">المدينة *</label><input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" /></div>
                  <div><label className="text-xs font-medium text-foreground/60 mb-1 block">العنوان التفصيلي *</label><input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" /></div>
                </div>
                <div><label className="text-xs font-medium text-foreground/60 mb-1 block">ملاحظات (اختياري)</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" /></div>

                {/* Discount code */}
                <div>
                  <label className="text-xs font-medium text-foreground/60 mb-1 block">كود الخصم (اختياري)</label>
                  {discount ? (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                      <span className="text-sm font-bold text-green-700 flex items-center gap-1.5"><Tag className="w-4 h-4" /> {discount.code} — خصم {discount.discount_percent}%</span>
                      <button type="button" onClick={() => { setDiscount(null); setDiscountInput(''); }} className="text-green-700 hover:text-green-900"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={discountInput} onChange={e => setDiscountInput(e.target.value)} placeholder="أدخل كود الخصم" className="flex-1 px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" dir="ltr" />
                      <button type="button" onClick={applyDiscount} disabled={checkingDiscount} className="px-4 py-3 rounded-xl border border-border font-medium text-sm hover:bg-secondary disabled:opacity-50">{checkingDiscount ? '...' : 'تطبيق'}</button>
                    </div>
                  )}
                  {discountError && <p className="text-xs text-destructive mt-1.5">{discountError}</p>}
                </div>

                <button type="submit" className="w-full py-3.5 btn-primary">متابعة للدفع</button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="card-soft p-5 sm:p-6">
                  <h2 className="font-heading font-bold text-lg mb-4">طريقة الدفع</h2>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button onClick={() => setPaymentMethod('card')} className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <CreditCard className={`w-7 h-7 mx-auto mb-1.5 ${paymentMethod === 'card' ? 'text-primary' : 'text-foreground/50'}`} />
                      <p className="text-sm font-bold">بطاقة ائتمان</p>
                      <p className="text-xs text-foreground/50">فيزا • مدى • آبل باي</p>
                    </button>
                    <button onClick={() => setPaymentMethod('cod')} className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <Banknote className={`w-7 h-7 mx-auto mb-1.5 ${paymentMethod === 'cod' ? 'text-primary' : 'text-foreground/50'}`} />
                      <p className="text-sm font-bold">الدفع عند الاستلام</p>
                      <p className="text-xs text-foreground/50">+{settings.cod_fee} ر.س رسوم</p>
                    </button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <PaymentCard onPaid={handleCardPaid} />
                  ) : (
                    <form onSubmit={handleCodSubmit}>
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
                        <p className="text-sm text-amber-800">سيتم تحصيل مبلغ <span className="font-bold">{grandTotal} ر.س</span> عند استلام الطلب، بما يشمل رسوم الدفع عند الاستلام ({settings.cod_fee} ر.س).</p>
                      </div>
                      <button type="submit" disabled={submitting} className="w-full py-3.5 btn-primary disabled:opacity-50">تأكيد الطلب — {grandTotal} ر.س</button>
                    </form>
                  )}
                </div>
                <button onClick={() => setStep(1)} className="text-sm text-foreground/60 hover:text-primary inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> رجوع للشحن</button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-soft p-5 sticky top-24">
              <h3 className="font-heading font-bold mb-4">ملخص الطلب</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto no-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">{item.qty}×</div>
                    <div className="flex-1 min-w-0"><p className="truncate font-medium">{item.name}</p>{item.size && <p className="text-xs text-foreground/50">المقاس: {item.size}</p>}</div>
                    <p className="font-bold text-primary">{item.price * item.qty} ر.س</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-border text-sm">
                <div className="flex justify-between"><span className="text-foreground/60">المجموع الفرعي</span><span className="font-medium">{total} ر.س</span></div>
                {discount && <div className="flex justify-between text-green-700"><span>خصم ({discount.code})</span><span className="font-medium">-{discountAmount} ر.س</span></div>}
                <div className="flex justify-between"><span className="text-foreground/60">الشحن</span><span className="font-medium">{shippingCost} ر.س</span></div>
                {codFee > 0 && <div className="flex justify-between"><span className="text-foreground/60">رسم الدفع عند الاستلام</span><span className="font-medium">{codFee} ر.س</span></div>}
                <div className="flex justify-between pt-2 border-t border-border"><span className="font-bold">الإجمالي</span><span className="font-heading font-extrabold text-lg text-primary">{grandTotal} ر.س</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-foreground/50">
                <ShieldCheck className="w-4 h-4 text-green-600" /> طلبك محمي ومؤمّن
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
