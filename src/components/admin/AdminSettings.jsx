import React, { useState, useEffect } from 'react';
import { Settings, Save, Store, Truck, Loader2 } from 'lucide-react';
import { useStoreSettings } from '@/lib/SettingsContext';
import { storeSettingsApi } from '@/api/entities';

export default function AdminSettings() {
  const { settings, refresh } = useStoreSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await storeSettingsApi.update(form);
      refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('تعذّر حفظ الإعدادات — تأكد أن جدول store_settings موجود في Supabase');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl">
      <h3 className="font-bold flex items-center gap-2 mb-5"><Settings className="w-5 h-5 text-primary" /> إعدادات المتجر</h3>
      <p className="text-xs text-foreground/50 mb-4">هذه الإعدادات تظهر مباشرة في تذييل الموقع وأزرار التواصل — تُحفظ في قاعدة البيانات وتنعكس على كل زوار الموقع فورًا.</p>
      <form onSubmit={handleSave} className="card-soft p-5 sm:p-6 space-y-5">
        <div>
          <h4 className="font-bold text-sm flex items-center gap-2 mb-3"><Store className="w-4 h-4 text-primary" /> معلومات المتجر</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-xs text-foreground/55 mb-1 block">اسم المتجر</label><input value={form.store_name} onChange={e => setForm({ ...form, store_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" /></div>
            <div><label className="text-xs text-foreground/55 mb-1 block">السجل التجاري</label><input value={form.cr_number} onChange={e => setForm({ ...form, cr_number: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" /></div>
            <div><label className="text-xs text-foreground/55 mb-1 block">رقم الجوال</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" dir="ltr" /></div>
            <div><label className="text-xs text-foreground/55 mb-1 block">واتساب (بدون +)</label><input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" dir="ltr" /></div>
            <div><label className="text-xs text-foreground/55 mb-1 block">البريد الإلكتروني</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" dir="ltr" /></div>
            <div><label className="text-xs text-foreground/55 mb-1 block">العنوان</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" /></div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm flex items-center gap-2 mb-3"><Truck className="w-4 h-4 text-primary" /> الشحن والدفع</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-xs text-foreground/55 mb-1 block">سعر الشحن (ر.س)</label><input type="number" value={form.shipping_cost} onChange={e => setForm({ ...form, shipping_cost: +e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" /></div>
            <div><label className="text-xs text-foreground/55 mb-1 block">رسوم الدفع عند الاستلام (ر.س)</label><input type="number" value={form.cod_fee} onChange={e => setForm({ ...form, cod_fee: +e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" /></div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm flex items-center gap-2 mb-3">روابط التواصل الاجتماعي</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="رابط انستغرام" className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" dir="ltr" />
            <input value={form.twitter} onChange={e => setForm({ ...form, twitter: e.target.value })} placeholder="رابط إكس / تويتر" className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" dir="ltr" />
            <input value={form.snapchat} onChange={e => setForm({ ...form, snapchat: e.target.value })} placeholder="رابط سناب شات" className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" dir="ltr" />
            <input value={form.tiktok} onChange={e => setForm({ ...form, tiktok: e.target.value })} placeholder="رابط تيك توك" className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/40 text-sm focus:border-primary focus:outline-none" dir="ltr" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="px-6 py-3 btn-primary inline-flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} حفظ الإعدادات
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">✓ تم الحفظ وتحديث الموقع بالكامل</span>}
        </div>
      </form>
    </div>
  );
}
