'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { openCartDrawer, useCart } from '@/lib/cart';

export function CartLink() {
  const count = useCart().reduce((n, i) => n + i.quantity, 0);
  const pathname = usePathname();
  return (
    <Link
      href="/sepet"
      onClick={e => {
        if (pathname === '/sepet' || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        openCartDrawer();
      }}
      className="flex shrink-0 items-center gap-2 rounded-lg bg-green-900 px-4 py-2.5 font-semibold text-white hover:bg-green-950"
    >
      <span aria-hidden>🛒</span>
      Sepet
      {count > 0 && (
        <span className="rounded-full bg-white px-2 text-sm font-bold text-green-800" aria-label={`${count} ürün`}>
          {count}
        </span>
      )}
    </Link>
  );
}
