'use client';

import Image from 'next/image';
import Link from 'next/link';
import { startTransition, useActionState, useState, useSyncExternalStore } from 'react';
import { useCart, removeCartItem, updateCartItem, type CartItem } from '@/lib/cart';
import { forgetCustomer, saveCustomer, useSavedCustomer } from '@/lib/customer';
import { formatPrice } from '@/lib/format';
import type { Quote } from '@/lib/orders';
import { useQuote } from '@/lib/useQuote';
import { SIDES } from '@/lib/sides';
import { CITIES, districtsOf } from '@/lib/turkey';
import { Combobox } from '@/components/Combobox';
import { placeOrder, type OrderFormState } from './actions';

const noop = () => () => {};

export function CartView() {
  const items = useCart();
  // Sepet tarayıcıda durur; sunucuda render edilirken "sepet boş" diye yanıp sönmesin
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const { state, stale } = useQuote(items);

  if (!hydrated) return <p className="text-gray-600">Sepet yükleniyor…</p>;
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
        <p className="mb-6 text-lg text-gray-700">Sepetiniz boş.</p>
        <Link href="/#urunler" className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">
          Alışverişe başla
        </Link>
      </div>
    );
  }
  if (state.status === 'loading') return <p className="text-gray-600">Sepet yükleniyor…</p>;
  if (state.status === 'error') return <p role="alert" className="text-red-700">{state.message}</p>;

  const { quote } = state;
  // Sepet değişti ama yeni fiyatlar henüz gelmedi: eski satırlar kısa süre soluk ve kilitli gösterilir
  return (
    <div className={`grid gap-8 lg:grid-cols-[1fr_380px] ${stale ? 'pointer-events-none opacity-60' : ''}`} aria-busy={stale}>
      <section aria-label="Sepetteki ürünler" className="flex flex-col gap-4">
        {quote.lines.map(line => (
          <CartLine key={line.index} line={line} item={items[line.index]} />
        ))}
      </section>

      <aside className="flex flex-col gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Sipariş Özeti</h2>
          <dl className="space-y-2 text-gray-700">
            <Row label="Ara toplam" value={formatPrice(quote.subtotal)} />
            <Row label="Kargo" value={quote.shipping === 0 ? 'Ücretsiz' : formatPrice(quote.shipping)} />
            <div className="border-t border-gray-200 pt-2">
              <Row label="Toplam" value={formatPrice(quote.total)} strong />
            </div>
          </dl>
        </div>
        {quote.canOrder && !stale ? (
          <CheckoutForm items={items} />
        ) : (
          <p role="alert" className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            Siparişe devam etmek için sepetteki uyarıları düzeltin.
          </p>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? 'text-lg font-bold text-gray-900' : ''}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function CartLine({ line, item }: { line: Quote['lines'][number]; item: CartItem | undefined }) {
  return (
    <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded bg-white">
        {line.imageUrl ? (
          <Image src={line.imageUrl} alt="" fill sizes="96px" className="object-contain" />
        ) : (
          <div className="h-full w-full bg-green-50" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Link href={line.href} className="font-semibold text-gray-900 hover:text-green-700">{line.name}</Link>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {line.hasSides && (
            <label className="flex items-center gap-1">
              Taraf:
              <select
                value={item?.side ?? ''}
                onChange={e => updateCartItem(line.index, { side: (e.target.value || null) as CartItem['side'] })}
                className="rounded border border-gray-300 px-2 py-1"
              >
                <option value="">Seçin</option>
                {SIDES.map(s => (
                  <option key={s} value={s}>
                    {s === 'Sağ + Sol' ? 'Sağ + Sol (takım)' : s} — {formatPrice(s === 'Sağ + Sol' ? line.pairPrice! : line.sidePrice!)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="flex items-center gap-1">
            Adet:
            <input
              type="number"
              min={1}
              max={99}
              value={item?.quantity ?? line.quantity}
              onChange={e => updateCartItem(line.index, { quantity: Number(e.target.value) })}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-center"
            />
          </label>
          <button type="button" onClick={() => removeCartItem(line.index)} className="text-red-700 underline">
            Kaldır
          </button>
        </div>
        {line.problem && <p className="text-sm font-semibold text-red-700">{line.problem}</p>}
      </div>
      <p className="shrink-0 font-bold text-green-700">{formatPrice(line.lineTotal)}</p>
    </div>
  );
}

const initialState: OrderFormState = { error: null, values: {} };

function CheckoutForm({ items }: { items: CartItem[] }) {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const saved = useSavedCustomer();
  // Hata dönmüşse girilen değerler, yoksa bu cihazda kayıtlı bilgiler
  const fromState = Object.keys(state.values).length > 0;
  const v: OrderFormState['values'] = fromState ? state.values : (saved ?? {});
  // Gönderirken bilgiler kaydedilince form yeniden kurulmasın diye anahtar o anki haliyle dondurulur
  const [frozenKey, setFrozenKey] = useState<string | null>(null);
  const liveKey = saved ? 'kayitli' : 'bos';
  const showSaved = saved && !fromState && !frozenKey;

  return (
    <form
      // Kayıtlı bilgiler tarayıcıda okunduğunda alanlar onlarla yeniden kurulur
      key={fromState ? 'girilen' : (frozenKey ?? liveKey)}
      // action={...} yerine onSubmit: React 19 action ile gönderilen formu hata durumunda da
      // sıfırlıyor; il/ilçe seçimleri kaybolmasın diye form elle gönderilir.
      onSubmit={e => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setFrozenKey(k => k ?? liveKey);
        if (data.get('hatirla')) saveCustomer(data);
        else forgetCustomer();
        startTransition(() => formAction(data));
      }}
      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">Teslimat Bilgileri</h2>
        {showSaved && (
          <button type="button" onClick={forgetCustomer} className="text-sm text-gray-600 underline hover:text-red-700">
            Kayıtlı bilgileri temizle
          </button>
        )}
      </div>
      {showSaved && (
        <p className="-mt-2 text-sm text-green-800">Önceki siparişinizdeki bilgiler dolduruldu, gerekirse değiştirebilirsiniz.</p>
      )}
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <Field label="Ad Soyad" name="name" autoComplete="name" defaultValue={v.name} minLength={3} maxLength={100} />
      <Field label="Cep Telefonu" name="phone" type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" defaultValue={v.phone} />
      <Field label="E-posta" name="email" type="email" autoComplete="email" defaultValue={v.email} maxLength={200} />
      <CityDistrict defaultCity={v.city} defaultDistrict={v.district} />
      <label className="flex flex-col gap-1 text-sm font-semibold text-gray-800">
        Açık Adres
        <textarea
          name="address"
          required
          minLength={10}
          maxLength={500}
          rows={3}
          autoComplete="street-address"
          defaultValue={v.address}
          className="rounded-lg border border-gray-300 px-3 py-2 font-normal"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-gray-800">
        Sipariş Notu (isteğe bağlı)
        <textarea name="note" maxLength={500} rows={2} defaultValue={v.note} className="rounded-lg border border-gray-300 px-3 py-2 font-normal" />
      </label>
      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input type="checkbox" name="hatirla" defaultChecked className="mt-1" />
        <span>
          Bilgilerimi sonraki siparişler için hatırla
          <span className="block text-xs text-gray-500">Yalnızca bu cihazda, tarayıcınızda saklanır.</span>
        </span>
      </label>
      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input type="checkbox" name="onay" required className="mt-1" />
        Bilgilerimin doğru olduğunu onaylıyorum.
      </label>

      <p aria-live="polite" className="min-h-5 text-sm font-semibold text-red-700">{state.error}</p>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-green-600 py-3 text-lg font-bold text-white hover:bg-green-700 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? 'Sipariş oluşturuluyor…' : 'Siparişi Oluştur'}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  ...rest
}: { label: string; name: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-gray-800">
      {label}
      <input name={name} type={type} required className="rounded-lg border border-gray-300 px-3 py-2 font-normal" {...rest} />
    </label>
  );
}

/** İl ve ilçe yazarak aranır; il seçilince yalnızca o ilin ilçeleri listelenir. */
function CityDistrict({ defaultCity, defaultDistrict }: { defaultCity?: string; defaultDistrict?: string }) {
  const [city, setCity] = useState(defaultCity && CITIES.includes(defaultCity) ? defaultCity : '');
  const districts = districtsOf(city);
  const [district, setDistrict] = useState(defaultDistrict && districts.includes(defaultDistrict) ? defaultDistrict : '');

  return (
    <div className="grid grid-cols-2 gap-3">
      <Combobox
        label="İl"
        name="city"
        options={CITIES}
        value={city}
        onChange={c => { if (c !== city) { setCity(c); setDistrict(''); } }}
        placeholder="İl yazın veya seçin"
        autoComplete="address-level1"
      />
      <Combobox
        key={city /* il değişince ilçe kutusu tamamen sıfırlanır */}
        label="İlçe"
        name="district"
        options={districts}
        value={district}
        onChange={setDistrict}
        placeholder={city ? 'İlçe yazın veya seçin' : 'Önce il seçin'}
        disabled={!city}
        autoComplete="address-level2"
      />
    </div>
  );
}
