-- ============================================================================
-- نظام تقييمات/تعليقات المنتجات: أي زائر يقدر يكتب اسمه وتقييمه (نجوم)
-- وتعليقه على منتج معيّن. تظهر التعليقات تحت كل منتج، والتقييمات المرتفعة
-- فقط (4 نجوم فأكثر) تظهر بشريط "ماذا قال عملاؤنا" بالصفحة الرئيسية.
-- ============================================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

-- الكل يشوف التعليقات المعتمدة فقط
create policy "reviews_select_approved" on public.reviews
  for select using (approved = true or public.is_admin());

-- أي زائر (حتى بدون تسجيل دخول) يقدر يضيف تقييم لمنتج
create policy "reviews_insert_anyone" on public.reviews
  for insert with check (rating between 1 and 5 and char_length(customer_name) > 0);

-- الأدمن فقط يقدر يخفي/يحذف تعليق غير مناسب
create policy "reviews_update_admin" on public.reviews
  for update using (public.is_admin()) with check (public.is_admin());

create policy "reviews_delete_admin" on public.reviews
  for delete using (public.is_admin());

create index if not exists reviews_product_id_idx on public.reviews(product_id);
create index if not exists reviews_rating_idx on public.reviews(rating);
