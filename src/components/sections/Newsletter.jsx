import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e) => { e.preventDefault(); if (email) { setDone(true); setEmail(''); setTimeout(() => setDone(false), 3000); } };

  return (
    <section className="pb-16 sm:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[40px] p-8 sm:p-14 text-center" style={{ background: 'linear-gradient(135deg, hsl(310 34% 28%), hsl(310 40% 18%))' }}>
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pink/10 blur-3xl rounded-full" />
          <div className="relative text-white">
            <p className="kicker justify-center mb-4" style={{ color: 'hsl(40 60% 78%)' }}>Stay Updated</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">ابقَ على اطلاع</h2>
            <p className="text-white/70 mb-6 text-sm max-w-md mx-auto">اشترك ليصلك كل جديد عن المجموعات والعروض الحصرية قبل الجميع.</p>
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="بريدك الإلكتروني" required className="flex-1 px-5 py-3 rounded-full bg-white/15 border border-white/25 text-white placeholder:text-white/50 focus:bg-white/25 focus:outline-none text-sm" />
              <button type="submit" className="px-6 py-3 rounded-full bg-white text-primary font-bold text-sm hover:bg-white/90 inline-flex items-center justify-center gap-2"><Send className="w-4 h-4" /> اشتراك</button>
            </form>
            {done && <p className="text-white text-sm mt-3 animate-fade-up">تم الاشتراك بنجاح 🎉</p>}
          </div>
        </div>
      </div>
    </section>
  );
}