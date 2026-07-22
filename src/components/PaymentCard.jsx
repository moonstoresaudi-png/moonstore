import React, { useState } from 'react';
import { Lock, CreditCard, ShieldCheck } from 'lucide-react';

export default function PaymentCard({ onPaid }) {
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [processing, setProcessing] = useState(false);

  const formatNum = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
  const formatExp = (v) => { const c = v.replace(/\D/g, '').slice(0, 4); return c.length > 2 ? `${c.slice(0, 2)}/${c.slice(2)}` : c; };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardNum || !cardName || !expiry || !cvv) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (onPaid) onPaid({ last4: cardNum.slice(-4), name: cardName });
    }, 2000);
  };

  return (
    <div className="space-y-5">
      {/* Card Preview */}
      <div style={{ perspective: '1000px', height: '200px' }}>
        <div className="relative w-full h-full transition-transform duration-700" style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          {/* Front */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet via-primary to-primary p-5 sm:p-6 shadow-xl" style={{ backfaceVisibility: 'hidden' }}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-7 rounded-md bg-amber-300/80" />
              <CreditCard className="w-7 h-7 text-white/80" />
            </div>
            <div className="mt-5 font-mono text-white text-base sm:text-lg tracking-widest">{cardNum || '•••• •••• •••• ••••'}</div>
            <div className="mt-4 flex items-end justify-between">
              <div className="min-w-0"><p className="text-[9px] text-white/60 uppercase">حامل البطاقة</p><p className="text-white text-sm font-medium truncate">{cardName || 'الاسم الكامل'}</p></div>
              <div><p className="text-[9px] text-white/60 uppercase">الانتهاء</p><p className="text-white text-sm font-mono">{expiry || 'MM/YY'}</p></div>
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet via-primary to-primary p-5 shadow-xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="w-full h-9 bg-black/40 mt-2" />
            <div className="mt-5"><p className="text-[9px] text-white/60 mb-1">رمز التحقق (CVV)</p><div className="h-8 bg-white/20 rounded flex items-center px-3"><span className="font-mono text-white">{cvv || '•••'}</span></div></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-foreground/60 mb-1 block">رقم البطاقة</label>
          <input value={cardNum} onChange={e => setCardNum(formatNum(e.target.value))} maxLength={19} placeholder="1234 5678 9012 3456" inputMode="numeric" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground/60 mb-1 block">اسم حامل البطاقة</label>
          <input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} placeholder="الاسم كما يظهر على البطاقة" className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-foreground/60 mb-1 block">تاريخ الانتهاء</label>
            <input value={expiry} onChange={e => setExpiry(formatExp(e.target.value))} maxLength={5} placeholder="MM/YY" inputMode="numeric" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60 mb-1 block">CVV</label>
            <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)} maxLength={4} placeholder="•••" inputMode="numeric" className="w-full px-4 py-3 rounded-xl border border-border bg-card font-mono focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/50 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
          <span>محمي بتشفير SSL 256-bit — لا نخزّن بيانات بطاقتك</span>
        </div>
        <button type="submit" disabled={processing} className="w-full py-3.5 btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50">
          {processing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري المعالجة الآمنة...</> : <><Lock className="w-4 h-4" /> دفع آمن</>}
        </button>
      </form>
    </div>
  );
}