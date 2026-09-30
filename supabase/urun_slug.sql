-- Ziraati: ürünlere okunaklı adres (slug) ekler.
-- Örnek: /urun/11  ->  /urun/fiat-480-640-arka-stop-lambasi-komple-sag-sol
-- Supabase panelinde SQL Editor'e yapıştırıp bir kez çalıştırın.
-- Tek işlemde çalışır; hata olursa hiçbir şey değişmez. Tekrar çalıştırmak güvenlidir.
--
-- Not: Panelden yeni ürün eklerken slug alanını boş bırakırsanız ürün sayfası
-- /urun/<id> adresinden açılır; doldurursanız okunaklı adres kullanılır.

begin;

alter table public.products add column if not exists slug text;

-- Aynı slug iki üründe olamaz (boş bırakılanlar serbest)
create unique index if not exists products_slug_key on public.products (slug);

update public.products p
set slug = v.slug
from (values
  ('ZR-TEP-LAMBA', '12v-24v-doner-tepe-lambasi-sari-flasorlu-traktor-cakari'),
  ('ZR-CAL-KARE', '12v-24v-kare-led-traktor-calisma-projektoru-su-gecirmez-off-road-tarakli-far-sis-lambasi'),
  ('ZR-CAL-YUVARLAK', '12v-24v-yuvarlak-led-traktor-calisma-projektoru-su-gecirmez-off-road-tarakli-far-sis-lambasi'),
  ('ZR-TEP-CAM', 'doner-tepe-lamba-cami-sari-3-civatali-traktor-ve-is-makinesi-cakar-cami-universal'),
  ('ZR-FIAT-ARKA-CAM', 'fiat-480-640-arka-sinyal-stop-lamba-cami-sari-kirmizi-ciftli-set'),
  ('ZR-FIAT-ARKA-KOMPLE', 'fiat-480-640-arka-stop-lambasi-komple-sag-sol'),
  ('ZR-FIAT-ON-CAM', 'fiat-480-640-on-sinyal-park-lamba-cami-sag-sol-set-oem-4247213-4247214'),
  ('ZR-FIAT-ON-KOMPLE', 'fiat-480-640-on-sinyal-park-lambasi-komple-sag-sol'),
  ('ZR-MF-ARKA-CAM', 'massey-ferguson-240-ve-efsane-seriler-icin-arka-stop-lamba-cami-sag-sol-set-oem-1672809m91-1672810m91'),
  ('ZR-MF-ARKA-KOMPLE', 'massey-ferguson-240-ve-efsane-seriler-icin-komple-arka-stop-lambasi-sag-sol-set-oem-1672809m91-1672810m91'),
  ('ZR-MF-ON-KOMPLE', 'massey-ferguson-240-ve-efsane-seriler-icin-komple-on-park-sinyal-lambasi-sag-sol-set-oem-1672807m91-1672808m91'),
  ('ZR-MF-ON-CAM', 'massey-ferguson-on-park-sinyal-lamba-cami-sari-seffaf-ciftli-set-oem-1672807m1-1672808m1'),
  ('ZR-NH-ARKA-CAM', 'new-holland-tt50-arka-stop-lamba-cami-sag-sol-set-oem-5183350-5183351'),
  ('ZR-NH-ARKA-KOMPLE', 'new-holland-tt50-arka-stop-lambasi-komple-sag-sol-set-oem-5183348-5183349'),
  ('ZR-NH-ON-CAM', 'new-holland-tt50-on-park-sinyal-lamba-cami-sag-sol-set-oem-5174542-5174543'),
  ('ZR-NH-ON-KOMPLE', 'new-holland-tt50-on-park-sinyal-lambasi-komple-sag-sol-set-oem-5174540-5174541')
) as v(sku, slug)
where p.sku = v.sku
  and p.slug is null;

commit;

-- Kontrol: 16 ürünün slug'ı dolu olmalı
select sku, slug from public.products where sku like 'ZR-%' order by sku;
