-- ============================================================================
-- ربط الشحن مع Tryoto (OTO): حقول لتتبع بوليصة الشحن (AWB) لكل طلب،
-- تُعبّى تلقائيًا بعد تأكيد الدفع عبر Edge Function اسمها create-shipment.
-- ============================================================================
alter table public.orders add column if not exists awb_status text not null default 'not_shipped'
  check (awb_status in ('not_shipped','processing','shipped','failed'));
alter table public.orders add column if not exists oto_order_id text;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists awb_url text;
alter table public.orders add column if not exists shipping_error text;

create index if not exists orders_awb_status_idx on public.orders(awb_status);
