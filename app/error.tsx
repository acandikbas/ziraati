'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="mb-3 text-2xl font-bold text-gray-800">Bir sorun oluştu</h1>
      <p className="mb-6 text-gray-600">Sayfa şu anda yüklenemiyor. Lütfen biraz sonra tekrar deneyin.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
      >
        Tekrar dene
      </button>
    </div>
  );
}
