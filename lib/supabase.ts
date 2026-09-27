import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Supabase ayarları eksik olduğunda fırlatılır; API bunu 503 olarak döner. */
export class SupabaseConfigError extends Error {
  constructor() {
    super('SUPABASE_URL ve SUPABASE_ANON_KEY ortam değişkenleri tanımlı değil');
    this.name = 'SupabaseConfigError';
  }
}

let client: SupabaseClient | null = null;

/**
 * Yalnızca sunucu tarafında kullanılır (API route'ları, server component'ler).
 * Değişkenler bilerek NEXT_PUBLIC_ önekli değildir, tarayıcı paketine girmezler.
 * Eski NEXT_PUBLIC_ adları, hosting ayarları güncellenene kadar geçici olarak okunur.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new SupabaseConfigError();

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
