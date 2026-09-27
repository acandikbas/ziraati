import { getSupabase } from '@/lib/supabase';
import { json, serverError } from '@/lib/http';

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        subcategories(
          id,
          name,
          slug
        )
      `)
      .order('name', { ascending: true });

    if (error) return serverError('api/categories', error, 'Kategoriler şu anda yüklenemiyor');
    return json(data ?? []);
  } catch (err) {
    return serverError('api/categories', err, 'Kategoriler şu anda yüklenemiyor');
  }
}
