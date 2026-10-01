'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { clientIpFrom, siteUrlFrom, startPayment } from '@/lib/payments';

/** Ödemesi tamamlanmamış sipariş için iyzico ödeme sayfasını yeniden açar. */
export async function retryPayment(formData: FormData) {
  const publicId = String(formData.get('siparis') ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(publicId)) redirect('/');
  const h = await headers();
  const result = await startPayment(publicId, siteUrlFrom(h), clientIpFrom(h));
  redirect(result.ok ? result.url : `/siparis/${publicId}?odeme=hata`);
}
