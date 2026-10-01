import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { getProduct, productHref } from '@/lib/catalog';
import { FREE_SHIPPING_THRESHOLD, shippingFee } from '@/lib/shipping';
import { formatPrice, stockInfo, summarize } from '@/lib/format';
import { ProductImage } from '@/components/ProductImage';
import { StockBadge } from '@/components/StockBadge';
import { AddToCart } from '@/components/AddToCart';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: 'Ürün bulunamadı' };
  return {
    title: product.name,
    description: summarize(product.description),
    alternates: { canonical: productHref(product) },
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  // Eski /urun/11 gibi adresler okunaklı adrese kalıcı olarak yönlendirilir.
  const canonical = productHref(product);
  if (canonical !== `/urun/${slug}`) permanentRedirect(canonical);

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
            eager
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">Stok kodu: {product.sku}</p>

          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-green-700">
              {formatPrice(product.price)}
              {product.pair_price !== null && <span className="ml-2 text-base font-medium text-gray-600">tek taraf</span>}
            </p>
            <StockBadge stock={product.stock} />
          </div>

          <p className="text-sm text-gray-600">
            {shippingFee(Number(product.price)) === 0
              ? '🚚 Kargo ücretsiz'
              : `🚚 ${formatPrice(FREE_SHIPPING_THRESHOLD)} ve üzeri siparişlerde kargo ücretsiz`}
          </p>

          <AddToCart
            productId={product.id}
            price={Number(product.price)}
            pairPrice={product.pair_price === null ? null : Number(product.pair_price)}
            available={available}
          />
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
