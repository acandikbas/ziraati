'use client';

import { useSyncExternalStore } from 'react';
import { isSide, type Side } from './sides';

export type { Side };

/**
 * Sepet tarayıcıda (localStorage) tutulur ve yalnızca ürün id, adet ve taraf bilgisini içerir.
 * Fiyat bilerek saklanmaz: gösterilen fiyatlar sunucudan, sipariş tutarı veritabanından gelir.
 */
export type CartItem = { productId: number; quantity: number; side: Side | null };

const KEY = 'ziraati-sepet-v1';
const EVENT = 'ziraati-sepet-degisti';
export const MAX_LINES = 30;
const EMPTY: CartItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function isItem(x: unknown): x is CartItem {
  if (!x || typeof x !== 'object') return false;
  const i = x as Record<string, unknown>;
  return (
    Number.isInteger(i.productId) && (i.productId as number) > 0 &&
    Number.isInteger(i.quantity) && (i.quantity as number) >= 1 && (i.quantity as number) <= 99 &&
    (i.side === null || isSide(i.side))
  );
}

function read(): CartItem[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    const data: unknown = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(data) ? data.filter(isItem).slice(0, MAX_LINES) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function write(items: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_LINES)));
  } catch {
    // Gizli sekme vb.: sepet bu sayfada çalışmaya devam etmez ama site bozulmaz
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange); // diğer sekmeler
  window.addEventListener(EVENT, onChange); // bu sekme
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function addToCart(item: CartItem) {
  const items = [...read()];
  const i = items.findIndex(x => x.productId === item.productId && x.side === item.side);
  if (i >= 0) items[i] = { ...items[i], quantity: Math.min(99, items[i].quantity + item.quantity) };
  else items.push(item);
  write(items);
}

export function updateCartItem(index: number, patch: Partial<Pick<CartItem, 'quantity' | 'side'>>) {
  const items = [...read()];
  if (!items[index]) return;
  const next = { ...items[index], ...patch };
  next.quantity = Math.max(1, Math.min(99, Math.trunc(next.quantity) || 1));
  items[index] = next;
  write(items);
}

export function removeCartItem(index: number) {
  write(read().filter((_, i) => i !== index));
}

export function clearCart() {
  write([]);
}

/** Sepet önizleme panelini açar (CartDrawer dinler). */
export const OPEN_DRAWER_EVENT = 'ziraati-sepet-onizleme';
export function openCartDrawer() {
  window.dispatchEvent(new Event(OPEN_DRAWER_EVENT));
}
