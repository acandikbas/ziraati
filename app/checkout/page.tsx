import { redirect } from 'next/navigation';

/** Eski "Satın Al" bağlantıları için: sipariş artık sepet sayfasından veriliyor. */
export default function CheckoutPage() {
  redirect('/sepet');
}
