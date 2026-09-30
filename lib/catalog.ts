import { cache } from 'react';
import { getSupabase } from './supabase';
import type { Category, Product } from '@/types/product';

const PRODUCT_FIELDS = `
  id, sku, name, price, description, image_url, stock, subcategory_id,
  subcategories(name, slug, category_id, categories(name, slug))
`;

/** Tüm kategoriler ve alt kategorileri (filtre çubuğu için). */
export const listCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await getSupabase()
    .from('categories')
    .select('id, name, slug, description, subcategories(id, name, slug)')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
});

/** Ürün listesi; alt kategori slug'ı verilirse yalnızca o alt kategori. */
export async function listProducts(subcategorySlug?: string): Promise<Product[]> {
  const supabase = getSupabase();
  let query = supabase.from('products').select(PRODUCT_FIELDS).order('name', { ascending: true });

  if (subcategorySlug) {
    const { data: sub, error } = await supabase
      .from('subcategories')
      .select('id')
      .eq('slug', subcategorySlug)
      .maybeSingle();
    if (error) throw error;
    if (!sub) return [];
    query = query.eq('subcategory_id', sub.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

/**
 * Tek ürün. `cache` sayesinde aynı istekte generateMetadata ve sayfa
 * veritabanına iki kez gitmez. Geçersiz id için null döner.
 */
export const getProduct = cache(async (id: string): Promise<Product | null> => {
  if (!/^\d+$/.test(id)) return null;
  const { data, error } = await getSupabase()
    .from('products')
    .select(PRODUCT_FIELDS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Product) ?? null;
});
