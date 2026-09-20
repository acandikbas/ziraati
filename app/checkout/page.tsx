'use client';

import Link from 'next/link';

const products = [
  {
    id: 1,
    name: 'Traktör Parçaları',
    price: 5000,
    description: 'Kaliteli traktör yedek parçaları'
  },
  {
    id: 2,
    name: 'Çapa Yedekleri',
    price: 2500,
    description: 'Dayanıklı çapa yedek parçaları'
  },
  {
    id: 3,
    name: 'Dron Parçaları',
    price: 3000,
    description: 'Tarım teknolojisi dron parçaları'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold">🌾 Ziraati</h1>
          <p className="text-green-100 mt-2">Tarım Makineleri & Yedek Parça</p>
          <p className="text-green-200 text-sm mt-2">Traktör, çapa, dron yedek parçaları</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Tarım Makineleri & Yedek Parça
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Traktör, çapa, dron yedek parçaları
          </p>
          <Link
            href="#products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Alışverişe Başla
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-green-800 mb-12 text-center">
          Öne Çıkan Ürünler
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Product Image Placeholder */}
              <div className="bg-gradient-to-br from-green-400 to-green-600 h-48 flex items-center justify-center">
                <span className="text-5xl">📦</span>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mb-6 border-t pt-4">
                  <p className="text-3xl font-bold text-green-600">
                    ₺{product.price.toLocaleString('tr-TR')}
                  </p>
                </div>

                {/* Buy Button */}
                <Link
                  href={`/checkout?product=${product.name}&price=${product.price}`}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition text-center"
                >
                  Satın Al
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-green-50 py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-12 text-center">
            Neden Bizi Seçmelisiniz?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Kaliteli Ürünler
              </h3>
              <p className="text-gray-600">
                En iyi tarım makineleri yedek parçaları
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Hızlı Kargo
              </h3>
              <p className="text-gray-600">
                Türkiye geneline 1-2 günde teslimat
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Güvenli Ödeme
              </h3>
              <p className="text-gray-600">
                İYZICO ile güvenli ve hızlı ödeme
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 Ziraati. Tüm hakları saklıdır.</p>
          <p className="text-green-200 text-sm mt-2">
            Tarım teknolojisi çözümleri
          </p>
        </div>
      </footer>
    </div>
  );
}