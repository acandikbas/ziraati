import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <Link href="/" className="inline-block">
          <span className="text-3xl font-bold">🌾 Ziraati</span>
          <span className="mt-1 block text-sm text-green-100">Tarım Makineleri &amp; Yedek Parça</span>
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-green-800 py-8 text-center text-white">
      <p>&copy; {new Date().getFullYear()} Ziraati. Tüm hakları saklıdır.</p>
    </footer>
  );
}
