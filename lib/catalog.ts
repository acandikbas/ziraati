import { cache } from 'react';
import { getSupabase } from './supabase';
import type { Category, Product } from '@/types/product';

const PRODUCT_FIELDS = `
  id, slug, sku, name, price, description, image_url, stock, pair_price, subcategory_id,
  subcategories(name, slug, category_id, categories(name, slug))
`;

/** Ürün sayfasının adresi: slug varsa okunaklı adres, yoksa id. */
export function productHref(p: Pick<Product, 'id' | 'slug'>): string {
  return `/urun/${p.slug ?? p.id}`;
}

/** Tüm kategoriler ve alt kategorileri (filtre çubuğu için). */
export const listCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await getSupabase()
    .from('categories')
    .select('id, name, slug, description, subcategories(id, name, slug)')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
});

/**
 * Arama metnini güvenli kelimelere ayırır. PostgREST filtre sözdizimini bozabilecek
 * karakterler (virgül, parantez, joker karakterler, tırnak) atılır.
 */
export function searchTerms(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .slice(0, 60)
    .replace(/[^\p{L}\p{N}\s\-/.]/gu, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^[.\-/]+|[.\-/]+$/g, ''))
    .filter(w => w.length >= 2)
    .slice(0, 5);
}

/** Ürün listesi: isteğe bağlı alt kategori ve arama. Arama her kelimeyi ad, SKU veya açıklamada arar. */
export async function listProducts(opts: { subcategorySlug?: string; search?: string } = {}): Promise<Product[]> {
  const supabase = getSupabase();
  let query = supabase.from('products').select(PRODUCT_FIELDS).order('name', { ascending: true });

  if (opts.subcategorySlug) {
    const { data: sub, error } = await supabase
      .from('subcategories')
      .select('id')
      .eq('slug', opts.subcategorySlug)
      .maybeSingle();
    if (error) throw error;
    if (!sub) return [];
    query = query.eq('subcategory_id', sub.id);
  }

  for (const term of searchTerms(opts.search)) {
    query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

/**
 * Tek ürün: adres parçası sayıysa id ile (eski adresler), değilse slug ile bulunur.
 * `cache` sayesinde aynı istekte generateMetadata ve sayfa veritabanına iki kez gitmez.
 */
export const getProduct = cache(async (idOrSlug: string): Promise<Product | null> => {
  const key = decodeURIComponent(idOrSlug);
  const byId = /^\d+$/.test(key);
  if (!byId && !/^[a-z0-9-]{1,200}$/.test(key)) return null;

  const { data, error } = await getSupabase()
    .from('products')
    .select(PRODUCT_FIELDS)
    .eq(byId ? 'id' : 'slug', key)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Product) ?? null;
});
