-- Ziraati: ikas mağazasındaki 16 ürünü Supabase'e aktarır.
-- Supabase panelinde SQL Editor'e yapıştırıp bir kez çalıştırın.
--
-- * Hepsi tek işlemde (transaction) çalışır: bir hata olursa HİÇBİR şey değişmez.
-- * Tekrar çalıştırmak güvenlidir: aynı isimli kategori/ürün varsa yeniden eklenmez.
-- * Stok boş (NULL) bırakıldı: ikas'ta hepsi 0 görünüyordu. Gerçek stokları
--   Table Editor'den girebilirsiniz.
-- * Fotoğraflar şimdilik ikas'ın sunucusundan (cdn.myikas.com) gösterilir.

begin;

-- 1) Ana kategori
insert into public.categories (name, slug, description)
select 'Aydınlatma', 'aydinlatma', 'Traktör ve iş makinesi lambaları, farları ve yedek camları'
where not exists (select 1 from public.categories where slug = 'aydinlatma');

-- 2) Alt kategoriler
insert into public.subcategories (name, slug, category_id)
select v.name, v.slug, c.id
from (values
  ($q$Stop Lambaları$q$, $q$stop-lambalari$q$),
  ($q$Sinyal ve Park Lambaları$q$, $q$sinyal-park-lambalari$q$),
  ($q$Çalışma Lambaları$q$, $q$calisma-lambalari$q$),
  ($q$Tepe Lambaları (Çakar)$q$, $q$tepe-lambalari$q$)
) as v(name, slug)
cross join public.categories c
where c.slug = 'aydinlatma'
  and not exists (select 1 from public.subcategories s where s.slug = v.slug);

