-- Ziraati – Aşama 3: sipariş altyapısı
-- Supabase panelinde SQL Editor'e yapıştırıp bir kez çalıştırın.
-- Tek işlemde çalışır; hata olursa hiçbir şey değişmez. Tekrar çalıştırmak güvenlidir.
--
-- Güvenlik modeli:
-- * orders / order_items tablolarına site (anon key) DOĞRUDAN erişemez: RLS açık, hiç politika yok.
-- * Sipariş yalnızca create_order() fonksiyonuyla oluşur. Fiyat, stok ve kargo ücreti
--   veritabanındaki ürün kaydından hesaplanır; tarayıcıdan gelen fiyat hiç kullanılmaz.
-- * Onay sayfası get_order_summary() ile, tahmin edilemeyen bir kimlikle (UUID) okunur ve
--   telefon/adres gibi kişisel bilgileri döndürmez.
-- * Kargo kuralı (lib/shipping.ts ile aynı): ara toplam >= 500 TL ise ücretsiz, değilse 100 TL.

begin;

-- 1) Sağ/Sol seçimi gereken ürünler (paketinde tek taraf olanlar)
alter table public.products add column if not exists side_required boolean not null default false;
update public.products set side_required = true
where sku in ('ZR-FIAT-ARKA-KOMPLE', 'ZR-FIAT-ON-KOMPLE');

-- 2) Sipariş tabloları
create sequence if not exists public.order_no_seq start 1001;

