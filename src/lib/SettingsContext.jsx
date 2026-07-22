import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storeSettingsApi } from '@/api/entities';

// القيم الافتراضية تُستخدم فقط إلى أن تُحمّل الإعدادات الحقيقية من قاعدة البيانات،
// أو إن فشل التحميل (مثلاً قبل ربط Supabase). هذا يحل مشكلة تكرار رقم الجوال/
// البريد في عدة ملفات (Footer, CustomerService, GroupsOrders, AdminSettings) بشكل
// منفصل وغير مرتبط ببعضه — الآن مصدر واحد فقط.
const DEFAULTS = {
  store_name: 'Moon Store',
  phone: '966581506903',
  whatsapp: '966581506903',
  email: 'info@moonstore.sa',
  address: 'جدة - السعودية',
  cr_number: '',
  shipping_cost: 25,
  cod_fee: 10,
  instagram: '',
  twitter: '',
  snapchat: '',
  tiktok: '',
};

const SettingsContext = createContext({ settings: DEFAULTS, loading: true, refresh: () => {} });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    storeSettingsApi
      .get()
      .then((data) => setSettings({ ...DEFAULTS, ...data }))
      .catch(() => setSettings(DEFAULTS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useStoreSettings = () => useContext(SettingsContext);
