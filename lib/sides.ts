/**
 * Sağ/Sol seçimli lambalar: products.pair_price doluysa müşteri taraf seçer.
 *   price      = tek taraf (Sağ veya Sol) fiyatı
 *   pair_price = Sağ + Sol takım fiyatı
 * Sipariş tutarını asıl hesaplayan veritabanındaki create_order() fonksiyonudur;
 * buradaki hesap yalnızca gösterim içindir ve onunla aynı kuralı izler.
 */
export const SIDES = ['Sağ', 'Sol', 'Sağ + Sol'] as const;
export type Side = (typeof SIDES)[number];

export function isSide(x: unknown): x is Side {
  return typeof x === 'string' && (SIDES as readonly string[]).includes(x);
}

export function hasSides(pairPrice: number | string | null | undefined): boolean {
  return pairPrice !== null && pairPrice !== undefined;
}

export function unitPriceFor(side: Side | null, price: number | string, pairPrice: number | string | null): number {
  return side === 'Sağ + Sol' && pairPrice !== null ? Number(pairPrice) : Number(price);
}

/** Stok parça sayısıdır: takım 2 parça. */
export function piecesFor(side: Side | null, quantity: number): number {
  return quantity * (side === 'Sağ + Sol' ? 2 : 1);
}
