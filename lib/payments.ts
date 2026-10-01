import { getSupabaseAdmin } from './supabase-admin';
import { iyzicoConfig, initializeCheckoutForm, retrieveCheckoutForm, type BasketItem } from './iyzico';

/** Ödenmeyen siparişler bu süreden sonra iptal edilir (iyzico ödeme sayfası ~30 dk geçerli). */
export const PAYMENT_TIMEOUT_MINUTES = 60;

/**
 * Online ödeme açık mı? iyzico anahtarları ve Supabase gizli anahtarı tanımlıysa açıktır.
 * Kapalıyken site siparişi "ödeme bekleniyor" olarak alır (Aşama 3 davranışı).
 */
export function paymentsEnabled(): boolean {
  return iyzicoConfig() !== null && getSupabaseAdmin() !== null;
}

/** Süresi dolan ödenmemiş siparişleri iptal eder (hata olsa da sipariş akışını durdurmaz). */
export async function expireUnpaidOrders() {
  const admin = getSupabaseAdmin();
  if (!admin) return;
  const { error } = await admin.rpc('expire_unpaid_orders', { p_minutes: PAYMENT_TIMEOUT_MINUTES });
  if (error) console.error('[odeme] expire_unpaid_orders', error);
}

type OrderRow = {
  id: number; public_id: string; order_no: string; status: string;
  customer_name: string; phone: string; email: string; city: string; district: string; address: string;
  shipping_fee: number | string; total: number | string; payment_token: string | null;
};
type ItemRow = { id: number; product_name: string; side: string | null; line_total: number | string };

const kurus = (v: number | string) => Math.round(Number(v) * 100);
const tl = (k: number) => (k / 100).toFixed(2);

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { name: parts[0], surname: parts[0] };
  return { name: parts.slice(0, -1).join(' '), surname: parts[parts.length - 1] };
}

function gsm(phone: string) {
  const d = phone.replace(/\D/g, '');
  return '+90' + d.slice(-10);
}

export type StartResult = { ok: true; url: string } | { ok: false; reason: 'kapali' | 'bulunamadi' | 'durum' | 'hata' };

/**
 * Sipariş için iyzico ödeme sayfası açar ve müşterinin yönlendirileceği adresi döner.
 * Tutarlar veritabanındaki siparişten alınır.
 */
