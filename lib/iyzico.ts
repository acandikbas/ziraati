// Bu dosya yalnızca sunucuda çalışır; tarayıcı koduna eklenirse derleme hata verir.
import 'server-only';

import { createHmac, randomBytes } from 'node:crypto';

/**
 * iyzico REST istemcisi (Checkout Form). Resmî paket yerine doğrudan REST kullanılır;
 * paket daha önce Next.js derlemesini bozmuştu.
 * Kimlik doğrulama: IYZWSv2 / HMACSHA256 —
 * https://docs.iyzico.com/en/getting-started/preliminaries/authentication/hmacsha256-auth
 */
export type IyzicoConfig = { apiKey: string; secretKey: string; baseUrl: string };

export function iyzicoConfig(): IyzicoConfig | null {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  if (!apiKey || !secretKey) return null;
  return { apiKey, secretKey, baseUrl: (process.env.IYZICO_BASE_URL ?? 'https://sandbox-api.iyzipay.com').replace(/\/$/, '') };
}

/** Authorization başlığını üretir (test edilebilsin diye ayrı). */
export function iyzicoAuthHeaders(cfg: IyzicoConfig, path: string, body: string, randomKey: string) {
  const signature = createHmac('sha256', cfg.secretKey).update(randomKey + path + body).digest('hex');
  const auth = Buffer.from(`apiKey:${cfg.apiKey}&randomKey:${randomKey}&signature:${signature}`).toString('base64');
  return { Authorization: `IYZWSv2 ${auth}`, 'x-iyzi-rnd': randomKey };
}

async function call<T>(cfg: IyzicoConfig, path: string, payload: unknown): Promise<T> {
  const body = JSON.stringify(payload);
  const randomKey = `${Date.now()}${randomBytes(6).toString('hex')}`;
  const res = await fetch(cfg.baseUrl + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...iyzicoAuthHeaders(cfg, path, body, randomKey) },
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  });
  const data = (await res.json().catch(() => null)) as T | null;
  if (!data) throw new Error(`iyzico yanıtı okunamadı (HTTP ${res.status})`);
  return data;
}

export type BasketItem = { id: string; name: string; category1: string; itemType: 'PHYSICAL' | 'VIRTUAL'; price: string };
export type Address = { contactName: string; city: string; country: string; address: string };

export type InitializeRequest = {
  locale: 'tr';
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: 'TRY';
  basketId: string;
  paymentGroup: 'PRODUCT';
  callbackUrl: string;
  buyer: {
    id: string; name: string; surname: string; gsmNumber: string; email: string; identityNumber: string;
    registrationAddress: string; city: string; country: string; ip?: string;
  };
  shippingAddress: Address;
  billingAddress: Address;
  basketItems: BasketItem[];
};

export type InitializeResponse = {
  status: 'success' | 'failure';
  errorCode?: string;
  errorMessage?: string;
  token?: string;
  paymentPageUrl?: string;
  tokenExpireTime?: number;
};

export type RetrieveResponse = {
  status: 'success' | 'failure';
  errorCode?: string;
  errorMessage?: string;
  paymentStatus?: string;
  fraudStatus?: number;
  paymentId?: string;
  price?: number;
  paidPrice?: number;
  currency?: string;
  basketId?: string;
  conversationId?: string;
  token?: string;
};

export function initializeCheckoutForm(cfg: IyzicoConfig, req: InitializeRequest) {
  return call<InitializeResponse>(cfg, '/payment/iyzipos/checkoutform/initialize/auth/ecom', req);
}

export function retrieveCheckoutForm(cfg: IyzicoConfig, token: string, conversationId?: string) {
  return call<RetrieveResponse>(cfg, '/payment/iyzipos/checkoutform/auth/ecom/detail', {
    locale: 'tr',
    conversationId,
    token,
  });
}
