'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

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
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white" suppressHydrationWarning>
      {/* ... Rest of JSX ... */}
      
      {/* Products Section - FIXED */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-green-800 mb-12 text-center">
          Öne Çıkan Ürünler
        </h2>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Ürünler yükleniyor...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(product => (
              // ... rest of map code ...
            ))}
          </div>
        )}
      </section>
      
      {/* ... Rest of JSX ... */}
    </div>
  );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
