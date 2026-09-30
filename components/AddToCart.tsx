'use client';

import Link from 'next/link';
import { useState } from 'react';
import { addToCart, openCartDrawer, type Side } from '@/lib/cart';

export function AddToCart({
  productId,
  sideRequired,
  available,
}: {
  productId: number;
  sideRequired: boolean;
  available: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [side, setSide] = useState<Side | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!available) {
    return (
      <button type="button" disabled className="cursor-not-allowed rounded-lg bg-gray-300 py-3 text-lg font-bold text-gray-600">
        Tükendi
      </button>
    );
  }

  function add() {
    if (sideRequired && !side) {
      setError('Lütfen Sağ veya Sol seçin.');
      return;
    }
    addToCart({ productId, quantity, side: sideRequired ? side : null });
    setError(null);
    setAdded(true);
    openCartDrawer();
  }

  return (
    <div className="flex flex-col gap-4">
      {sideRequired && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-gray-800">Taraf seçin</legend>
          <div className="flex gap-3">
            {(['Sağ', 'Sol'] as const).map(s => (
              <label
                key={s}
                className={`flex-1 cursor-pointer rounded-lg border-2 py-2 text-center font-semibold ${
                  side === s ? 'border-green-600 bg-green-50 text-green-800' : 'border-gray-300 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="taraf"
                  value={s}
                  checked={side === s}
                  onChange={() => { setSide(s); setError(null); setAdded(false); }}
                  className="sr-only"
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          Adet
          <input
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={e => { setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1))); setAdded(false); }}
            className="w-20 rounded-lg border border-gray-300 px-3 py-2.5 text-center"
          />
        </label>
        <button
          type="button"
          onClick={add}
          className="flex-1 rounded-lg bg-green-600 py-3 text-lg font-bold text-white hover:bg-green-700"
        >
          Sepete Ekle
        </button>
      </div>

      <p aria-live="polite" className="min-h-6 text-sm">
        {error && <span className="font-semibold text-red-700">{error}</span>}
        {added && (
          <span className="text-green-800">
            ✓ Sepete eklendi.{' '}
            <Link href="/sepet" className="font-semibold underline">Sepete git</Link>
          </span>
        )}
      </p>
    </div>
  );
}
