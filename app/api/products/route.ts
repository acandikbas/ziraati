import { getSupabase } from '@/lib/supabase';
import { json, serverError } from '@/lib/http';

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from('products')
      .select(`
        id,
        name,
        price,
        description,
        image_url,
        stock,
        subcategory_id,
        subcategories(
          name,
          category_id,
          categories(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) return serverError('api/products', error, 'Ürünler şu anda yüklenemiyor');
    return json(data ?? []);
  } catch (err) {
    return serverError('api/products', err, 'Ürünler şu anda yüklenemiyor');
  }
}
