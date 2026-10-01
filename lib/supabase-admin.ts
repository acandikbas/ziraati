// Bu dosya yalnızca sunucuda çalışır; tarayıcı koduna eklenirse derleme hata verir.
import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let admin: SupabaseClient | null = null;

/**
 * Supabase'in GİZLİ anahtarıyla (secret / service_role) çalışan istemci.
 * Tüm yetkilere sahiptir: YALNIZCA sunucu kodunda (server action / route handler) kullanılır,
 * asla tarayıcıya gönderilmez. Ödeme durumunu güncellemek için gereklidir.
 * Anahtar tanımlı değilse null döner (ödeme kapalı modu).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (admin) return admin;
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return admin;
}
