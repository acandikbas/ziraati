'use client';

import { useSyncExternalStore } from 'react';

/**
 * Müşterinin teslimat bilgileri, isterse yalnızca kendi tarayıcısında (localStorage) saklanır;
 * bir sonraki siparişte form bunlarla doldurulur. Sunucuya ayrıca bir şey gönderilmez.
 */
export type SavedCustomer = { name: string; phone: string; email: string; city: string; district: string; address: string };

const KEY = 'ziraati-bilgilerim-v1';
const EVENT = 'ziraati-bilgilerim-degisti';
const FIELDS = ['name', 'phone', 'email', 'city', 'district', 'address'] as const;

let cachedRaw: string | null = null;
let cached: SavedCustomer | null = null;

function read(): SavedCustomer | null {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  cached = null;
  try {
    const data: unknown = raw ? JSON.parse(raw) : null;
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      if (FIELDS.every(f => typeof d[f] === 'string')) {
        cached = Object.fromEntries(FIELDS.map(f => [f, (d[f] as string).slice(0, 500)])) as SavedCustomer;
      }
    }
  } catch {
    // bozuk kayıt: yok say
  }
  return cached;
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function useSavedCustomer(): SavedCustomer | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function saveCustomer(data: FormData) {
  const c = Object.fromEntries(FIELDS.map(f => [f, String(data.get(f) ?? '').trim()]));
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENT));
}

export function forgetCustomer() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENT));
}
