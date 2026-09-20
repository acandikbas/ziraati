export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="bg-green-700 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <h1 className="text-3xl font-bold">🌾 Ziraati</h1>
          <div className="flex gap-4">
            <button className="hover:bg-green-600 px-4 py-2">Ürünler</button>
            <button className="bg-orange-500 px-4 py-2">Sepet</button>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto text-center py-20 px-4">
        <h2 className="text-5xl font-bold text-green-900 mb-4">Tarım Makineleri & Yedek Parça</h2>
        <p className="text-xl text-gray-600 mb-8">Traktor, çapa, dron yedek parçaları</p>
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg">Alışverişe Başla</button>
      </section>

      <section className="max-w-6xl mx-auto py-20 px-4">
        <h3 className="text-3xl font-bold mb-8">Öne Çıkan Ürünler</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white border-2 border-green-200 p-6"><h4 className="font-bold mb-2">Traktor Parçaları</h4><p className="text-green-600 text-2xl font-bold">₺5,000</p></div>
          <div className="bg-white border-2 border-green-200 p-6"><h4 className="font-bold mb-2">Çapa Yedekleri</h4><p className="text-green-600 text-2xl font-bold">₺2,500</p></div>
          <div className="bg-white border-2 border-green-200 p-6"><h4 className="font-bold mb-2">Dron Parçaları</h4><p className="text-green-600 text-2xl font-bold">₺3,000</p></div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8 mt-20 text-center">
        <p>&copy; 2026 Ziraati</p>
      </footer>
    </div>
  );
}
