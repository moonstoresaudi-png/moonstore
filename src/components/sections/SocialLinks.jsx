import React from 'react';
import { Instagram } from 'lucide-react';

export default function SocialLinks() {
  const socials = [
    { label: 'انستغرام', color: 'hover:bg-primary', href: 'https://www.instagram.com/eman220199?igsh=cjNhZHdzdW9naHZh&utm_source=qr', icon: 'instagram' },
    { label: 'تيك توك', color: 'hover:bg-primary', href: 'https://www.tiktok.com/@mon201920?_r=1&_t=ZS-988JTzVr0Ap', icon: 'tiktok' },
  ];
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="card-soft p-6 sm:p-8 text-center">
          <h3 className="font-heading font-bold text-lg sm:text-xl mb-1">تابعنا على وسائل التواصل</h3>
          <p className="text-sm text-foreground/55 mb-5">آخر التصاميم والعروض الحصرية</p>
          <div className="flex justify-center gap-4">
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className={`w-14 h-14 rounded-2xl border border-border bg-card flex items-center justify-center text-primary transition-all hover:text-white hover:border-transparent ${s.color}`}>
                {s.icon === 'instagram' ? (
                  <Instagram className="w-6 h-6" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}