import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="mb-3 text-2xl font-bold text-gray-800">Sayfa bulunamadı</h1>
      <p className="mb-6 text-gray-600">Aradığınız ürün ya da sayfa mevcut değil veya kaldırılmış olabilir.</p>
      <Link href="/" className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">
        Ana sayfaya dön
      </Link>
    </div>
  );
}
