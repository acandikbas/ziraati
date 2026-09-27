import { json } from '@/lib/http';

/**
 * Ödeme henüz aktif değil. Eskiden her isteğe "success" dönen sahte yanıt kaldırıldı.
 * Gerçek iyzico entegrasyonu yol haritasının 4. aşamasında yazılacak.
 */
export async function POST() {
  return json({ error: 'Ödeme henüz aktif değil' }, 501);
}
