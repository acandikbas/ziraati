'use client';

import { useEffect, useState } from 'react';
import type { CartItem } from './cart';
import type { Quote } from './orders';
import { getQuote } from '@/app/sepet/actions';

export type QuoteState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; quote: Quote; key: string };

/**
 * Sepetin güncel fiyat/stok özetini sunucudan alır; sepet her değiştiğinde yeniler.
 * `stale`: sepet değişti ama yeni özet henüz gelmedi.
 */
export function useQuote(items: CartItem[], enabled = true) {
  const [state, setState] = useState<QuoteState>({ status: 'loading' });
  const key = JSON.stringify(items);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    getQuote(JSON.parse(key)).then(r => {
      if (cancelled) return;
      setState('error' in r ? { status: 'error', message: r.error } : { status: 'ready', quote: r, key });
    });
    return () => {
      cancelled = true;
    };
  }, [key, enabled]);

  const stale = state.status === 'ready' && state.key !== key;
  return { state, stale };
}
