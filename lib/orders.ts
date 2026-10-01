import { getSupabase } from './supabase';
import { shippingFee } from './shipping';
import { hasSides, isSide, piecesFor, unitPriceFor, type Side } from './sides';

export type { Side };
export type CartInput = { productId: number; quantity: number; side: Side | null };

export type QuoteLine = {
  index: number;
  productId: number;
  name: string;
  href: string;
  imageUrl: string | null;
  /** Ürün Sağ/Sol seçimli mi */
  hasSides: boolean;
  /** Seçim yapılabilecek fiyatlar (yalnızca hasSides ise) */
  sidePrice: number | null;
  pairPrice: number | null;
  side: Side | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** Doluysa bu satır sipariş edilemez */
  problem: string | null;
};

export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  shipping: number;
  total: number;
  canOrder: boolean;
};

/** Tarayıcıdan gelen sepeti temizler: yalnızca geçerli id/adet/taraf kalır. */
export function sanitizeCart(raw: unknown): CartInput[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 30)
    .map(x => (x && typeof x === 'object' ? (x as Record<string, unknown>) : {}))
    .filter(x => Number.isInteger(x.productId) && (x.productId as number) > 0)
    .map(x => ({
      productId: x.productId as number,
      quantity: Math.max(1, Math.min(99, Math.trunc(Number(x.quantity)) || 1)),
      side: isSide(x.side) ? x.side : null,
    }));
}

/**
 * Sepetin güncel fiyatlarla özeti (yalnızca gösterim içindir).
 * Asıl tutarı sipariş anında veritabanındaki create_order() hesaplar.
 */
export async function quoteCart(items: CartInput[]): Promise<Quote> {
  if (items.length === 0) return { lines: [], subtotal: 0, shipping: 0, total: 0, canOrder: false };

  const ids = [...new Set(items.map(i => i.productId))];
  const { data, error } = await getSupabase()
    .from('products')
    .select('id, slug, name, price, pair_price, image_url, stock')
    .in('id', ids);
  if (error) throw error;
  const byId = new Map((data ?? []).map(p => [p.id as number, p]));

  // Aynı ürünün toplam parça sayısı stokla karşılaştırılır (takım = 2 parça)
  const wanted = new Map<number, number>();
  for (const i of items) {
    const sided = hasSides(byId.get(i.productId)?.pair_price);
    wanted.set(i.productId, (wanted.get(i.productId) ?? 0) + piecesFor(sided ? i.side : null, i.quantity));
  }

  const lines: QuoteLine[] = items.map((item, index) => {
    const p = byId.get(item.productId);
    if (!p) {
      return {
        index, productId: item.productId, name: 'Satıştan kaldırılmış ürün', href: '/', imageUrl: null,
        hasSides: false, sidePrice: null, pairPrice: null, side: null, quantity: item.quantity, unitPrice: 0, lineTotal: 0,
        problem: 'Bu ürün artık satışta değil, lütfen sepetten çıkarın.',
      };
    }
    const sided = hasSides(p.pair_price);
    const side = sided ? item.side : null;
    const unitPrice = unitPriceFor(side, p.price, p.pair_price);
    let problem: string | null = null;
    if (sided && !side) problem = 'Lütfen Sağ, Sol veya Sağ + Sol seçin.';
    else if (p.stock !== null && (wanted.get(p.id) ?? 0) > p.stock)
      problem = p.stock > 0 ? `Stokta yalnızca ${p.stock} adet var.` : 'Bu ürün tükendi.';
    return {
      index, productId: p.id, name: p.name, href: `/urun/${p.slug ?? p.id}`, imageUrl: p.image_url,
      hasSides: sided, sidePrice: sided ? Number(p.price) : null, pairPrice: sided ? Number(p.pair_price) : null, side,
      quantity: item.quantity, unitPrice, lineTotal: unitPrice * item.quantity, problem,
    };
  });

  const subtotal = lines.reduce((s, l) => s + (l.problem ? 0 : l.lineTotal), 0);
  const shipping = subtotal > 0 ? shippingFee(subtotal) : 0;
  return { lines, subtotal, shipping, total: subtotal + shipping, canOrder: lines.every(l => !l.problem) };
}

export type OrderSummary = {
  order_no: string;
  status: string;
  created_at: string;
  customer_name: string;
  city: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  items: { product_name: string; side: Side | null; quantity: number; unit_price: number; line_total: number }[];
};

export async function getOrderSummary(publicId: string): Promise<OrderSummary | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(publicId)) return null;
  const { data, error } = await getSupabase().rpc('get_order_summary', { p_public_id: publicId });
  if (error) throw error;
  return (data as OrderSummary | null) ?? null;
}

export const ORDER_STATUS: Record<string, string> = {
  odeme_bekliyor: 'Ödeme bekleniyor',
  odendi: 'Ödendi',
  hazirlaniyor: 'Hazırlanıyor',
  kargoda: 'Kargoda',
  teslim_edildi: 'Teslim edildi',
  iptal: 'İptal edildi',
};
