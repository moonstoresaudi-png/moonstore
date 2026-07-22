import React from 'react';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { useStoreSettings } from '@/lib/SettingsContext';

export default function CustomerService() {
  const { settings } = useStoreSettings();
  const phone = settings.whatsapp || settings.phone;

  const items = [
    { icon: Phone, label: 'اتصال', sub: `+${settings.phone}`, href: `tel:+${settings.phone}`, color: 'bg-green-500' },
    { icon: MessageCircle, label: 'واتساب', sub: 'تواصل مباشر', href: `https://wa.me/${phone}`, color: 'bg-green-600' },
    { icon: Mail, label: 'بريد', sub: 'خدمة العملاء', href: `mailto:${settings.email}`, color: 'bg-primary' },
  ];
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">خدمة <span className="text-grad-violet">العملاء</span></h2>
          <p className="text-foreground/60 text-sm mt-2">نحن هنا لخدمتك — تواصل معنا في أي وقت</p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl mx-auto">
          {items.map((item, i) => (
            <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="card-soft p-4 sm:p-6 flex flex-col items-center text-center group hover:shadow-lg transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <p className="font-bold text-sm sm:text-base">{item.label}</p>
              <p className="text-xs text-foreground/55 mt-0.5" dir="ltr">{item.sub}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
