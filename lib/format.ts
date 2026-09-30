const tl = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' });

export function formatPrice(price: number | string): string {
  return tl.format(Number(price));
}

export type StockInfo = {
  /** Sepete eklenebilir mi */
  available: boolean;
  /** Gösterilecek etiket; stok takibi yoksa null */
  label: string | null;
  tone: 'ok' | 'low' | 'out';
};

/** Stok durumu: null = takip yok (satışta), 0 = tükendi, 1–3 = az kaldı. */
export function stockInfo(stock: number | null): StockInfo {
  if (stock === null) return { available: true, label: null, tone: 'ok' };
  if (stock <= 0) return { available: false, label: 'Tükendi', tone: 'out' };
  if (stock <= 3) return { available: true, label: `Son ${stock} adet`, tone: 'low' };
  return { available: true, label: 'Stokta', tone: 'ok' };
}

/** Meta açıklaması için düz metin özeti. */
export function summarize(text: string | null, max = 155): string | undefined {
  if (!text) return undefined;
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? flat.slice(0, max - 1).trimEnd() + '…' : flat;
}
