import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, MessageCircle, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { useStoreSettings } from '@/lib/SettingsContext';

const PAYMENT_LOGOS = [
  { name: 'Visa', url: '/images/brand/visa.jpg' },
  { name: 'Mastercard', url: '/images/brand/mastercard.jpg' },
  { name: 'Apple Pay', url: '/images/brand/applepay.jpg' },
  { name: 'STC Pay', url: '/images/brand/stcpay.jpg' },
];
const PAYMENT_TEXT_ONLY = ['Mada', 'Tabby'];

export default function Footer() {
  const { settings } = useStoreSettings();
  const phone = settings.whatsapp || settings.phone;

  return (
    <footer className="mt-10 relative" dir="rtl">
      {/* Curved top */}
      <div className="w-full overflow-hidden leading-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 sm:h-16 block" style={{ background: 'hsl(var(--background))' }}>
          <path d="M0,60 Q720,0 1440,60 L1440,60 L0,60 Z" fill="hsl(352 26% 73%)" />
          <path d="M0,60 Q720,0 1440,60" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <Logo dark />
              </div>
              <p className="text-sm text-background/60 leading-relaxed">متخصصون في ملابس التخرج<br/>أرواب وأوشحة وملحقات فاخرة</p>
              <div className="flex gap-3 mt-5">
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" title="انستقرام">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" title="تيك توك">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
                  </a>
                )}
              </div>
            </div>

            {/* روابط */}
            <div>
              <h4 className="font-heading font-bold mb-4 text-background">المصادر</h4>
              <ul className="space-y-2.5 text-sm text-background/60">
                <li><Link to="/policies" className="hover:text-background transition-colors">الشروط والأحكام</Link></li>
                <li><Link to="/policies" className="hover:text-background transition-colors">سياسة الشحن والتوصيل</Link></li>
                <li><Link to="/policies" className="hover:text-background transition-colors">سياسة الاستبدال والاسترجاع</Link></li>
                <li><Link to="/track-order" className="hover:text-background transition-colors">تتبع الطلب</Link></li>
                <li><Link to="/about" className="hover:text-background transition-colors">من نحن</Link></li>
              </ul>
            </div>

            {/* خدمة العملاء */}
            <div>
              <h4 className="font-heading font-bold mb-4 text-background">خدمة العملاء</h4>
              <div className="flex gap-3 mb-4">
                <a href={`tel:+${phone}`} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" title="اتصال">
                  <Phone className="w-5 h-5" />
                </a>
                <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" title="واتساب">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs text-background/50">للتواصل والشكاوي<br/>نحن هنا لخدمتك</p>
            </div>

            {/* الموثوقية */}
            <div>
              <h4 className="font-heading font-bold mb-4 text-background">الموثوقية</h4>
              <div className="flex flex-wrap gap-3 mb-4">
                <a href="/documents/commercial-registry.pdf" target="_blank" rel="noreferrer" title="شهادة السجل التجاري"
                  className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center hover:scale-105 transition-all shadow-lg" style={{ width: 100, minHeight: 100 }}>
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <span className="text-[10px] text-foreground/60 mt-1.5 text-center font-medium">السجل التجاري</span>
                </a>
                <a href="/documents/maroof-certificate.pdf" target="_blank" rel="noreferrer" title="شهادة معروف"
                  className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center hover:scale-105 transition-all shadow-lg" style={{ width: 100, minHeight: 100 }}>
                  <img src="/images/brand/maroof-badge.jpg" alt="معروف" className="w-10 h-10 object-contain" />
                  <span className="text-[10px] text-foreground/60 mt-1.5 text-center font-medium">معروف</span>
                </a>
              </div>
              {settings.cr_number && (
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <p className="text-xs text-background/50 mb-0.5">السجل التجاري</p>
                  <p className="font-bold text-base font-mono text-background" dir="ltr">{settings.cr_number}</p>
                  <p className="text-xs text-background/40 mt-0.5">{settings.store_name}</p>
                </div>
              )}
            </div>
          </div>

          <hr className="border-white/10 my-8" />

          {/* Payment methods */}
          <div className="text-center">
            <p className="text-xs text-background/40 mb-4">وسائل الدفع المتاحة</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PAYMENT_LOGOS.map(p => (
                <div key={p.name} className="h-9 px-3 rounded-lg bg-white flex items-center justify-center" style={{ minWidth: 56 }}>
                  <img src={p.url} alt={p.name} className="h-6 w-auto object-contain" />
                </div>
              ))}
              {PAYMENT_TEXT_ONLY.map(name => (
                <div key={name} className="h-9 px-3.5 rounded-lg bg-white flex items-center justify-center" style={{ minWidth: 56 }}>
                  <span className="text-[11px] font-bold text-foreground/70">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-background/35">
            <p>© {new Date().getFullYear()} {settings.store_name} — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
