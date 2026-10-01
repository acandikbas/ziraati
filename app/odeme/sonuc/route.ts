import { completePayment } from '@/lib/payments';

/**
 * iyzico, ödeme sayfası tamamlanınca müşteriyi buraya POST ile `token` göndererek yönlendirir.
 * Sonuç token ile iyzico'dan sunucu tarafında sorgulanır; formdaki başka hiçbir veriye güvenilmez.
 */
export async function POST(request: Request) {
  let token = '';
  try {
    token = String((await request.formData()).get('token') ?? '');
  } catch {
    // boş/bozuk istek
  }
  const { publicId, outcome } = await completePayment(token);
  const target = publicId ? `/siparis/${publicId}?odeme=${outcome}` : '/?odeme=hata';
  // 303: POST'tan sonra tarayıcı hedefe GET ile gider
  return new Response(null, { status: 303, headers: { Location: target } });
}

/** Adres doğrudan açılırsa ana sayfaya dön. */
export function GET() {
  return new Response(null, { status: 303, headers: { Location: '/' } });
}
