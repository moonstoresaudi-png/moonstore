-- ============================================================================
-- إعلان/عرض قابل للتحكم من صفحة الإعدادات بلوحة التحكم: نص تكتبه وتفعّله
-- وقتما تبي (لعرض محدود، مناسبة، تنبيه...) يظهر تحت زر "تسوّق الآن" بالرئيسية.
-- ============================================================================
alter table public.store_settings add column if not exists announcement_enabled boolean not null default false;
alter table public.store_settings add column if not exists announcement_text text not null default '';
