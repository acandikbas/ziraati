'use client';

import { useEffect } from 'react';
import { clearCart } from '@/lib/cart';

/** Sipariş başarıyla oluşunca tarayıcıdaki sepeti boşaltır. */
export function ClearCart() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
