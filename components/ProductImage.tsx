import Image from 'next/image';

/** Kare ürün görseli; fotoğrafı olmayan ürünlerde sade bir yer tutucu gösterir. */
export function ProductImage({
  src,
  alt,
  sizes,
  eager = false,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  /** Sayfa açılınca ekranda görünen fotoğraflar için: hemen ve öncelikli yüklenir. */
  eager?: boolean;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-white">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          className="object-contain p-3"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-green-50 text-sm text-green-700">
          Fotoğraf yakında
        </div>
      )}
    </div>
  );
}
