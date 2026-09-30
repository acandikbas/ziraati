import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/SiteHeader';
import { CartDrawer } from '@/components/CartDrawer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ziraati - Tarım Makineleri & Yedek Parça',
    template: '%s | Ziraati',
  },
  description: 'Traktör lambaları, stop ve sinyal camları, çalışma farları ve tarım makinesi yedek parçaları.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning: tarayıcı eklentileri <html>'e kendi özelliklerini ekleyebiliyor;
  // bu, zararsız "hydration mismatch" uyarısını bastırır (yalnızca <html> etiketi için geçerli).
  return (
    <html lang="tr" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CartDrawer />
      </body>
    </html>
  );
}