-- 3) Ürünler
insert into public.products (name, price, description, image_url, stock, subcategory_id)
select v.name, v.price, v.description, v.image_url, null, s.id
from (values
  ($q$12V - 24V Döner Tepe Lambası - Sarı Flaşörlü Traktör Çakarı$q$, 500.00, $q$12V-24V Traktör ve İş Makinesi Yarıklı/Mıknatıslı Sarı LED Tepe Lambası

Karayolu geçişlerinde, gece çalışmalarında ve saha içi güvenlik standartlarında yüksek görünürlük sağlamak üzere tasarlanmıştır. Güçlü LED çakar modülleri sayesinde hem gündüz hem de karanlıkta uzak mesafelerden kolayca fark edilir.

🛠️ Öne Çıkan Özellikler:

Çift Voltaj (12V-24V): Tüm traktör, biçerdöver, çekici, yol süpürme ve iş makineleriyle tam uyumlu.
Çoklu Çakar Modu: Flaşör (çakar) ve döner lamba efektli yüksek parlaklık.
Mıknatıslı / Boru Tip Seçeneği: Traktör kabin tavanına güçlü mıknatısıyla saniyeler içinde tutunur, sarsıntıda düşmez.
Su ve Toz Geçirmez (IP65/IP67): Yağmur, çamur ve yoğun tozlu tarla şartlarına karşı korumalı esnek polikarbonat gövde.

📐 Teknik Özellikler:

Çalışma Voltajı: 12V - 24V DC
Işık Rengi: Turuncu / Sarı (Saha ve Trafik Standartlarına Uygun)
Bağlantı: Çakmaklık Soketli (Sarmal Kablo) / Boru Geçme Tipi

📦 Paket İçeriği:

1 Adet LED Döner Tepe Lambası / Çakar$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/2075b446-42a8-4202-b0ae-1895518fe30e/image_1080.webp$q$, $q$tepe-lambalari$q$),
  ($q$12V - 24V Kare LED Traktör Çalışma Projektörü - Su Geçirmez Off-Road Taraklı Far Sis Lambası$q$, 500.00, $q$12V-24V Traktör ve İş Makinesi Yüksek Performanslı Kare LED Çalışma Projektörü

Gece aydınlatmasının yetersiz kaldığı zorlu tarla ve saha şartlarında maksimum görüş açısı sağlamak için özel olarak tasarlanmıştır. Güçlü LED çipleri ve odaklı mercek yapısı sayesinde tarlada en koyu karanlıkta bile geniş ve net bir aydınlatma sunar.

🛠️ Öne Çıkan Özellikler:

Çift Voltaj Desteği (12V - 24V): Ekstra konvertör veya adaptöre gerek kalmadan tüm traktör, biçerdöver, çapa makinesi, kamyonet ve iş makineleriyle tam uyumludur.
Zorlu Arazi Şartlarına Dayanıklı: Suya, toza, çamura ve basınca karşı dirençli gövde yapısı (IP67) sayesinde tarladaki zorlu hava koşullarında uzun ömürlü kullanım sunar.
Düşük Enerji Tüketimi, Yüksek Işık Gücü: Standart halojen ampullere göre traktör aküsünü yormaz, ısınma yapmaz ve yüksek Lümen ışık gücü verir.
Kolay Montaj: Paket içerisinde çıkan döküm montaj ayağı ve cıvata takımı sayesinde traktör kabin üstüne, çamurluğa veya ön koruma demirine birkaç dakikada kolayca monte edilebilir.

📐 Teknik Özellikler:

Çalışma Voltajı: 12V - 24V DC Uyumlu
Işık Rengi: 6000K (Kristal Beyaz / Gün Işığı)
Gövde Malzemesi: Alüminyum Döküm Soğutmalı Kasa
Kullanım Ömrü: +30.000 Saat
Koruma Sınıfı: IP67 Su ve Toz Geçirmez

🚜 Uyumlu Olduğu Araçlar ve Kullanım Alanları:

Traktörler: Massey Ferguson, New Holland, TÜMOSAN, Fiat, Deutz, John Deere, Erkunt, Hattat, Başak vb. tüm markalar.
Bahçe ve Çapa Makineleri: Akülü ve marşlı sistemli çapa grubu.
Diğer: İş makineleri, kepçeler, kamyon, biçerdöver, ATV ve Off-Road araçları.

📦 Paket İçeriği:

1 Adet Kare LED Çalışma Projektörü
1 Takım Paslanmaz Montaj Ayağı ve Bağlantı Cıvataları

Sipariş Notu: Ürünümüz tak-çalıştır yapısındadır. Bağlantı yaparken kablo kutuplarına (+ / -) dikkat edilmesi yeterlidir.$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/59926c75-6c42-4fd5-a546-18b1aae81326/image_1080.webp$q$, $q$calisma-lambalari$q$),
  ($q$12V - 24V Yuvarlak LED Traktör Çalışma Projektörü - Su Geçirmez Off-Road Taraklı Far Sis Lambası$q$, 400.00, $q$Traktör ve İş Makineleri İçin Yuvarlak LED Çalışma Projektörü (Çift Voltaj / Taraklı Soğutmalı)

Traktör, biçerdöver, çapa makinesi ve off-road araçları için özel tasarlanmış, yüksek aydınlatma gücüne sahip yuvarlak LED çalışma farıdır. Gece tarlada, zorlu arazi koşullarında veya sisli havalarda geniş ve net bir görüş alanı sağlayarak çalışma güvenliğinizi en üst seviyeye çıkarır.

🛠️ Öne Çıkan Özellikler:

Çift Voltaj (12V - 24V Uyumu): Hem 12V akülü küçük/orta boy traktörlerde hem de 24V ile çalışan ağır iş makinelerinde sorunsuz ve kesintisiz çalışır.
Taraklı Alüminyum Gövde: Arka paneldeki özel taraklı döküm alüminyum soğutma kanalları, LED’lerin ısısını hızlıca tahliye eder; aşırı ısınmayı önleyerek kullanım ömrünü uzatır.
Su ve Dustproof Koruma (IP67): Yağmur, çamur, basınçlı yıkama suyu ve tarladaki yoğun toza karşı tam korumalı sızdırmaz gövde yapısına sahiptir.
Odaklı ve Yaygın Işık Hüzmesi: Sisli ve karanlık saha şartlarında ışığı kırarak net bir görüş sunar; gözü yormadan geniş alanı aydınlatır.

📐 Teknik Özellikler:

Çalışma Voltajı: 12V - 24V DC
Form Factor: Yuvarlak / Taraklı Soğutmalı Arka Kasa
Işık Rengi: 6000K Beyaz (Yüksek Parlaklık)
Kasa Malzemesi: Siyah Alüminyum Döküm Gövde + Kırılmaz Polikarbon Lens
Montaj: Derece Ayarlı Paslanmaz Montaj Ayağı ve Bağlantı Civataları
Uyumlu Araçlar: Tüm Traktör Modelleri (Massey Ferguson, New Holland, TÜMOSAN, Deutz, Erkunt, Case IH vb.), Biçerdöverler, İş Makineleri, ATV/UTV ve Off-Road Araçlar

📦 Paket İçeriği:

1 Adet Yuvarlak LED Çalışma Projektörü
1 Takım Ayarlanabilir Montaj Ayağı, Cıvata ve Somun Seti$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/57fbc933-81a8-4b0c-b70d-d200cb2048c8/image_1080.webp$q$, $q$calisma-lambalari$q$),
  ($q$Döner Tepe Lamba Camı (Sarı / 3 Cıvatalı) - Traktör ve İş Makinesi Çakar Camı (Universal)$q$, 200.00, $q$Traktör ve İş Makineleri İçin Döner Tepe Lambası Yedek Camı (3 Cıvata Bağlantılı)

Traktör, biçerdöver, kepçe ve kurtarıcı araçlarda kullanılan 3 cıvatalı standart döner tepe lambaları (çakarlar) ile tam uyumlu yedek dış camdır. Tarlada veya sahada kırılan, çatlayan veya güneşten matlaşan lamba camınızı komple tepe lambası satın almadan, ekonomik bir şekilde yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

Universal 3 Cıvatalı Bağlantı: Piyasadaki standart 3 vida/cıvata sabitlemeli döner tepe lamba gövdelerinin çoğuna birebir oturur.
UV Korumalı ve Solmaz Malzeme: Güneş ışığına, ısıya ve hava şartlarına dayanıklı kaliteli polikarbonat/akrilik malzemeden üretilmiştir; renkte sararma veya matlaşma yapmaz.
Yüksek Işık Geçirgenliği: Parlak sarı/turuncu rengi sayesinde gece ve gündüz çalışmalarında tepe çakarının uzaktan net şekilde görünmesini sağlar.
Ekonomik ve Pratik Değişim: Alt motor ve duy aksamı çalışan lambalarınız için komple ürün almak yerine sadece camı değiştirerek bütçenizi korur.

📐 Teknik Özellikler:

Bağlantı Tipi: 3 Cıvata / Vida Yuvalı
Renk: Sarı / Turuncu (Saha Güvenlik Standartlarına Uygun)
Uyumlu Araçlar: Traktörler (Massey Ferguson, New Holland, TÜMOSAN, Deutz, Erkunt vb.), Biçerdöverler, İş Makineleri, Çekici ve Yol Yardım Araçları
Malzeme: Darbeye Dayanıklı Sert Polikarbon Lens

📦 Paket İçeriği:

1 Adet Döner Tepe Lamba Camı$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/2c0cf8cc-c07d-43f6-bf68-fdff0d0d5817/image_1080.webp$q$, $q$tepe-lambalari$q$),
  ($q$Fiat 480 - 640 Arka Sinyal / Stop Lamba Camı (Sarı / kırmızı Çiftli Set)$q$, 150.00, $q$Fiat 480 - 640 Serisi Arka Sinyal ve Stop Lamba Camı (Sarı / Kırmızı Çiftli Set)

Fiat 480, 540, 640 ve efsane serilerle tam uyumlu, sadece dış cam yenilemesi yapmak isteyenler için tasarlanmış sağ ve sol çiftli yedek cam setidir. Komple duy aksamını değiştirmeden; çatlayan, matlaşan veya kırılan dış camlarınızı pratik şekilde yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Orijinal Kalıp Uyum: Fiat fabrika stop gövdelerine ve vida deliklerine tam oturur. Ekstra kesme, delme veya yapıştırma gerektirmez.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik malzemeden üretilmiştir. Tarladaki yoğun güneş altında rengini kaybetmez, sararma veya çatlama yapmaz.
Yüksek Işık Geçirgenliği: Çift renkli (Sarı/Kırmızı) net mercek yapısı sayesinde gece ve gündüz arka araçların sizi uzaktan kolayca fark etmesini sağlar.
Ekonomik Çözüm: Komple lamba gövdesi satınalmaya gerek kalmadan sadece deforme olan dış camları yenileyerek bütçenizi korur.

📐 Teknik Özellikler:

Uyumlu Modeller: Fiat 480, Fiat 540, Fiat 640, Fiat 450, Fiat 500
Renk Seçeneği: Sarı / Kırmızı (Sinyal ve Park/Fren Bölmeli)
Paket Tipi: Çiftli Set (Sağ + Sol Takım)
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

1 Adet Sağ Arka Stop/Sinyal Lamba Camı
1 Adet Sol Arka Stop/Sinyal Lamba Camı$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/7b076060-7ec7-464e-ad36-13ad6469f175/image_1080.webp$q$, $q$stop-lambalari$q$),
  ($q$Fiat 480 - 640 Arka Stop Lambası Komple (Sağ / Sol)$q$, 700.00, $q$Fiat 480 - 640 Serisi Komple Arka Stop Lambası (Sağ / Sol)

Fiat 480, 540, 640 ve efsane seri traktörlerinizle tam uyumlu, duy aksamı ve camı dahil komple arka stop lambası ünitesidir. Zamanla kırılan, matlaşan veya su alan eski stop lambalarınızı tadilat gerektirmeden doğrudan yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir Uyum: Orijinal Fiat fabrika çamurluk deliklerine ve montaj noktalarına birebir oturur. Kesme, biçme veya ekstra delme işlemi gerektirmez.
Güneş ve Darbe Dayanımı: UV korumalı sert PMMA akrilik camı sayesinde tarladaki yoğun güneş ışığında renkte solma, Sararma veya çatlama yapmaz.
Toz ve Su Sızdırmazlık: Arka gövde contası sayesinde çamur, basınçlı yıkama suyu ve tarladaki yoğun tozun duy kısmına ulaşmasını engeller; ampul patlama riskini düşürür.
Komple Tak-Çalıştır Paket: Dış cam, iç duy soketleri ve arka montaj vidaları hazır şekilde gelir.

📐 Teknik Özellikler:

Uyumlu Modeller: Fiat 480, Fiat 540, Fiat 640, Fiat 450, Fiat 500
Çalışma Voltajı: 12V DC (Standart Traktör Tesisatı Uyumlu)
Fonksiyonlar: Park Aydınlatma (Kırmızı), Fren Lambası (Kırmızı), Sinyal (Sarı) ve Plaka Aydınlatma Penceresi
Kasa Malzemesi: Isıya ve Darbeye Dayanıklı ABS Gövde + PMMA Lens

📦 Paket İçeriği:

1 Adet Fiat Komple Arka Stop Lambası (Seçilen Taraf: Sağ veya Sol)
Sızdırmazlık Contası ve Bağlantı Civataları$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/ec37134d-1ce4-4820-ae04-92df8633a8c3/image_1080.webp$q$, $q$stop-lambalari$q$),
  ($q$Fiat 480 - 640 Ön Sinyal / Park Lamba Camı (Sağ / Sol Set) - OEM: 4247213 / 4247214$q$, 200.00, $q$Fiat Efsane Seriler İçin Ön Sinyal ve Park Lamba Camı Seti (OEM Kalitesinde)

Fiat 480, 540, 640 ve efsane serilerle tam uyumlu, ön çamurluk veya kaput yanındaki park/sinyal lambaları için özel üretilmiş sağ ve sol yedek cam setidir. Komple duy aksamını değiştirmeden; çatlayan, matlaşan veya kırılan dış camlarınızı pratik ve ekonomik bir şekilde yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir OEM Uyumu: Fabrika çıkışlı Fiat ön lamba gövdelerine, duy aksamına ve vida deliklerine mükemmel şekilde oturur. Ekstra kesme, delme veya tadilat gerektirmez.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik malzemeden üretilmiştir. Tarladaki yoğun güneş altında rengini kaybetmez, sararma veya çatlama yapmaz.
Darbeye Karşı Esnek Yapı: Saha şartlarındaki sarsıntıya, taş çarpmalarına ve çalı sürtünmelerine karşı dayanıklıdır.
Net Görünürlük: Sarı (Sinyal) ve Şeffaf/Beyaz (Ön Park) bölmeli çift renkli mercek yapısı sayesinde gündüz ve gece karşıdan gelen araçlar için yüksek görünürlük sağlar.

📐 Teknik Özellikler ve OEM Kodları:

OEM Referans Kodları:
Sağ Cam: 4247214
Sol Cam: 4247213
Uyumlu Modeller: Fiat 450, Fiat 480, Fiat 500, Fiat 540, Fiat 640, Fiat 54C
Renk Seçeneği: Sarı / Şeffaf (Sinyal ve Ön Park Bölmeli)
Paket Tipi: Çiftli Set (Sağ + Sol Takım)
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

1 Adet Fiat Sağ Ön Park-Sinyal Lamba Camı (4247214)
1 Adet Fiat Sol Ön Park-Sinyal Lamba Camı (4247213)$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/f6b7128b-f746-45e3-98ad-62e0c64f19ba/image_1080.webp$q$, $q$sinyal-park-lambalari$q$),
  ($q$Fiat 480 - 640 Ön Sinyal / Park Lambası Komple (Sağ / Sol)$q$, 700.00, $q$Fiat 480 - 640 Serisi Komple Ön Sinyal ve Park Lambası (Sağ / Sol Uyumlu)

Fiat 480, 540, 640 ve efsane serilerle birebir uyumlu, ön çamurluk veya kaput yanına monte edilen komple ön sinyal ve park lambası ünitesidir. Güneşten matlaşan, kırılan veya tesisatı bozulan eski lambalarınızı kesme-biçme yapmadan doğrudan yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir Uyum: Orijinal Fiat fabrika bağlantı ayaklarına ve kaporta yuvalarına tam oturur. Ekstra delme veya tadilat gerektirmez.
Solmaz ve Çatlamaz Cam: UV korumalı akrilik (PMMA) dış camı sayesinde tarladaki yoğun güneş altında sararma yapmaz, rengini uzun yıllar korur.
Toz ve Su Geçirmez Gövde: İç kısmında yer alan kauçuk sızdırmazlık contası; çamur, basınçlı yıkama suyu ve tarladaki yoğun tozun ampul duyuna ulaşmasını engeller.
Komple Tak-Çalıştır Ünite: Çift renkli dış cam (Sarı/Beyaz veya Sarı/Sarı), iç duy soketleri ve arka bağlantı vidaları hazır paket halinde gelir.

📐 Teknik Özellikler:

Uyumlu Modeller: Fiat 480, Fiat 540, Fiat 640, Fiat 450, Fiat 500
Çalışma Voltajı: 12V DC (Standart Traktör Tesisatına Uygun)
Fonksiyonlar: Ön Dönüş Sinyali (Sarı) ve Ön Park Aydınlatması (Beyaz/Sarı)
Malzeme: Isıya ve Darbeye Dayanıklı ABS Gövde + Şeffaf/Sarı PMMA Lens

📦 Paket İçeriği:

1 Adet Fiat Komple Ön Sinyal / Park Lambası (Seçilen Yön: Sağ veya Sol)
Sızdırmazlık Contası ve Montaj Somunları/Vidaları$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/e8d8cb2d-78b6-4036-95e0-772f2b55e31b/image_1080.webp$q$, $q$sinyal-park-lambalari$q$),
  ($q$Massey Ferguson 240 ve Efsane Seriler İçin Arka Stop Lamba Camı (Sağ / Sol Set) - OEM: 1672809M91 / 1672810M91$q$, 150.00, $q$Massey Ferguson Efsane Seriler İçin Arka Stop Lamba Camı (Sağ / Sol Set) - OEM: 1672809M91 / 1672810M91

Massey Ferguson’un efsaneleşmiş 100 ve 200 serisi traktörlerinizle tam uyumlu, OEM standartlarında üretilmiş sağ ve sol arka stop lamba camı setidir. Zamanla tarlada kırılan, güneşten matlaşan veya çatlayan camlarınızı komple lamba gövdesini değiştirmeden, ekonomik ve pratik şekilde yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir OEM Uyumu: Fabrika çıkışlı lamba gövdelerine, duy yuvalarına ve vida deliklerine mükemmel şekilde oturur. Ekstra kesme, delme veya tadilat gerektirmez.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik malzemeden üretilmiştir. Tarladaki yoğun güneş altında rengini kaybetmez, sararma veya çatlama yapmaz.
Darbeye Karşı Esnek Yapı: Saha şartlarındaki sarsıntıya, taş çarpmalarına ve çalı sürtünmelerine karşı dayanıklıdır.
Yüksek Görünürlük ve Güvenlik: Sinyal (Sarı), Park/Fren (Kırmızı) ve Şeffaf alanlarıyla gece sürüşlerinde ve karayolu geçişlerinde arka araçlar tarafından net görünmenizi sağlar.

📐 Teknik Özellikler ve OEM Kodları:

OEM Referans Kodları:
Sağ Cam: 1672809M91
Sol Cam: 1672810M91
Uyumlu Modeller:
Massey Ferguson 100 Serisi: MF 135, MF 148, MF 165, MF 175, MF 185, MF 188
Massey Ferguson 200 Serisi: MF 240, MF 250, MF 265, MF 275, MF 285, MF 290
Renk Seçeneği: Kırmızı / Sarı / Şeffaf (Sinyal, Park/Fren ve Plaka Bölmeli)
Paket Tipi: Çiftli Set (Sağ + Sol Takım)
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

1 Adet Massey Ferguson Sağ Arka Stop Lamba Camı (1672809M91)
1 Adet Massey Ferguson Sol Arka Stop Lamba Camı (1672810M91)$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/9962d56c-9284-4d8f-bf58-8311d800597e/image_1080.webp$q$, $q$stop-lambalari$q$),
  ($q$Massey Ferguson 240 ve Efsane Seriler İçin Komple Arka Stop Lambası (Sağ / Sol Set) - OEM: 1672809M91 / 1672810M91$q$, 1000.00, $q$Massey Ferguson Efsane Seriler İçin Komple Arka Stop Lambası Seti (OEM Kalitesinde)

Massey Ferguson’un efsaneleşmiş 100 ve 200 serisi traktörlerinizle tam uyumlu, iç duy aksamı, sızdırmazlık contası ve dış camı dahil komple arka stop lambası setidir. Zamanla tarlada kırılan, tesisatı bozulan veya su alan eski lamba ünitelerinizi kesme-biçme yapmadan doğrudan yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir OEM Uyumu: Fabrika çıkışlı Massey Ferguson çamurluk bağlantı yuvalarına ve vida deliklerine mükemmel şekilde oturur. Ekstra delme veya tadilat gerektirmez.

Komple Tak-Çalıştır Paket: Dış cam, iç ampul duyları, kablo bağlantı soketleri ve montaj vidaları hazır montajlı olarak gelir.

Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik camı tarladaki yoğun güneş altında sararma yapmaz, rengini uzun süre korur.

Toz ve Su Sızdırmazlık: Dahili kauçuk contası sayesinde çamur, basınçlı yıkama suyu ve tarladaki yoğun tozun iç tesisata ulaşmasını engeller.

📐 Teknik Özellikler ve OEM Kodları:

OEM Referans Kodları:

Komple Sağ Lamba: 1672809M91 (veya 1672809M1)

Komple Sol Lamba: 1672810M91 (veya 1672810M1)

Uyumlu Modeller:

Massey Ferguson 200 Serisi: MF 240, MF 240 S, MF 250, MF 265, MF 275, MF 285, MF 290

Massey Ferguson 100 Serisi: MF 135, MF 148, MF 165, MF 175, MF 185, MF 188

Çalışma Voltajı: 12V DC (Standart Traktör Tesisatı Uyumlu)

Fonksiyonlar: Sinyal (Sarı), Park/Fren (Kırmızı) ve Plaka Aydınlatma Penceresi (Şeffaf)

Paket Tipi: Çiftli Set (Sağ + Sol Takım Komple)

📦 Paket İçeriği:

1 Adet Massey Ferguson Komple Sağ Arka Stop Lambası (1672809M91)

1 Adet Massey Ferguson Komple Sol Arka Stop Lambası (1672810M91)$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/86b1ca79-12ae-460b-be1b-1e6a639969bc/image_1080.webp$q$, $q$stop-lambalari$q$),
  ($q$Massey Ferguson 240 ve Efsane Seriler İçin Komple Ön Park - Sinyal Lambası (Sağ / Sol Set) - OEM: 1672807M91 / 1672808M91$q$, 1000.00, $q$Massey Ferguson Efsane Seriler İçin Komple Ön Park ve Sinyal Lambası Seti (OEM Kalitesinde)

Massey Ferguson’un efsaneleşmiş 100 ve 200 serisi traktörlerinizle tam uyumlu, iç duy aksamı, sızdırmazlık contası ve dış camı dahil komple ön park/sinyal lambası setidir. Zamanla tarlada kırılan, tesisatı bozulan veya su alan eski lamba ünitelerinizi kesme-biçme yapmadan doğrudan yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir OEM Uyumu: Fabrika çıkışlı Massey Ferguson ön kaput/çamurluk bağlantı yuvalarına ve vida deliklerine mükemmel şekilde oturur. Ekstra delme veya tadilat gerektirmez.
Komple Tak-Çalıştır Paket: Dış cam, iç ampul duyları, kablo bağlantı soketleri ve montaj vidaları hazır montajlı olarak gelir.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik camı tarladaki yoğun güneş altında sararma yapmaz, rengini uzun süre korur.
Toz ve Su Sızdırmazlık: Dahili kauçuk contası sayesinde çamur, basınçlı yıkama suyu ve tarladaki yoğun tozun iç tesisata ulaşmasını engeller.

📐 Teknik Özellikler ve OEM Kodları:

OEM Referans Kodları:
Komple Sağ Lamba: 1672807M91 (veya 1672807M1)
Komple Sol Lamba: 1672808M91 (veya 1672808M1)
Uyumlu Modeller:
Massey Ferguson 200 Serisi: MF 240, MF 240 S, MF 250, MF 265, MF 275, MF 285, MF 290
Massey Ferguson 100 Serisi: MF 135, MF 148, MF 165, MF 175, MF 185, MF 188
Çalışma Voltajı: 12V DC (Standart Traktör Tesisatı Uyumlu)
Fonksiyonlar: Ön Dönüş Sinyali (Sarı) ve Ön Park Aydınlatması (Şeffaf/Beyaz)
Paket Tipi: Çiftli Set (Sağ + Sol Takım Komple)

📦 Paket İçeriği:

1 Adet Massey Ferguson Komple Sağ Ön Park-Sinyal Lambası (1672807M91)
1 Adet Massey Ferguson Komple Sol Ön Park-Sinyal Lambası (1672808M91)$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/08accdac-ba67-442c-9fef-2552305e25da/image_1080.webp$q$, $q$sinyal-park-lambalari$q$),
  ($q$Massey Ferguson Ön Park - Sinyal Lamba Camı (Sarı / Şeffaf Çiftli Set) - OEM: 1672807M1 / 1672808M1$q$, 150.00, $q$Massey Ferguson Efsane Seriler İçin Ön Park ve Sinyal Lamba Camı Seti (OEM Kalitesinde)

Massey Ferguson’un 100 ve 200 serisi efsane traktörleri ile tam uyumlu, ön çamurluk/kaput yanındaki park ve sinyal lambaları için özel üretilmiş sağ ve sol yedek cam setidir. Zamanla tarlada kırılan, güneşten matlaşan veya çatlayan camlarınızı komple lamba duyunu değiştirmeden pratik ve ekonomik bir şekilde yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir OEM Uyumu: Fabrika çıkışlı ön lamba gövdelerine, duy aksamına ve vida deliklerine mükemmel oturur. Ekstra kesme, delme veya tadilat gerektirmez.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik malzemeden üretilmiştir. Tarladaki yoğun güneş altında rengini kaybetmez, sararma veya çatlama yapmaz.
Darbeye Karşı Esnek Yapı: Saha şartlarındaki sarsıntıya, taş çarpmalarına ve çalı sürtünmelerine karşı dayanıklıdır.
Net Görünürlük: Sarı (Sinyal) ve Şeffaf/Beyaz (Ön Park) bölmeli çift renkli mercek yapısı sayesinde gündüz ve gece karşıdan gelen araçlar için yüksek görünürlük sağlar.

📐 Teknik Özellikler ve OEM Kodları:

OEM Referans Kodları:
Sağ Cam: 1672807M1 (veya 1672807M91)
Sol Cam: 1672808M1 (veya 1672808M91)
Uyumlu Modeller:
Massey Ferguson 100 Serisi: MF 135, MF 148, MF 165, MF 175, MF 185, MF 188
Massey Ferguson 200 Serisi: MF 240, MF 250, MF 265, MF 275, MF 285, MF 290
Renk Seçeneği: Sarı / Şeffaf (Sinyal ve Ön Park Bölmeli)
Paket Tipi: Çiftli Set (Sağ + Sol Takım)
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

1 Adet Massey Ferguson Sağ Ön Park-Sinyal Lamba Camı (1672807M1)
1 Adet Massey Ferguson Sol Ön Park-Sinyal Lamba Camı (1672808M1)$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/e1e099cb-54b4-4970-a474-7f0272f9b000/image_1080.webp$q$, $q$sinyal-park-lambalari$q$),
  ($q$New Holland TT50 Arka Stop Lamba Camı (Sağ / Sol Set) - OEM: 5183350 / 5183351$q$, 200.00, $q$New Holland TT Serisi İçin Arka Stop Lamba Camı Seti (OEM Kalitesinde)

New Holland TT50 ve TT serisi yerli üretim traktörlerinizle tam uyumlu, OEM standartlarında üretilmiş sağ ve sol arka stop lamba camı setidir. Zamanla tarlada kırılan, güneşten matlaşan veya çatlayan camlarınızı komple lamba gövdesini değiştirmeden, ekonomik ve pratik şekilde yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir OEM Uyumu: Fabrika çıkışlı New Holland lamba gövdelerine, duy yuvalarına ve vida deliklerine mükemmel şekilde oturur. Ekstra kesme, delme veya tadilat gerektirmez.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik malzemeden üretilmiştir. Tarladaki yoğun güneş altında rengini kaybetmez, sararma veya çatlama yapmaz.
Darbeye Karşı Esnek Yapı: Saha şartlarındaki sarsıntıya, taş çarpmalarına ve çalı sürtünmelerine karşı dayanıklıdır.
Yüksek Görünürlük ve Güvenlik: Sinyal (Sarı), Park/Fren (Kırmızı) ve Şeffaf (Plaka/Geri Vites) alanlarıyla gece sürüşlerinde ve karayolu geçişlerinde arka araçlar tarafından net görünmenizi sağlar.

📐 Teknik Özellikler ve OEM Kodları:

OEM Referans Kodları:
Sağ Cam: 5183350 (veya 84223298)
Sol Cam: 5183351 (veya 84223297)
Uyumlu Modeller:
New Holland TT Serisi: TT50, TT55, TT65, TT75
New Holland TTD / TD Serisi: TD55D, TD65D, TD75D, TD85D (Eski Tip Kasa)
Case IH JX Serisi: JX55, JX65, JX75 (Ortak platform modelleri)
Renk Seçeneği: Kırmızı / Sarı / Şeffaf
Paket Tipi: Çiftli Set (Sağ + Sol Takım)
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

1 Adet New Holland Sağ Arka Stop Lamba Camı (5183350)
1 Adet New Holland Sol Arka Stop Lamba Camı (5183351)$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/502422ba-3602-406d-b53a-ac32d8bfcbd1/image_1080.webp$q$, $q$stop-lambalari$q$),
  ($q$New Holland TT50 Arka Stop Lambası Komple (Sağ / Sol Set) - OEM: 5183348 / 5183349$q$, 2000.00, $q$New Holland TT Serisi İçin Komple Arka Stop Lambası Seti (OEM Kalitesinde)

New Holland TT50 ve TT serisi traktörlerinizle tam uyumlu, duy aksamı, sızdırmazlık contası ve dış camı dahil komple arka stop lambası setidir. Kırılan, tesisatı bozulan veya su alan eski lamba ünitelerinizi kesme-biçme yapmadan doğrudan yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir OEM Uyumu: Fabrika çıkışlı New Holland çamurluk bağlantı yuvalarına ve vida deliklerine tam oturur. Ekstra delme veya tadilat gerektirmez.
Komple Tak-Çalıştır Paket: Dış cam, iç ampul duyları, kablo bağlantı soketleri ve montaj vidaları hazır montajlı olarak gelir.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik camı tarladaki yoğun güneş altında sararma yapmaz, rengini uzun süre korur.
Toz ve Su Sızdırmazlık: Dahili kauçuk contası sayesinde çamur, basınçlı yıkama suyu ve tarladaki yoğun tozun iç tesisata ulaşmasını engeller.

📐 Teknik Özellikler ve OEM Kodları:

OEM Referans Kodları:
Komple Sağ Lamba: 5183348 (veya 84223292)
Komple Sol Lamba: 5183349 (veya 84223291)
Uyumlu Modeller:
New Holland TT Serisi: TT50, TT55, TT65, TT75
New Holland TTD / TD Serisi: TD55D, TD65D, TD75D, TD85D (Eski Tip Kasa)
Case IH JX Serisi: JX55, JX65, JX75 (Ortak platform modelleri)
Çalışma Voltajı: 12V DC (Standart Traktör Tesisatı Uyumlu)
Fonksiyonlar: Sinyal (Sarı), Park/Fren (Kırmızı) ve Plaka/Geri Vites Aydınlatması (Şeffaf)
Paket Tipi: Çiftli Set (Sağ + Sol Takım Komple)

📦 Paket İçeriği:

1 Adet New Holland Komple Sağ Arka Stop Lambası (5183348)
1 Adet New Holland Komple Sol Arka Stop Lambası (5183349)$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/6ee2cac5-08fd-48aa-a055-b008475ba1b0/image_1080.webp$q$, $q$stop-lambalari$q$),
  ($q$New Holland TT50 Ön Park - Sinyal Lamba Camı (Sağ / Sol Set) - OEM: 5174542 / 5174543$q$, 300.00, $q$New Holland TT Serisi İçin Ön Park ve Sinyal Lamba Camı Seti (OEM Kalitesinde)

New Holland TT50 ve TT serisi traktörlerinizle tam uyumlu, ön çamurluk ve kaput yanındaki park/sinyal lambaları için özel üretilmiş sağ ve sol yedek cam setidir. Zamanla tarlada kırılan, güneşten matlaşan veya çatlayan camlarınızı komple lamba gövdesini değiştirmeden, ekonomik ve pratik şekilde yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir OEM Uyumu: Fabrika çıkışlı New Holland ön lamba gövdelerine, duy aksamına ve vida deliklerine mükemmel şekilde oturur. Ekstra kesme, delme veya tadilat gerektirmez.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik malzemeden üretilmiştir. Tarladaki yoğun güneş altında rengini kaybetmez, sararma veya çatlama yapmaz.
Darbeye Karşı Esnek Yapı: Saha şartlarındaki sarsıntıya, taş çarpmalarına ve çalı sürtünmelerine karşı dayanıklıdır.
Net Görünürlük: Sarı (Sinyal) ve Şeffaf/Beyaz (Ön Park) bölmeli mercek yapısı sayesinde gündüz ve gece karşıdan gelen araçlar için yüksek görünürlük sağlar.

📐 Teknik Özellikler ve OEM Kodları:

OEM Referans Kodları:
Sağ Cam: 5174542 (veya 84223296)
Sol Cam: 5174543 (veya 84223295)
Uyumlu Modeller:
New Holland TT Serisi: TT50, TT55, TT65, TT75
New Holland TTD / TD Serisi: TD55D, TD65D, TD75D, TD85D (Eski Tip Kasa)
Case IH JX Serisi: JX55, JX65, JX75 (Ortak platform modelleri)
Renk Seçeneği: Sarı / Şeffaf (Sinyal ve Ön Park Bölmeli)
Paket Tipi: Çiftli Set (Sağ + Sol Takım)
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

1 Adet New Holland Sağ Ön Park-Sinyal Lamba Camı (5174542)
1 Adet New Holland Sol Ön Park-Sinyal Lamba Camı (5174543)$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/212bc454-5546-4508-b03e-e1ed72a9eed9/image_1080.webp$q$, $q$sinyal-park-lambalari$q$),
  ($q$New Holland TT50 Ön Park - Sinyal Lambası Komple (Sağ / Sol Set) - OEM: 5174540 / 5174541$q$, 2000.00, $q$New Holland TT Serisi İçin Komple Ön Park ve Sinyal Lambası Seti (OEM Kalitesinde)

New Holland TT50 ve TT serisi traktörlerinizle tam uyumlu, duy aksamı, bağlantı kabloları ve dış camı dahil komple ön park/sinyal lambası setidir. Kırılan, tesisatı bozulan veya su alan eski lamba ünitelerinizi kesme-biçme yapmadan doğrudan yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Birebir OEM Uyumu: Fabrika çıkışlı New Holland ön kaput/çamurluk bağlantı yuvalarına tam oturur. Ekstra delme veya tadilat gerektirmez.
Komple Tak-Çalıştır Paket: Dış cam, iç ampul duyları ve montaj vidaları hazır montajlı olarak gelir.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik camı tarladaki yoğun güneş altında sararma yapmaz, rengini uzun süre korur.
Toz ve Su Sızdırmazlık: Dahili kauçuk contası sayesinde çamur, basınçlı yıkama suyu ve tarladaki yoğun tozun iç tesisata ulaşmasını engeller.

📐 Teknik Özellikler ve OEM Kodları:

OEM Referans Kodları:
Komple Sağ Lamba: 5174540 (veya 84223294)
Komple Sol Lamba: 5174541 (veya 84223293)
Uyumlu Modeller:
New Holland TT Serisi: TT50, TT55, TT65, TT75
New Holland TTD / TD Serisi: TD55D, TD65D, TD75D, TD85D (Eski Tip Kasa)
Case IH JX Serisi: JX55, JX65, JX75 (Ortak platform modelleri)
Çalışma Voltajı: 12V DC (Standart Traktör Tesisatı Uyumlu)
Fonksiyonlar: Ön Dönüş Sinyali (Sarı) ve Ön Park Aydınlatması (Şeffaf/Beyaz)
Paket Tipi: Çiftli Set (Sağ + Sol Takım Komple)

📦 Paket İçeriği:

1 Adet New Holland Komple Sağ Ön Park-Sinyal Lambası (5174540)
1 Adet New Holland Komple Sol Ön Park-Sinyal Lambası (5174541)$q$, $q$https://cdn.myikas.com/images/69ebdce8-db70-4968-b78c-3bda2b8b93c0/908f4af3-cb9c-4c2a-8a09-1b3356cc2c8d/image_1080.webp$q$, $q$sinyal-park-lambalari$q$)
) as v(name, price, description, image_url, sub_slug)
join public.subcategories s on s.slug = v.sub_slug
where not exists (select 1 from public.products p where p.name = v.name);

commit;

-- Kontrol: alt kategori başına ürün sayısı (toplam 16 olmalı)
select s.name as alt_kategori, count(p.id) as urun_sayisi
from public.subcategories s
left join public.products p on p.subcategory_id = s.id
where s.slug in ('stop-lambalari', 'sinyal-park-lambalari', 'calisma-lambalari', 'tepe-lambalari')
group by s.name
order by s.name;
