import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, PhoneCall, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/cartContext';
import { entities } from '@/api/entities';

function SaveCartPrompt({ items, total }) {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('ms_cart_lead_dismissed') === '1');
  const [saved, setSaved] = useState(() => sessionStorage.getItem('ms_cart_lead_saved') === '1');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  if (saved) {
    return (
      <div className="mx-5 mb-3 px-4 py-3 rounded-xl bg-green-50 text-green-700 text-xs font-medium flex items-center gap-2">
        <Check className="w-4 h-4" /> حفظنا سلتك، بنتواصل معك لو احتجت مساعدة 🌙
      </div>
    );
  }
  if (dismissed) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (phone.trim().length < 8) return;
    setSaving(true);
    try {
      await entities.CartLead.create({
        phone: phone.trim(),
        cart_summary: items.map(i => `${i.name} ×${i.qty}`).join('، '),
        cart_total: total,
      });
      sessionStorage.setItem('ms_cart_lead_saved', '1');
      setSaved(true);
    } catch { /* ما نزعج العميل برسالة خطأ على شي اختياري */ }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="mx-5 mb-3 p-3.5 rounded-xl bg-secondary/50 border border-border">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-bold text-foreground/80 flex items-center gap-1.5"><PhoneCall className="w-3.5 h-3.5 text-primary" /> احفظ سلتك؟</p>
        <button type="button" onClick={() => { sessionStorage.setItem('ms_cart_lead_dismissed', '1'); setDismissed(true); }} className="text-foreground/30 hover:text-foreground/60"><X className="w-3.5 h-3.5" /></button>
      </div>
      <p className="text-[11px] text-foreground/50 mb-2">اختياري — خلّي جوالك عشان نذكّرك لو ما كملت الطلب</p>
      <div className="flex gap-1.5">
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="05xxxxxxxx" dir="ltr" className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-xs focus:border-primary focus:outline-none" />
        <button type="submit" disabled={saving} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold disabled:opacity-50">{saving ? '...' : 'حفظ'}</button>
      </div>
    </form>
  );
}

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div onClick={() => setIsOpen(false)} className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <aside className={`fixed top-0 bottom-0 left-0 z-[70] w-full sm:w-[400px] bg-card border-l border-border shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <h3 className="font-heading font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> سلة التسوق</h3>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-secondary"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-20">
              <ShoppingBag className="w-12 h-12 text-foreground/20" />
              <p className="text-foreground/50">سلتك فارغة</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item.id} className="card-soft p-3 flex gap-3">
                  <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-primary text-sm font-bold mt-0.5">{item.price} </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg border border-border flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg border border-border flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                      <button onClick={() => removeItem(item.id)} className="mr-auto text-destructive/70 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <>
            <SaveCartPrompt items={items} total={total} />
            <div className="px-5 py-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground/70 text-sm">الإجمالي</span>
              <span className="text-primary font-heading font-bold text-lg">{total} </span>
            </div>
            <button onClick={() => { setIsOpen(false); navigate('/checkout'); }} className="w-full py-3.5 btn-primary">إتمام الطلب</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}