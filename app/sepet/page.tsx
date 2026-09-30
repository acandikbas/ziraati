import type { Metadata } from 'next';
import { CartView } from './CartView';

export const metadata: Metadata = { title: 'Sepetim', robots: { index: false } };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-green-800">Sepetim</h1>
      <CartView />
    </div>
  );
}
