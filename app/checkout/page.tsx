'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock?: number;
}

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setProducts([
          { id: 1, name: 'Traktör Parçaları', price: 5000, description: 'Kaliteli traktör yedek parçaları', stock: 10 },
          { id: 2, name: 'Çapa Yedekleri', price: 2500, description: 'Dayanıklı çapa yedek parçaları', stock: 15 },
          { id: 3, name: 'Dron Parçaları', price: 3000, description: 'Tarım teknolojisi dron parçaları', stock: 8 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
        {loading && <div className="text-center text-gray-600">Yükleniyor...</div>}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-br from-green-400 to-green-600 h-48 flex items-center justify-center text-5xl">📦</div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  <p className="text-3xl font-bold text-green-600 mb-4">₺{product.price.toLocaleString('tr-TR')}</p>
                  <Link href={`/checkout?product=${product.name}&price=${product.price}`} className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded text-center">
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