export async function startPayment(publicId: string, siteUrl: string, ip?: string): Promise<StartResult> {
  const cfg = iyzicoConfig();
  const admin = getSupabaseAdmin();
  if (!cfg || !admin) return { ok: false, reason: 'kapali' };

  const { data: order, error } = await admin.from('orders').select('*').eq('public_id', publicId).maybeSingle<OrderRow>();
  if (error) { console.error('[odeme] sipariş okunamadı', error); return { ok: false, reason: 'hata' }; }
  if (!order) { console.warn('[odeme] sipariş bulunamadı (gizli anahtar doğru mu?)', publicId); return { ok: false, reason: 'bulunamadi' }; }
  if (order.status !== 'odeme_bekliyor') return { ok: false, reason: 'durum' };

  const { data: items, error: itemsError } = await admin
    .from('order_items').select('id, product_name, side, line_total').eq('order_id', order.id).order('id')
    .returns<ItemRow[]>();
  if (itemsError || !items?.length) { console.error('[odeme] kalemler okunamadı', itemsError); return { ok: false, reason: 'hata' }; }

  const basket: BasketItem[] = items.map(i => ({
    id: `K${i.id}`,
    name: (i.side ? `${i.product_name} - ${i.side}` : i.product_name).slice(0, 250),
    category1: 'Traktör Yedek Parça',
    itemType: 'PHYSICAL',
    price: tl(kurus(i.line_total)),
  }));
  if (kurus(order.shipping_fee) > 0) {
    basket.push({ id: 'KARGO', name: 'Kargo', category1: 'Kargo', itemType: 'PHYSICAL', price: tl(kurus(order.shipping_fee)) });
  }
  const sum = basket.reduce((s, b) => s + kurus(b.price), 0);
  if (sum !== kurus(order.total)) {
    console.error('[odeme] sepet toplamı sipariş toplamıyla tutmuyor', order.order_no, sum, order.total);
    return { ok: false, reason: 'hata' };
  }

  const { name, surname } = splitName(order.customer_name);
  const address = { contactName: order.customer_name, city: order.city, country: 'Turkey', address: `${order.address}, ${order.district}/${order.city}` };

  try {
    const res = await initializeCheckoutForm(cfg, {
      locale: 'tr',
      conversationId: order.public_id,
      price: tl(sum),
      paidPrice: tl(sum),
      currency: 'TRY',
      basketId: order.order_no,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${siteUrl}/odeme/sonuc`,
      buyer: {
        id: order.public_id,
        name,
        surname,
        gsmNumber: gsm(order.phone),
        email: order.email,
        // TC kimlik no toplanmıyor; iyzico bu alanı zorunlu tutuyor ve genel kullanımda bu değeri kabul ediyor.
        identityNumber: '11111111111',
        registrationAddress: address.address,
        city: order.city,
        country: 'Turkey',
        ...(ip ? { ip } : {}),
      },
      shippingAddress: address,
      billingAddress: address,
      basketItems: basket,
    });
    if (res.status !== 'success' || !res.token || !res.paymentPageUrl) {
      console.error('[odeme] iyzico başlatma başarısız', order.order_no, res.errorCode, res.errorMessage);
      return { ok: false, reason: 'hata' };
    }
    const { error: upError } = await admin.from('orders').update({ payment_token: res.token }).eq('id', order.id);
    if (upError) { console.error('[odeme] token kaydedilemedi', upError); return { ok: false, reason: 'hata' }; }
    return { ok: true, url: res.paymentPageUrl };
  } catch (err) {
    console.error('[odeme] iyzico erişilemedi', err);
    return { ok: false, reason: 'hata' };
  }
}

export type CompleteResult = { publicId: string | null; outcome: 'basarili' | 'basarisiz' };

/**
 * iyzico'nun callback'iyle gelen token için ödeme sonucunu iyzico'dan sorgular, doğrular
 * ve başarılıysa siparişi "ödendi" yapar. Tarayıcıdan gelen hiçbir veriye güvenilmez; yalnızca token kullanılır.
 */
export async function completePayment(token: string): Promise<CompleteResult> {
  const cfg = iyzicoConfig();
  const admin = getSupabaseAdmin();
  if (!cfg || !admin || !/^[A-Za-z0-9-]{10,100}$/.test(token)) return { publicId: null, outcome: 'basarisiz' };

  const { data: order } = await admin.from('orders').select('public_id, order_no, total, status')
    .eq('payment_token', token).maybeSingle<{ public_id: string; order_no: string; total: number | string; status: string }>();
  if (!order) return { publicId: null, outcome: 'basarisiz' };
  if (order.status === 'odendi') return { publicId: order.public_id, outcome: 'basarili' };

  try {
    const r = await retrieveCheckoutForm(cfg, token, order.public_id);
    const verified =
      r.status === 'success' &&
      r.paymentStatus === 'SUCCESS' &&
      Number(r.fraudStatus) === 1 &&
      r.token === token &&
      r.basketId === order.order_no &&
      r.conversationId === order.public_id &&
      r.currency === 'TRY' &&
      Number(r.paidPrice) >= Number(r.price);
    if (!verified) {
      console.warn('[odeme] ödeme doğrulanamadı', order.order_no, r.status, r.paymentStatus, r.fraudStatus, r.errorCode, r.errorMessage);
      return { publicId: order.public_id, outcome: 'basarisiz' };
    }
    const { data: result, error } = await admin.rpc('mark_order_paid', {
      p_public_id: order.public_id, p_token: token, p_payment_id: String(r.paymentId ?? ''), p_paid_price: Number(r.price),
    });
    if (error || (result !== 'odendi' && result !== 'zaten_odendi')) {
      console.error('[odeme] sipariş ödendi yapılamadı', order.order_no, error ?? result);
      return { publicId: order.public_id, outcome: 'basarisiz' };
    }
    return { publicId: order.public_id, outcome: 'basarili' };
  } catch (err) {
    console.error('[odeme] iyzico sonucu sorgulanamadı', err);
    return { publicId: order.public_id, outcome: 'basarisiz' };
  }
}

/** Callback adresi için sitenin kök adresi: SITE_URL tanımlıysa o, değilse isteğin başlıkları. */
export function siteUrlFrom(h: Headers): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export function clientIpFrom(h: Headers): string | undefined {
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || undefined;
  return ip && /^[0-9a-fA-F.:]{3,45}$/.test(ip) ? ip : undefined;
}
