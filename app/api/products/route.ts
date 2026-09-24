export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({
          error: 'Supabase not configured',
          message: 'Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products, error } = await supabase
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

    if (error) {
      console.error('Supabase Query Error:', error);
      return new Response(JSON.stringify({ error: error.message, code: error.code }), { status: 500 });
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Error:', errorMsg, error);
    return new Response(
      JSON.stringify({ error: errorMsg, type: error instanceof Error ? error.constructor.name : 'Unknown' }),
      { status: 500 }
    );
  }
}
