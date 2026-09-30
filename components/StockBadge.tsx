import { stockInfo } from '@/lib/format';

const tones = {
  ok: 'bg-green-100 text-green-800',
  low: 'bg-amber-100 text-amber-800',
  out: 'bg-gray-200 text-gray-600',
} as const;

export function StockBadge({ stock }: { stock: number | null }) {
  const info = stockInfo(stock);
  if (!info.label) return null;
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[info.tone]}`}>
      {info.label}
    </span>
  );
}
