import React from 'react';
import { useStoreSettings } from '@/lib/SettingsContext';

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.34.68 4.52 1.86 6.36L4 29l7.86-1.8A11.94 11.94 0 0 0 16 27c6.63 0 12-5.37 12-12S22.63 3 16 3Zm.004 21.6c-1.86 0-3.62-.5-5.14-1.38l-.37-.22-4.66 1.07 1.1-4.54-.24-.38A9.55 9.55 0 0 1 5.4 15c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6Zm5.24-7.16c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.14-1.2-.44-2.29-1.4-.85-.75-1.42-1.68-1.59-1.97-.17-.29-.02-.44.13-.59.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.39s1.03 2.77 1.17 2.96c.14.19 2.02 3.08 4.89 4.32.68.29 1.22.47 1.63.6.68.22 1.31.19 1.8.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33Z" />
    </svg>
  );
}

// زر واتساب عائم يظهر بكل صفحات الموقع
export default function WhatsAppFloat() {
  const { settings } = useStoreSettings();
  const number = settings.whatsapp;
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-5 left-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
    >
      <WhatsAppIcon className="w-7 h-7" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </a>
  );
}
