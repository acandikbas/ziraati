// Bu dosya yalnızca sunucuda çalışır; tarayıcı koduna eklenirse derleme hata verir.
import 'server-only';

import { createHmac, randomBytes } from 'node:crypto';
import http from 'node:http';
import https from 'node:https';

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

/** Bağlantı kurulamadıysa (istek iyzico'ya hiç ulaşmadıysa) yeniden denemek güvenlidir. */
const RETRYABLE = new Set(['ZR_CONNECT_TIMEOUT', 'ECONNREFUSED', 'ENETUNREACH', 'EHOSTUNREACH', 'EAI_AGAIN', 'ENOTFOUND']);
const CONNECT_TIMEOUT_MS = 30_000; // mobil ağlarda ilk bağlantı 10 sn'yi aşabiliyor
const TOTAL_TIMEOUT_MS = 45_000;

// Bağlantı açık tutulur: ilk (yavaş olabilen) bağlantıdan sonra istekler aynı bağlantıdan gider
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 10 });
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 10 });

type RawResponse = { status: number; text: string; sent: boolean };

function post(url: URL, headers: Record<string, string>, body: string): Promise<RawResponse> {
  const isHttps = url.protocol === 'https:';
  return new Promise((resolve, reject) => {
    let sent = false;
    const req = (isHttps ? https : http).request(
      url,
      {
        method: 'POST',
        agent: isHttps ? httpsAgent : httpAgent,
        headers: { ...headers, 'Content-Length': Buffer.byteLength(body).toString() },
      },
      res => {
        let text = '';
        res.setEncoding('utf8');
        res.on('data', chunk => (text += chunk));
        res.on('end', () => { clearTimeout(total); resolve({ status: res.statusCode ?? 0, text, sent: true }); });
        res.on('error', err => { clearTimeout(total); reject(Object.assign(err, { sent: true })); });
      },
    );
    const total = setTimeout(() => req.destroy(Object.assign(new Error('iyzico isteği zaman aşımına uğradı'), { code: 'ZR_TOTAL_TIMEOUT' })), TOTAL_TIMEOUT_MS);
    req.on('socket', socket => {
      if (!socket.connecting) return; // açık bağlantı yeniden kullanılıyor
      const t = setTimeout(
        () => req.destroy(Object.assign(new Error(`iyzico'ya ${CONNECT_TIMEOUT_MS / 1000} sn içinde bağlanılamadı`), { code: 'ZR_CONNECT_TIMEOUT' })),
        CONNECT_TIMEOUT_MS,
      );
      socket.once(isHttps ? 'secureConnect' : 'connect', () => { sent = true; clearTimeout(t); });
      socket.once('close', () => clearTimeout(t));
    });
    req.on('error', err => { clearTimeout(total); reject(Object.assign(err, { sent })); });
    req.end(body);
  });
}

async function call<T>(cfg: IyzicoConfig, path: string, payload: unknown): Promise<T> {
  const body = JSON.stringify(payload);
  const url = new URL(cfg.baseUrl + path);
  for (let attempt = 1; ; attempt++) {
    // Her denemede yeni randomKey ve imza
    const randomKey = `${Date.now()}${randomBytes(6).toString('hex')}`;
    try {
      const res = await post(url, {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...iyzicoAuthHeaders(cfg, path, body, randomKey),
      }, body);
      let data: T | null = null;
      try { data = JSON.parse(res.text) as T; } catch { /* aşağıda */ }
      if (!data) throw new Error(`iyzico yanıtı okunamadı (HTTP ${res.status})`);
      return data;
    } catch (err) {
      const e = err as { code?: string; sent?: boolean };
      // Yalnızca istek iyzico'ya hiç ulaşmadıysa yeniden dene (çift işlem riski yok)
      if (attempt < 2 && !e.sent && e.code && RETRYABLE.has(e.code)) {
        console.warn(`[odeme] iyzico bağlantısı kurulamadı (${e.code}), yeniden deneniyor`);
        continue;
      }
      throw err;
    }
  }
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
