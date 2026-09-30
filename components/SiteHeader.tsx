import Link from 'next/link';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';
import { formatPrice } from '@/lib/format';

export function SiteHeader() {
  return (
    <header>
      <p className="bg-green-900 px-4 py-2 text-center text-sm font-medium text-green-50">
        🚚 {formatPrice(FREE_SHIPPING_THRESHOLD)} ve üzeri siparişlerde kargo ücretsiz
      </p>
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold">🌾 Ziraati</span>
            <span className="mt-1 block text-sm text-green-100">Tarım Makineleri &amp; Yedek Parça</span>
          </Link>
          <SearchBox />
        </div>
      </div>
    </header>
  );
}

/** JavaScript olmadan da çalışan basit arama formu: /?ara=... adresine gider. */
function SearchBox() {
  return (
    <form action="/" method="get" role="search" className="flex w-full overflow-hidden rounded-lg bg-white shadow-sm sm:w-96">
      <label htmlFor="ara" className="sr-only">Ürün ara</label>
      <input
        id="ara"
        name="ara"
        type="search"
        required
        minLength={2}
        maxLength={60}
        placeholder="Ürün adı veya OEM kodu"
        className="min-w-0 flex-1 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-none"
      />
      <button type="submit" className="bg-green-900 px-5 font-semibold text-white hover:bg-green-950">
        Ara
      </button>
    </form>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-green-800 py-8 text-center text-white">
      <p>&copy; {new Date().getFullYear()} Ziraati. Tüm hakları saklıdır.</p>
    </footer>
  );
}
