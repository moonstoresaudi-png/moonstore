-- =========================================================================
-- Moon Store — Supabase schema
-- شغّل هذا الملف كامل مرة واحدة من: Supabase Dashboard → SQL Editor → New query
-- =========================================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- profiles: صف واحد لكل مستخدم مسجّل، يحدد إن كان "admin" أو "user"
-- -------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ينشئ تلقائيًا صف profile عند تسجيل مستخدم جديد
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- دالة مساعدة: هل المستخدم الحالي أدمن؟
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

-- -------------------------------------------------------------------------
-- products
-- -------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null default 0,
  old_price numeric,
  cost numeric not null default 0,
  category text not null,
  image_url text,
  gallery_images text[] not null default '{}',
  sizes text[] not null default '{}',
  simulator_enabled boolean not null default false,
  featured boolean not null default false,
  bestseller boolean not null default false,
  rating numeric not null default 5,
  in_stock boolean not null default true,
  stock_quantity integer not null default 0,
  purchase_count integer not null default 0,
  has_sash boolean not null default false,
  has_name boolean not null default false,
  has_date boolean not null default false,
  has_cap boolean not null default false,
  sash_addon numeric not null default 50,
  packaging_addon numeric not null default 15,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products_select_public" on public.products
  for select using (true);

create policy "products_write_admin" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------------------------------------
-- orders
-- -------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_number text unique not null default ('MS-' || to_char(now(), 'YYMMDDHH24MISS')),
  customer_name text not null,
  phone text,
  email text,
  city text,
  address text,
  country text not null default 'السعودية',
  product_name text not null,
  product_id uuid,
  quantity integer not null default 1,
  size text,
  total numeric not null default 0,
  cost numeric not null default 0,
  status text not null default 'new' check (status in ('pending','new','processing','shipped','delivered','cancelled','archived')),
  tracking_number text,
  tracking_stage text not null default 'placed' check (tracking_stage in ('placed','preparing','shipped','out_for_delivery','delivered')),
  payment_method text not null default 'card' check (payment_method in ('card','cod')),
  discount_code text,
  discount_amount numeric not null default 0,
  notes text,
  sash_config text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- أي شخص (حتى زائر) يقدر ينشئ طلب عند إتمام الشراء
create policy "orders_insert_anyone" on public.orders
  for insert with check (true);

-- المستخدم يشوف طلباته هو فقط، والأدمن يشوف كل شي
create policy "orders_select_own_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

create policy "orders_write_admin" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

create policy "orders_delete_admin" on public.orders
  for delete using (public.is_admin());

-- تتبّع الطلب للزوار (بدون تسجيل دخول) عبر رقم الطلب أو الجوال فقط —
-- بدون كشف كل جدول الطلبات لأي زائر (RPC آمن بدل SELECT مباشر)
create or replace function public.track_order(p_query text)
returns setof public.orders as $$
  select * from public.orders
  where order_number = p_query or phone = p_query
  order by created_at desc
  limit 1;
$$ language sql security definer stable set search_path = public;

grant execute on function public.track_order(text) to anon, authenticated;

-- -------------------------------------------------------------------------
-- discount_codes
-- -------------------------------------------------------------------------
create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent numeric not null default 10,
  active boolean not null default true,
  max_uses integer not null default 100,
  uses_count integer not null default 0,
  expiry_date date,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.discount_codes enable row level security;

create policy "discount_codes_write_admin" on public.discount_codes
  for all using (public.is_admin()) with check (public.is_admin());

-- التحقق من كود خصم بأمان بدون كشف كل الأكواد للزوار
create or replace function public.validate_discount_code(p_code text)
returns table(code text, discount_percent numeric) as $$
  select code, discount_percent from public.discount_codes
  where upper(code) = upper(p_code)
    and active = true
    and uses_count < max_uses
    and (expiry_date is null or expiry_date >= current_date)
  limit 1;
$$ language sql security definer stable set search_path = public;

grant execute on function public.validate_discount_code(text) to anon, authenticated;

-- -------------------------------------------------------------------------
-- suppliers
-- -------------------------------------------------------------------------
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_person text,
  phone text,
  product_type text,
  unit_cost numeric not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.suppliers enable row level security;

create policy "suppliers_admin_only" on public.suppliers
  for all using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------------------------------------
-- store_settings: صف واحد فقط، معلومات المتجر العامة (يقرأها كل الموقع)
-- -------------------------------------------------------------------------
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  store_name text not null default 'Moon Store',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  address text not null default '',
  cr_number text not null default '',
  shipping_cost numeric not null default 25,
  cod_fee numeric not null default 10,
  instagram text not null default '',
  twitter text not null default '',
  snapchat text not null default '',
  tiktok text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id) values (1) on conflict (id) do nothing;

alter table public.store_settings enable row level security;

create policy "store_settings_select_public" on public.store_settings
  for select using (true);

create policy "store_settings_write_admin" on public.store_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------------------------------------
-- Storage: باكت عام لصور المنتجات
-- -------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "product_images_admin_write" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

-- =========================================================================
-- بعد تشغيل هذا الملف: أنشئ حسابك من صفحة /register في الموقع، ثم رقّه لأدمن بتنفيذ:
--   update public.profiles set role = 'admin' where id =
--     (select id from auth.users where email = 'your-email@example.com');
-- =========================================================================
