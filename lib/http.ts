import { SupabaseConfigError } from './supabase';

export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

/**
 * Hatanın ayrıntısını yalnızca sunucu loguna yazar; istemciye genel bir mesaj döner.
 * Supabase mesajları, hata kodları ve exception tipleri dışarı sızmaz.
 */
export function serverError(context: string, err: unknown, publicMessage: string): Response {
  console.error(`[${context}]`, err);
  if (err instanceof SupabaseConfigError) {
    return json({ error: 'Servis şu anda kullanılamıyor' }, 503);
  }
  return json({ error: publicMessage }, 500);
}
