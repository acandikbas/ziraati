import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/catalog';
import { formatPrice, stockInfo, summarize } from '@/lib/format';
import { ProductImage } from '@/components/ProductImage';
import { StockBadge } from '@/components/StockBadge';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).id);
  if (!product) return { title: 'Ürün bulunamadı' };
  return {
    title: product.name,
    description: summarize(product.description),
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).id);
  if (!product) notFound();

  const { available } = stockInfo(product.stock);
  const sub = product.subcategories;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Konum" className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-green-700">Ana sayfa</Link>
        {sub?.slug && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/?kategori=${encodeURIComponent(sub.slug)}#urunler`} className="hover:text-green-700">
              {sub.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">Stok kodu: {product.sku}</p>

          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-green-700">{formatPrice(product.price)}</p>
            <StockBadge stock={product.stock} />
          </div>

          {available ? (
            <Link
              href={`/checkout?urun=${product.id}`}
              className="rounded-lg bg-green-600 py-3 text-center text-lg font-bold text-white hover:bg-green-700"
            >
              Satın Al
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg bg-gray-300 py-3 text-lg font-bold text-gray-600"
            >
              Tükendi
            </button>
          )}
        </div>
      </div>

      {product.description && (
        <section className="mt-10 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-green-800">Ürün Açıklaması</h2>
          <div className="whitespace-pre-line leading-relaxed text-gray-700">{product.description}</div>
        </section>
      )}
    </div>
  );
}
