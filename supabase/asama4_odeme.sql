-- Ziraati – Aşama 4: iyzico ödeme altyapısı (veritabanı)
-- ÖNCE asama3_siparis.sql ve asama3b_sag_sol.sql çalıştırılmış olmalı.
-- Supabase panelinde SQL Editor'e yapıştırıp bir kez çalıştırın. Tek işlemde çalışır; tekrar çalıştırmak güvenlidir.
--
-- Güvenlik:
-- * Ödeme durumunu değiştiren fonksiyonlar YALNIZCA service_role (sunucudaki gizli anahtar) ile
--   çağrılabilir. Sitenin herkese açık anahtarı (anon) bunları çağıramaz; yani hiçbir ziyaretçi
--   bir siparişi "ödendi" yapamaz.
-- * Ödeme sonucu, site sunucusu tarafından doğrudan iyzico'ya sorularak doğrulanır; tutar burada
--   bir kez daha sipariş toplamıyla karşılaştırılır.

begin;

alter table public.orders add column if not exists payment_token text;
alter table public.orders add column if not exists payment_id    text;
alter table public.orders add column if not exists paid_at       timestamptz;
alter table public.orders add column if not exists payment_note  text;
create index if not exists idx_orders_payment_token on public.orders (payment_token);

-- Ödemeyi onayla. Sonuç: 'odendi' | 'zaten_odendi' | 'tutar_uyusmazligi'.
-- Aynı ödeme için iki kez çağrılırsa ikinci çağrı hiçbir şey yapmaz.
create or replace function public.mark_order_paid(p_public_id uuid, p_token text, p_payment_id text, p_paid_price numeric)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item  public.order_items;
begin
  select * into v_order from public.orders where public_id = p_public_id for update;
  if not found then
    raise exception 'Sipariş bulunamadı.' using errcode = 'ZR002';
  end if;
  if v_order.payment_token is distinct from p_token then
    raise exception 'Ödeme belirteci sipariş ile eşleşmiyor.' using errcode = 'ZR002';
  end if;
  if v_order.status = 'odendi' then
    return 'zaten_odendi';
  end if;
  if p_paid_price is distinct from v_order.total then
    update public.orders
    set payment_note = format('Tutar uyuşmazlığı: beklenen %s, iyzico %s (ödeme %s)', v_order.total, p_paid_price, p_payment_id)
    where id = v_order.id;
    -- Hata fırlatılmaz ki not kalıcı olsun; sunucu bu sonucu ödeme başarısız sayar
    return 'tutar_uyusmazligi';
  end if;

  v_order.payment_note := null; -- önceki başarısız denemeden kalan not temizlenir

  if v_order.status = 'iptal' then
    -- Süresi dolup iptal edilmiş sipariş sonradan ödendi: stok yeniden düşülür (eksiye düşebilir)
    for v_item in select * from public.order_items where order_id = v_order.id loop
      update public.products
      set stock = stock - v_item.quantity * case when v_item.side = 'Sağ + Sol' then 2 else 1 end
      where id = v_item.product_id and stock is not null;
    end loop;
    v_order.payment_note := 'Süresi dolduktan sonra ödendi; stoğu kontrol edin.';
  end if;

  update public.orders
  set status = 'odendi', paid_at = now(), payment_id = p_payment_id, payment_note = v_order.payment_note
  where id = v_order.id;
  return 'odendi';
end;
$$;

-- Belirtilen süreden uzun süredir ödeme bekleyen siparişleri iptal eder ve stoğu geri verir.
create or replace function public.expire_unpaid_orders(p_minutes integer default 60)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item  public.order_items;
  v_count integer := 0;
begin
  for v_order in
    select * from public.orders
    where status = 'odeme_bekliyor'
      and created_at < now() - make_interval(mins => greatest(p_minutes, 15))
    for update skip locked
  loop
    for v_item in select * from public.order_items where order_id = v_order.id loop
      update public.products
      set stock = stock + v_item.quantity * case when v_item.side = 'Sağ + Sol' then 2 else 1 end
      where id = v_item.product_id and stock is not null;
    end loop;
    update public.orders
    set status = 'iptal', payment_note = 'Ödeme süresi dolduğu için otomatik iptal edildi.'
    where id = v_order.id;
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

revoke all on function public.mark_order_paid(uuid, text, text, numeric) from public, anon, authenticated;
revoke all on function public.expire_unpaid_orders(integer) from public, anon, authenticated;
grant execute on function public.mark_order_paid(uuid, text, text, numeric) to service_role;
grant execute on function public.expire_unpaid_orders(integer) to service_role;

commit;

-- Kontrol: iki satır, ikisi de yalnızca service_role'e açık olmalı
select p.proname as fonksiyon,
       has_function_privilege('anon', p.oid, 'execute') as anon_cagirabilir,
       has_function_privilege('service_role', p.oid, 'execute') as sunucu_cagirabilir
from pg_proc p
where p.proname in ('mark_order_paid', 'expire_unpaid_orders')
order by 1;
