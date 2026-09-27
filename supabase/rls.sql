-- Ziraati: Row Level Security (Aşama 1)
-- Supabase panelinde SQL Editor'e yapıştırıp bir kez çalıştırın.
--
-- Sonuç: anon key ile herkes ürün/kategori OKUYABİLİR ama hiçbir şey
-- ekleyemez, değiştiremez, silemez. Supabase panelinden (service role)
-- yapılan düzenlemeler RLS'ye takılmaz, ürün yönetimi eskisi gibi sürer.

alter table public.products      enable row level security;
alter table public.categories    enable row level security;
alter table public.subcategories enable row level security;

drop policy if exists "Herkes okuyabilir" on public.products;
drop policy if exists "Herkes okuyabilir" on public.categories;
drop policy if exists "Herkes okuyabilir" on public.subcategories;

create policy "Herkes okuyabilir" on public.products
  for select to anon, authenticated using (true);
create policy "Herkes okuyabilir" on public.categories
  for select to anon, authenticated using (true);
create policy "Herkes okuyabilir" on public.subcategories
  for select to anon, authenticated using (true);

-- Kontrol: her tablo için rowsecurity = true olmalı
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('products', 'categories', 'subcategories');
