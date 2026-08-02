-- ============================================================================
-- "احفظ سلتك": عميل حاط منتجات بالسلة بس ما بدأ الدفع أصلاً — نطلب جواله
-- بشكل اختياري وغير مزعج عشان نقدر نتابع معه لاحقًا (واتساب)، حتى لو ما
-- سجّل أي طلب فعلي. هذا جدول منفصل عن orders لأنه ما فيه بيانات شحن/دفع.
-- ============================================================================
create table if not exists public.cart_leads (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  cart_summary text,
  cart_total numeric not null default 0,
  contacted boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.cart_leads enable row level security;

-- أي زائر يقدر يحفظ سلته (بدون تسجيل دخول)
create policy "cart_leads_insert_anyone" on public.cart_leads
  for insert with check (char_length(phone) between 6 and 20);

-- الأدمن فقط يشوف/يعدّل/يحذف
create policy "cart_leads_select_admin" on public.cart_leads
  for select using (public.is_admin());
create policy "cart_leads_update_admin" on public.cart_leads
  for update using (public.is_admin()) with check (public.is_admin());
create policy "cart_leads_delete_admin" on public.cart_leads
  for delete using (public.is_admin());

create index if not exists cart_leads_created_at_idx on public.cart_leads(created_at desc);
