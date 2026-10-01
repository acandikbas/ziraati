import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { getOrderSummary, ORDER_STATUS } from '@/lib/orders';
import { ClearCart } from './ClearCart';
import { paymentsEnabled, PAYMENT_TIMEOUT_MINUTES } from '@/lib/payments';
import { retryPayment } from './actions';

export const metadata: Metadata = { title: 'Sipariş Özeti', robots: { index: false } };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { odeme } = await searchParams;
  const order = await getOrderSummary(id);
  if (!order) notFound();
  const online = paymentsEnabled();
  const paid = order.status !== 'odeme_bekliyor' && order.status !== 'iptal';

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <ClearCart />
      {paid || !online ? (
        <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <p className="mb-2 text-4xl">✅</p>
          <h1 className="mb-2 text-2xl font-bold text-green-800">{paid ? 'Ödemeniz alındı, teşekkürler!' : 'Siparişiniz alındı'}</h1>
          <p className="text-gray-700">
            Sipariş numaranız: <strong className="font-mono">{order.order_no}</strong>
          </p>
          <p className="mt-2 text-sm text-gray-600">Durum: {ORDER_STATUS[order.status] ?? order.status}</p>
        </div>
      ) : order.status === 'iptal' ? (
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">Sipariş iptal edildi</h1>
          <p className="text-gray-700">
            <strong className="font-mono">{order.order_no}</strong> numaralı sipariş, ödeme {PAYMENT_TIMEOUT_MINUTES} dakika
            içinde tamamlanmadığı için iptal edildi. Ürünleri yeniden sepete ekleyerek yeni sipariş verebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-amber-900">
            {odeme === 'basarisiz' ? 'Ödeme tamamlanamadı' : odeme === 'hata' ? 'Ödeme sayfası açılamadı' : 'Ödeme bekleniyor'}
          </h1>
          <p className="mb-4 text-gray-700">
            Sipariş numaranız: <strong className="font-mono">{order.order_no}</strong>.{' '}
            {odeme === 'basarisiz'
              ? 'Kartınızdan ödeme alınmadı. Bilgilerinizi kontrol edip tekrar deneyebilirsiniz.'
              : `Siparişiniz ödeme yapıldığında onaylanır; ${PAYMENT_TIMEOUT_MINUTES} dakika içinde ödenmezse iptal edilir.`}
          </p>
          <form action={retryPayment}>
            <input type="hidden" name="siparis" value={id} />
            <button type="submit" className="rounded-lg bg-green-600 px-8 py-3 text-lg font-bold text-white hover:bg-green-700">
              {odeme ? 'Ödemeyi Tekrar Dene' : 'Ödemeye Geç'}
            </button>
          </form>
        </div>
      )}

      {!online && order.status === 'odeme_bekliyor' && (
        <p className="mb-8 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          Online ödeme adımı çok yakında eklenecek. Siparişinizi onaylamak ve ödeme için sizinle
          verdiğiniz telefon numarasından iletişime geçeceğiz.
        </p>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Sipariş Detayı</h2>
        <ul className="divide-y divide-gray-100">
          {order.items.map((i, n) => (
            <li key={n} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {i.product_name}
                {i.side && <span className="font-semibold"> — {i.side}</span>}
                <span className="text-gray-500"> × {i.quantity}</span>
              </span>
              <span className="shrink-0 font-semibold">{formatPrice(i.line_total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-sm text-gray-700">
          <div className="flex justify-between"><dt>Ara toplam</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          <div className="flex justify-between">
            <dt>Kargo</dt><dd>{Number(order.shipping_fee) === 0 ? 'Ücretsiz' : formatPrice(order.shipping_fee)}</dd>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900"><dt>Toplam</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
      </section>

      <p className="mt-6 text-center text-sm text-gray-600">
        Bu sayfanın adresini kaydederek siparişinizin durumunu daha sonra da görebilirsiniz.
      </p>
      <div className="mt-6 text-center">
        <Link href="/" className="font-semibold text-green-700 underline">Alışverişe devam et</Link>
      </div>
    </div>
  );
}
