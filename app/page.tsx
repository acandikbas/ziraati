import Link from 'next/link';
import { listCategories, listProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { kategori, ara } = await searchParams;
  const selected = typeof kategori === 'string' && kategori ? kategori : undefined;
  const query = typeof ara === 'string' ? ara.trim().slice(0, 60) : '';

  const [categories, products] = await Promise.all([
    listCategories(),
    listProducts({ subcategorySlug: selected, search: query }),
  ]);
  const subcategories = categories.flatMap(c => c.subcategories ?? []).filter(s => s.slug);
  const selectedName = subcategories.find(s => s.slug === selected)?.name;

  return (
    <>
      <section className="border-b border-green-100 bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h1 className="mb-3 text-3xl font-bold text-green-800 sm:text-4xl">Traktör Lambaları &amp; Yedek Parça</h1>
          <p className="text-lg text-gray-600">
            Fiat, Massey Ferguson ve New Holland için stop, sinyal ve park lambaları, çalışma farları ve tepe lambaları
          </p>
        </div>
      </section>

      <section id="urunler" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-10">
        <nav aria-label="Kategoriler" className="mb-8 flex flex-wrap gap-2">
          <FilterChip href="/#urunler" active={!selected && !query}>Tümü</FilterChip>
          {subcategories.map(s => (
            <FilterChip key={s.id} href={`/?kategori=${encodeURIComponent(s.slug!)}#urunler`} active={s.slug === selected}>
              {s.name}
            </FilterChip>
          ))}
        </nav>

        <h2 className="mb-6 text-2xl font-bold text-green-800">
          {query ? `“${query}” için sonuçlar` : (selectedName ?? 'Tüm Ürünler')}
          <span className="ml-2 text-base font-normal text-gray-500">({products.length} ürün)</span>
          {query && (
            <Link href="/#urunler" className="ml-3 text-sm font-medium text-green-700 underline">Aramayı temizle</Link>
          )}
        </h2>

        {products.length === 0 ? (
          <p className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
            {query ? 'Aramanızla eşleşen ürün bulunamadı. Farklı bir kelime ya da parça kodu deneyin.' : 'Bu kategoride şu anda ürün yok.'}{' '}
            <Link href="/#urunler" className="font-semibold text-green-700 underline">Tüm ürünlere dön</Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white'
          : 'rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-50'
      }
    >
      {children}
    </Link>
  );
}
