import React from 'react';
import { Users, MessageCircle, Percent, Package } from 'lucide-react';
import { useStoreSettings } from '@/lib/SettingsContext';

export default function GroupsOrders() {
  const { settings } = useStoreSettings();
  const phone = settings.whatsapp || settings.phone;
  return (
    <section className="py-12 sm:py-16 bg-secondary/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="card-soft overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-6 sm:p-10">
              <span className="chip bg-accent/40 text-primary mb-3">طلبات المجموعات</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold mb-3">للطلبات <span className="text-grad-violet">المجموعات</span></h2>
              <p className="text-foreground/60 text-sm leading-relaxed mb-5">
                تخطّط لتخرج دفعتك كاملة؟ نوفّر باقات خاصة للطلبات الجماعية بأسعار متميزة وتطريز مخصص بأسماء الخريجين. تواصل معنا عبر واتساب لعرض خاص يناسب احتياجاتك.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Users, label: 'دفعة كاملة' },
                  { icon: Percent, label: 'أسعار خاصة' },
                  { icon: Package, label: 'تغليف فاخر' },
                ].map((f, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-1.5"><f.icon className="w-5 h-5 text-primary" /></div>
                    <p className="text-xs text-foreground/60">{f.label}</p>
                  </div>
                ))}
              </div>
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors">
                <MessageCircle className="w-5 h-5" /> تواصل عبر واتساب للطلب الجماعي
              </a>
            </div>
            <div className="h-full min-h-[200px] bg-gradient-to-br from-primary/15 to-accent/30 flex items-center justify-center p-8">
              <div className="text-center">
                <Users className="w-16 h-16 text-primary mx-auto mb-3" />
                <p className="font-heading font-bold text-lg text-primary">خصومات خاصة للدفعات</p>
                <p className="text-sm text-foreground/60 mt-1">اطلب لأكثر من 10 خريجين واحصل على عرض خاص</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}