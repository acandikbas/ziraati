'use server';

import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { quoteCart, sanitizeCart, type CartInput, type Quote } from '@/lib/orders';
import { isValidLocation } from '@/lib/turkey';

/** Sepet sayfası için güncel fiyat/stok özeti. */
export async function getQuote(rawItems: unknown): Promise<Quote | { error: string }> {
  try {
    return await quoteCart(sanitizeCart(rawItems));
  } catch (err) {
    console.error('[sepet/getQuote]', err);
    return { error: 'Sepet şu anda yüklenemiyor. Lütfen biraz sonra tekrar deneyin.' };
  }
}

const FIELDS = ['name', 'phone', 'email', 'city', 'district', 'address', 'note'] as const;
type Field = (typeof FIELDS)[number];

export type OrderFormState = {
  error: string | null;
  values: Partial<Record<Field, string>>;
};

export async function placeOrder(_prev: OrderFormState, formData: FormData): Promise<OrderFormState> {
  const values = Object.fromEntries(
    FIELDS.map(f => [f, String(formData.get(f) ?? '').slice(0, 600)]),
  ) as Record<Field, string>;

  let items: CartInput[];
  try {
    items = sanitizeCart(JSON.parse(String(formData.get('items') ?? '[]')));
  } catch {
    items = [];
  }
  if (items.length === 0) return { error: 'Sepetiniz boş.', values };
  if (!isValidLocation(values.city, values.district)) {
    return { error: 'Lütfen listeden il ve ilçe seçin.', values };
  }
  if (formData.get('onay') !== 'on') {
    return { error: 'Devam etmek için sipariş bilgilerinin doğruluğunu onaylayın.', values };
  }

  // Tutar, stok ve kargo burada değil veritabanındaki create_order() içinde hesaplanır.
  const { data, error } = await getSupabase().rpc('create_order', {
    p_customer: values,
    p_items: items.map(i => ({ product_id: i.productId, quantity: i.quantity, side: i.side })),
  });

  if (error) {
    if (error.code === 'ZR001') return { error: error.message, values };
    console.error('[sepet/placeOrder]', error);
    return { error: 'Sipariş şu anda oluşturulamadı. Lütfen biraz sonra tekrar deneyin.', values };
  }

  const publicId = (data as { public_id?: string } | null)?.public_id;
  if (!publicId) {
    console.error('[sepet/placeOrder] beklenmeyen yanıt', data);
    return { error: 'Sipariş şu anda oluşturulamadı. Lütfen biraz sonra tekrar deneyin.', values };
  }
  redirect(`/siparis/${publicId}`);
}
