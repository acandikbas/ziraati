'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { OPEN_DRAWER_EVENT, removeCartItem, useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';
import { useQuote } from '@/lib/useQuote';

/** Sepete ekleyince sağdan açılan sepet önizlemesi. */
export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCart();
  const { state, stale } = useQuote(items, open);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_DRAWER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_DRAWER_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const quote = state.status === 'ready' ? state.quote : null;
  const remaining = quote ? Math.max(0, FREE_SHIPPING_THRESHOLD - quote.subtotal) : 0;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sepet-onizleme-baslik"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 id="sepet-onizleme-baslik" className="text-lg font-bold text-gray-900">
            Sepetim <span className="font-normal text-gray-500">({count} ürün)</span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Kapat"
            className="rounded p-1 text-2xl leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto px-5 py-4 ${stale ? 'opacity-60' : ''}`}>
          {items.length === 0 ? (
            <p className="py-10 text-center text-gray-600">Sepetiniz boş.</p>
          ) : state.status === 'loading' ? (
            <p className="text-gray-600">Yükleniyor…</p>
          ) : state.status === 'error' ? (
            <p role="alert" className="text-red-700">{state.message}</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {state.quote.lines.map(line => (
                <li key={line.index} className="flex gap-3 py-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-gray-100 bg-white">
                    {line.imageUrl && <Image src={line.imageUrl} alt="" fill sizes="64px" className="object-contain" />}
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <Link href={line.href} onClick={() => setOpen(false)} className="line-clamp-2 font-semibold text-gray-900 hover:text-green-700">
                      {line.name}
                    </Link>
                    <p className="mt-1 text-gray-600">
                      {line.side && <span className="font-semibold">{line.side} · </span>}
                      {line.quantity} × {formatPrice(line.unitPrice)}
                    </p>
                    {line.problem && <p className="mt-1 font-semibold text-red-700">{line.problem}</p>}
                  </div>
                  <div className="flex shrink-0 flex-col items-end justify-between text-sm">
                    <span className="font-bold text-green-700">{formatPrice(line.lineTotal)}</span>
                    <button
                      type="button"
                      onClick={() => removeCartItem(line.index)}
                      disabled={stale}
                      className="text-red-700 underline"
                    >
                      Kaldır
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {quote && items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4">
            {remaining > 0 ? (
              <div className="mb-4">
                <p className="mb-2 text-sm text-gray-700">
                  Kargonun ücretsiz olması için <strong>{formatPrice(remaining)}</strong> daha ekleyin.
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200" aria-hidden>
                  <div className="h-full bg-green-600" style={{ width: `${Math.min(100, (quote.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
                </div>
              </div>
            ) : (
              <p className="mb-4 text-sm font-semibold text-green-800">🚚 Kargo ücretsiz!</p>
            )}
            <div className="mb-4 flex justify-between text-lg font-bold text-gray-900">
              <span>Ara toplam</span>
              <span>{formatPrice(quote.subtotal)}</span>
            </div>
            <Link
              href="/sepet"
              onClick={() => setOpen(false)}
              className="mb-2 block rounded-lg bg-green-600 py-3 text-center font-bold text-white hover:bg-green-700"
            >
              Sepete Git ve Siparişi Tamamla
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="block w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-800 hover:bg-gray-50"
            >
              Alışverişe Devam Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
