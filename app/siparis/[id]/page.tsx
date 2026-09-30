import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { getOrderSummary, ORDER_STATUS } from '@/lib/orders';
import { ClearCart } from './ClearCart';

export const metadata: Metadata = { title: 'Sipariş Özeti', robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const order = await getOrderSummary((await params).id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <ClearCart />
      <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="mb-2 text-4xl">✅</p>
        <h1 className="mb-2 text-2xl font-bold text-green-800">Siparişiniz alındı</h1>
        <p className="text-gray-700">
          Sipariş numaranız: <strong className="font-mono">{order.order_no}</strong>
        </p>
        <p className="mt-2 text-sm text-gray-600">Durum: {ORDER_STATUS[order.status] ?? order.status}</p>
      </div>

      {order.status === 'odeme_bekliyor' && (
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
