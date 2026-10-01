import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatPrice, stockInfo } from '@/lib/format';
import { productHref } from '@/lib/catalog';
import { ProductImage } from './ProductImage';
import { StockBadge } from './StockBadge';

export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const { available } = stockInfo(product.stock);
  return (
    <Link
      href={productHref(product)}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className={available ? '' : 'opacity-60'}>
        <ProductImage
          src={product.image_url}
          alt={product.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          eager={eager}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-gray-100 p-4">
        {product.subcategories?.name && (
          <p className="text-xs font-medium uppercase tracking-wide text-green-700">{product.subcategories.name}</p>
        )}
        <h3 className="line-clamp-3 text-sm font-semibold text-gray-800 group-hover:text-green-700">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div>
            <p className="text-xl font-bold text-green-700">
              {formatPrice(product.price)}
              {product.pair_price !== null && <span className="ml-1 text-xs font-medium text-gray-500">/ tek taraf</span>}
            </p>
            {product.pair_price !== null && (
              <p className="text-xs text-gray-600">Sağ + Sol takım: {formatPrice(product.pair_price)}</p>
            )}
          </div>
          <StockBadge stock={product.stock} />
        </div>
      </div>
    </Link>
  );
}
