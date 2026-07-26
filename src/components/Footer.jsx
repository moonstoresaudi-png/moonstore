import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Smartphone, MessageCircle } from 'lucide-react';
import Logo from './Logo';
import { useStoreSettings } from '@/lib/SettingsContext';

const PAYMENT_LOGOS = [
  { name: 'Visa', url: '/images/brand/visa.jpg' },
  { name: 'Mastercard', url: '/images/brand/mastercard.jpg' },
  { name: 'Mada', url: '/images/brand/mada.png' },
  { name: 'Apple Pay', url: '/images/brand/applepay.jpg' },
  { name: 'STC Pay', url: '/images/brand/stcpay.webp' },
  { name: 'Tabby', url: '/images/brand/tabby.webp' },
];

function SocialIcon({ href, title, children }) {
  const active = !!href;
  return (
    <a
      href={active ? href : undefined}
      target={active ? '_blank' : undefined}
      rel="noreferrer"
      title={title}
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-white/10 hover:bg-primary cursor-pointer' : 'bg-white/5 opacity-30 cursor-default'}`}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const { settings } = useStoreSettings();
  const phone = settings.whatsapp || settings.phone;

  return (
    <footer className="mt-10 relative" dir="rtl">
      {/* Curved top */}
      <div className="w-full overflow-hidden leading-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 sm:h-16 block" style={{ background: 'hsl(var(--background))' }}>
          <path d="M0,60 Q720,0 1440,60 L1440,60 L0,60 Z" fill="hsl(30 25% 97%)" />
          <path d="M0,60 Q720,0 1440,60" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8 text-center">
          {/* اللوجو والوصف */}
          <div className="flex flex-col items-center mb-6">
            <Logo dark size="h-32 sm:h-40" className="mb-4" />
            <p className="text-sm text-background/60 leading-relaxed">
              متجر Moon Store لأرواب وملحقات التخرج الفاخرة<br/>
              زي موحد — أرواب تخرج — جاكيت سينيور
            </p>
          </div>

          {/* أيقونات التواصل */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            <SocialIcon href={settings.tiktok} title="تيك توك">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
            </SocialIcon>
            <SocialIcon href={settings.instagram} title="انستقرام"><Instagram className="w-5 h-5" /></SocialIcon>
          </div>

          <hr className="border-white/10 mb-8" />

          {/* روابط تهمك */}
          <h4 className="font-heading font-bold mb-4 text-background">روابط تهمك</h4>
          <ul className="space-y-2.5 text-sm text-background/60 mb-8">
            <li><Link to="/policies" className="hover:text-background transition-colors">الأسئلة الشائعة لطلبات التخرج</Link></li>
            <li><Link to="/policies" className="hover:text-background transition-colors">سياسة الطلب من المتجر</Link></li>
            <li><Link to="/policies" className="hover:text-background transition-colors">سياسة الاسترجاع والاستبدال</Link></li>
            <li><Link to="/track-order" className="hover:text-background transition-colors">تتبع الطلب</Link></li>
            <li><Link to="/about" className="hover:text-background transition-colors">من نحن</Link></li>
          </ul>

          {/* خدمة العملاء */}
          <h4 className="font-heading font-bold mb-4 text-background">خدمة العملاء</h4>
          <div className="flex justify-center gap-3 mb-8">
            <a href={`tel:+${phone}`} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" title="اتصال">
              <Phone className="w-5 h-5" />
            </a>
            <a href={`tel:+${phone}`} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" title="جوال">
              <Smartphone className="w-5 h-5" />
            </a>
            <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" title="واتساب">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* الموثوقية */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            <a href="/documents/commercial-registry.pdf" target="_blank" rel="noreferrer" title="شهادة السجل التجاري"
              className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
              <img src="/images/brand/cr-emblem.png" alt="السجل التجاري" className="w-12 h-12 object-contain" />
              <span className="text-[10px] text-background/50 font-medium">السجل التجاري</span>
            </a>
            <a href="/documents/maroof-certificate.pdf" target="_blank" rel="noreferrer" title="شهادة معروف"
              className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
              <img src="/images/brand/maroof-badge.png" alt="معروف" className="w-12 h-12 object-contain" />
              <span className="text-[10px] text-background/50 font-medium">معروف</span>
            </a>
          </div>
          {settings.cr_number && (
            <p className="text-xs text-background/50 mb-8" dir="ltr">السجل التجاري: {settings.cr_number}</p>
          )}

          <hr className="border-white/10 mb-8" />

          {/* Payment methods */}
          <p className="text-xs text-background/40 mb-4">وسائل الدفع المتاحة</p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {PAYMENT_LOGOS.map(p => (
              <div key={p.name} className="h-9 px-3 rounded-lg bg-white flex items-center justify-center" style={{ minWidth: 56 }}>
                <img src={p.url} alt={p.name} className="h-6 w-auto object-contain" />
              </div>
            ))}
          </div>

          <p className="text-xs text-background/35">© {new Date().getFullYear()} {settings.store_name} — جميع الحقوق محفوظة</p>
        </div>
      </div>

      {/* زر واتساب عائم */}
      <a
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 left-5 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
        title="راسلنا واتساب"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.43-4.4-1.19l-.32-.19-3.13.82.83-3.05-.2-.32A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.4-5.9c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.4-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z"/></svg>
      </a>
    </footer>
  );
}