create table if not exists public.orders (
  id            bigint generated always as identity primary key,
  public_id     uuid not null default gen_random_uuid() unique,
  order_no      text not null unique,
  status        text not null default 'odeme_bekliyor'
                check (status in ('odeme_bekliyor', 'odendi', 'hazirlaniyor', 'kargoda', 'teslim_edildi', 'iptal')),
  customer_name text not null,
  phone         text not null,
  email         text not null,
  city          text not null,
  district      text not null,
  address       text not null,
  note          text,
  subtotal      numeric(12, 2) not null default 0,
  shipping_fee  numeric(12, 2) not null default 0,
  total         numeric(12, 2) not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.order_items (
  id           bigint generated always as identity primary key,
  order_id     bigint not null references public.orders (id) on delete cascade,
  product_id   bigint not null references public.products (id),
  sku          text not null,
  product_name text not null,
  side         text check (side in ('Sağ', 'Sol')),
  unit_price   numeric(12, 2) not null,
  quantity     integer not null check (quantity between 1 and 99),
  line_total   numeric(12, 2) not null
);
create index if not exists idx_order_items_order_id on public.order_items (order_id);

alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
revoke all on public.orders, public.order_items from anon, authenticated;
revoke all on sequence public.order_no_seq from anon, authenticated;

-- 3) Sipariş oluşturma
-- p_customer: {"name","phone","email","city","district","address","note"}
-- p_items:    [{"product_id": 11, "quantity": 2, "side": "Sağ"}, ...]
-- Kullanıcıya gösterilecek hatalar SQLSTATE 'ZR001' ile döner.
create or replace function public.create_order(p_customer jsonb, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name     text := btrim(coalesce(p_customer ->> 'name', ''));
  v_phone    text := regexp_replace(coalesce(p_customer ->> 'phone', ''), '[^0-9+]', '', 'g');
  v_email    text := lower(btrim(coalesce(p_customer ->> 'email', '')));
  v_city     text := btrim(coalesce(p_customer ->> 'city', ''));
  v_district text := btrim(coalesce(p_customer ->> 'district', ''));
  v_address  text := btrim(coalesce(p_customer ->> 'address', ''));
  v_note     text := nullif(btrim(coalesce(p_customer ->> 'note', '')), '');
  v_order    public.orders;
  v_item     jsonb;
  v_product  public.products;
  v_qty      integer;
  v_side     text;
  v_subtotal numeric(12, 2) := 0;
  v_shipping numeric(12, 2);
begin
  -- Müşteri bilgileri (site de doğrular; burası son savunma hattı)
  if char_length(v_name) not between 3 and 100 then
    raise exception 'Ad soyad 3–100 karakter olmalı.' using errcode = 'ZR001';
  end if;
  if v_phone !~ '^(\+90|0)?5[0-9]{9}$' then
    raise exception 'Geçerli bir cep telefonu girin (ör. 0532 123 45 67).' using errcode = 'ZR001';
  end if;
  if char_length(v_email) > 200 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Geçerli bir e-posta adresi girin.' using errcode = 'ZR001';
  end if;
  if char_length(v_city) not between 2 and 50 or char_length(v_district) not between 2 and 50 then
    raise exception 'İl ve ilçe bilgisi eksik.' using errcode = 'ZR001';
  end if;
  if char_length(v_address) not between 10 and 500 then
    raise exception 'Açık adres 10–500 karakter olmalı.' using errcode = 'ZR001';
  end if;
  if char_length(coalesce(v_note, '')) > 500 then
    raise exception 'Sipariş notu en fazla 500 karakter olabilir.' using errcode = 'ZR001';
  end if;

  if jsonb_typeof(p_items) is distinct from 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'Sepetiniz boş.' using errcode = 'ZR001';
  end if;
  if jsonb_array_length(p_items) > 30 then
    raise exception 'Bir siparişte en fazla 30 kalem olabilir.' using errcode = 'ZR001';
  end if;

  insert into public.orders (order_no, customer_name, phone, email, city, district, address, note)
  values ('ZR-' || to_char(now() at time zone 'Europe/Istanbul', 'YYMMDD') || '-' || nextval('public.order_no_seq'),
          v_name, v_phone, v_email, v_city, v_district, v_address, v_note)
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items) loop
    if coalesce(v_item ->> 'product_id', '') !~ '^[0-9]{1,18}$'
       or coalesce(v_item ->> 'quantity', '') !~ '^[0-9]{1,2}$' then
      raise exception 'Sepetteki bir ürün geçersiz.' using errcode = 'ZR001';
    end if;
    v_qty := (v_item ->> 'quantity')::integer;
    if v_qty < 1 or v_qty > 99 then
      raise exception 'Ürün adedi 1–99 arasında olmalı.' using errcode = 'ZR001';
    end if;

    -- Satırı kilitleyerek oku: aynı anda iki sipariş son ürünü alamaz
    select * into v_product from public.products
    where id = (v_item ->> 'product_id')::bigint
    for update;
    if not found then
      raise exception 'Sepetteki bir ürün artık satışta değil.' using errcode = 'ZR001';
    end if;

    v_side := nullif(v_item ->> 'side', '');
    if v_product.side_required then
      if v_side is null or v_side not in ('Sağ', 'Sol') then
        raise exception '"%" için Sağ veya Sol seçin.', v_product.name using errcode = 'ZR001';
      end if;
    else
      v_side := null;
    end if;

    -- stock null = stok takibi yok
    if v_product.stock is not null then
      if v_product.stock < v_qty then
        raise exception '"%" için yeterli stok yok (kalan: %).', v_product.name, greatest(v_product.stock, 0)
          using errcode = 'ZR001';
      end if;
      update public.products set stock = stock - v_qty where id = v_product.id;
    end if;

    insert into public.order_items (order_id, product_id, sku, product_name, side, unit_price, quantity, line_total)
    values (v_order.id, v_product.id, v_product.sku, v_product.name, v_side,
            v_product.price, v_qty, v_product.price * v_qty);

    v_subtotal := v_subtotal + v_product.price * v_qty;
  end loop;

  v_shipping := case when v_subtotal >= 500 then 0 else 100 end;

  update public.orders
  set subtotal = v_subtotal, shipping_fee = v_shipping, total = v_subtotal + v_shipping
  where id = v_order.id;

  return jsonb_build_object('public_id', v_order.public_id, 'order_no', v_order.order_no);
end;
$$;

-- 4) Onay sayfası için sipariş özeti (telefon ve adres döndürülmez)
create or replace function public.get_order_summary(p_public_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'order_no',      o.order_no,
    'status',        o.status,
    'created_at',    o.created_at,
    'customer_name', o.customer_name,
    'city',          o.city,
    'subtotal',      o.subtotal,
    'shipping_fee',  o.shipping_fee,
    'total',         o.total,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
               'product_name', i.product_name, 'side', i.side,
               'quantity', i.quantity, 'unit_price', i.unit_price, 'line_total', i.line_total)
             order by i.id)
      from public.order_items i where i.order_id = o.id), '[]'::jsonb)
  )
  from public.orders o
  where o.public_id = p_public_id;
$$;

revoke all on function public.create_order(jsonb, jsonb) from public;
revoke all on function public.get_order_summary(uuid) from public;
grant execute on function public.create_order(jsonb, jsonb) to anon, authenticated;
grant execute on function public.get_order_summary(uuid) to anon, authenticated;

commit;

-- Kontrol: iki ürün "taraf seçimi gerekli" olarak işaretlenmiş olmalı
select sku, side_required from public.products where side_required order by sku;
