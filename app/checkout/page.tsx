import type { Metadata } from 'next';
import Link from 'next/link';
import { getProduct } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';

export const metadata: Metadata = { title: 'Sipariş', robots: { index: false } };

/**
 * Geçici sayfa: gerçek sipariş ve ödeme akışı yol haritasının 3. ve 4. aşamasında yazılacak.
 * Eskiden burada ana sayfanın bir kopyası duruyordu.
 */
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { urun } = await searchParams;
  const product = typeof urun === 'string' ? await getProduct(urun) : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Online sipariş çok yakında</h1>
      {product && (
        <p className="mb-4 text-gray-700">
          Seçtiğiniz ürün: <strong>{product.name}</strong> — {formatPrice(product.price)}
        </p>
      )}
      <p className="mb-8 text-gray-600">Sitemiz üzerinden ödeme almaya kısa süre içinde başlayacağız.</p>
      <Link href="/" className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">
        Ürünlere dön
      </Link>
    </div>
  );
}
