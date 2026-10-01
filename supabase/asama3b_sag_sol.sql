-- Ziraati – Aşama 3b: tüm Sağ/Sol lambalarda Sağ, Sol veya Sağ + Sol (takım) seçimi
-- ÖNCE supabase/asama3_siparis.sql çalıştırılmış olmalı.
-- Supabase panelinde SQL Editor'e yapıştırıp bir kez çalıştırın.
-- Tek işlemde çalışır; hata olursa hiçbir şey değişmez. Tekrar çalıştırmak güvenlidir
-- (fiyatlar yalnızca ilk çalıştırmada güncellenir).
--
-- Fiyat modeli:
-- * pair_price DOLU olan ürünlerde müşteri Sağ / Sol / Sağ + Sol seçer.
--     price      = tek taraf fiyatı
--     pair_price = Sağ + Sol takım fiyatı
-- * Daha önce takım olarak satılan 10 üründe: takım fiyatı aynı kalır, tek taraf = yarısı.
-- * Fiat komple arka/ön lambalarda (tek taraf satılıyordu): tek taraf 700, takım 1400.
-- * Fiyatları ileride Table Editor'den price / pair_price sütunlarından değiştirebilirsiniz.

begin;

alter table public.products add column if not exists pair_price numeric(12, 2);

-- Takım olarak satılan 10 ürün: takım fiyatı korunur, tek taraf yarı fiyat
update public.products
set pair_price = price, price = round(price / 2, 2)
where pair_price is null
  and sku in ('ZR-FIAT-ARKA-CAM', 'ZR-FIAT-ON-CAM',
              'ZR-MF-ARKA-CAM', 'ZR-MF-ARKA-KOMPLE', 'ZR-MF-ON-CAM', 'ZR-MF-ON-KOMPLE',
              'ZR-NH-ARKA-CAM', 'ZR-NH-ARKA-KOMPLE', 'ZR-NH-ON-CAM', 'ZR-NH-ON-KOMPLE');

-- Tek taraf satılan Fiat komple lambalar: takım = 2 katı
update public.products
set pair_price = price * 2
where pair_price is null
  and sku in ('ZR-FIAT-ARKA-KOMPLE', 'ZR-FIAT-ON-KOMPLE');

-- Artık pair_price kullanılıyor; Aşama 3'teki side_required sütunu kaldırılır
alter table public.products drop column if exists side_required;

-- Sipariş satırlarında "Sağ + Sol" de geçerli
alter table public.order_items drop constraint if exists order_items_side_check;
alter table public.order_items add constraint order_items_side_check
  check (side in ('Sağ', 'Sol', 'Sağ + Sol'));

-- Sipariş fonksiyonunun yeni hâli (güvenlik modeli Aşama 3 ile aynı)
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
  v_unit     numeric(12, 2);
  v_pieces   integer;
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

    -- Sağ/Sol seçimli ürünler: pair_price dolu. price = tek taraf, pair_price = Sağ + Sol takım
    v_side := nullif(v_item ->> 'side', '');
    if v_product.pair_price is not null then
      if v_side is null or v_side not in ('Sağ', 'Sol', 'Sağ + Sol') then
        raise exception '"%" için Sağ, Sol veya Sağ + Sol seçin.', v_product.name using errcode = 'ZR001';
      end if;
    else
      v_side := null;
    end if;
    v_unit   := case when v_side = 'Sağ + Sol' then v_product.pair_price else v_product.price end;
    v_pieces := v_qty * case when v_side = 'Sağ + Sol' then 2 else 1 end;

    -- stock null = stok takibi yok; stok parça (tek lamba) sayısıdır, takım 2 parça düşer
    if v_product.stock is not null then
      if v_product.stock < v_pieces then
        raise exception '"%" için yeterli stok yok (kalan: % adet).', v_product.name, greatest(v_product.stock, 0)
          using errcode = 'ZR001';
      end if;
      update public.products set stock = stock - v_pieces where id = v_product.id;
    end if;

    insert into public.order_items (order_id, product_id, sku, product_name, side, unit_price, quantity, line_total)
    values (v_order.id, v_product.id, v_product.sku, v_product.name, v_side, v_unit, v_qty, v_unit * v_qty);

    v_subtotal := v_subtotal + v_unit * v_qty;
  end loop;

  v_shipping := case when v_subtotal >= 500 then 0 else 100 end;

  update public.orders
  set subtotal = v_subtotal, shipping_fee = v_shipping, total = v_subtotal + v_shipping
  where id = v_order.id;

  return jsonb_build_object('public_id', v_order.public_id, 'order_no', v_order.order_no);
end;
$$;

revoke all on function public.create_order(jsonb, jsonb) from public;
grant execute on function public.create_order(jsonb, jsonb) to anon, authenticated;

commit;

-- Kontrol: 12 ürün, tek taraf ve takım fiyatlarıyla listelenmeli
select sku, price as tek_taraf, pair_price as sag_sol_takim
from public.products
where pair_price is not null
order by sku;
