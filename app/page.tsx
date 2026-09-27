'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; products: Product[] };

function Home() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error('Beklenmeyen yanıt biçimi');
        if (!cancelled) setState({ status: 'ready', products: data as Product[] });
      } catch (err) {
        console.error('Ürünler yüklenemedi:', err);
        if (!cancelled) setState({ status: 'error' });
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold">🌾 Ziraati</h1>
          <p className="text-green-100 mt-2">Tarım Makineleri & Yedek Parça</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Tarım Makineleri & Yedek Parça</h2>
          <p className="text-xl text-gray-600 mb-8">Traktör, çapa, dron yedek parçaları</p>
          <Link href="#products" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg">
            Alışverişe Başla
          </Link>
        </div>
      </section>

      <section id="products" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-green-800 mb-12 text-center">Öne Çıkan Ürünler</h2>

        {state.status === 'loading' && (
          <p className="text-center text-gray-600">Yükleniyor...</p>
        )}

        {state.status === 'error' && (
          <div role="alert" className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-800">
            Ürünler şu anda yüklenemiyor. Lütfen biraz sonra tekrar deneyin.
          </div>
        )}

        {state.status === 'ready' && state.products.length === 0 && (
          <p className="text-center text-gray-600">Şu anda listelenen ürün yok.</p>
        )}

        {state.status === 'ready' && state.products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {state.products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="bg-gradient-to-br from-green-400 to-green-600 h-48 flex items-center justify-center text-5xl">📦</div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  {product.description && <p className="text-gray-600 mb-4 text-sm">{product.description}</p>}
                  <p className="text-3xl font-bold text-green-600 mb-4">₺{Number(product.price).toLocaleString('tr-TR')}</p>
                  <Link
                    href={`/checkout?urun=${encodeURIComponent(String(product.id))}`}
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded text-center"
                  >
                    Satın Al
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-green-800 text-white py-8 mt-16 text-center">
        <p>&copy; 2026 Ziraati. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default Home;
