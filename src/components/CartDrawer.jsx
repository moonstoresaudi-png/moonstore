import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/cartContext';

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
                    <p className="text-primary text-sm font-bold mt-0.5">{item.price} ر.س</p>
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
          <div className="px-5 py-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground/70 text-sm">الإجمالي</span>
              <span className="text-primary font-heading font-bold text-lg">{total} ر.س</span>
            </div>
            <button onClick={() => { setIsOpen(false); navigate('/checkout'); }} className="w-full py-3.5 btn-primary">إتمام الطلب</button>
          </div>
        )}
      </aside>
    </>
  );
}