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
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
        // Fallback to demo products if database is not ready
        setProducts([
          {
            id: 1,
            name: 'Traktör Parçaları',
            price: 5000,
            description: 'Kaliteli traktör yedek parçaları',
            stock: 10
          },
          {
            id: 2,
            name: 'Çapa Yedekleri',
            price: 2500,
            description: 'Dayanıklı çapa yedek parçaları',
            stock: 15
          },
          {
            id: 3,
            name: 'Dron Parçaları',
            price: 3000,
            description: 'Tarım teknolojisi dron parçaları',
            stock: 8
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white" suppressHydrationWarning>
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

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Ürünler yükleniyor...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(product => (