/**
 * Kargo kuralı (ikas'taki ayarın aynısı):
 * sipariş tutarı 500 TL ve üzeriyse ücretsiz, altındaysa 100 TL.
 * Sipariş adımında (Aşama 3) toplam da bu fonksiyonla hesaplanacak.
 */
export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_FEE = 100;

export function shippingFee(orderTotal: number): number {
  return orderTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
