-- Ziraati – Aşama 3c: Sağ/Sol seçimli 12 ürünün adı ve açıklaması seçime uygun hâle getirilir
-- (ör. "(Sağ / Sol Set)" -> "(Sağ / Sol)", "Paket Tipi: Çiftli Set" -> satış seçenekleri,
--  paket içeriği "Sağ seçilirse / Sol seçilirse / Sağ + Sol takım seçilirse").
-- Supabase panelinde SQL Editor'e yapıştırıp bir kez çalıştırın. Tekrar çalıştırmak güvenlidir.
--
-- Güvenlik: Açıklaması ikas'tan aktarıldığı hâlinden farklı olan (panelden elle düzenlenmiş)
-- ürünlere DOKUNULMAZ; sonuç listesinde "guncellendi = false" görünür.
-- Ürün adresleri (slug) değişmez; mevcut linkler çalışmaya devam eder.

begin;

update public.products p
set name = v.new_name, description = v.new_description
from (values
  ('ZR-FIAT-ARKA-CAM', 'bfaf8c0160a08536d3c90467f6136fe2', $q$Fiat 480 - 640 Arka Sinyal / Stop Lamba Camı (Sarı / kırmızı Çiftli Set)$q$,
   $q$Fiat 480 - 640 Arka Sinyal / Stop Lamba Camı (Sarı / Kırmızı)$q$,
   $q$Fiat 480 - 640 Serisi Arka Sinyal ve Stop Lamba Camı (Sarı / Kırmızı)

Fiat 480, 540, 640 ve efsane serilerle tam uyumlu, sadece dış cam yenilemesi yapmak isteyenler için tasarlanmış yedek camıdır; sağ ve sol tek tek ya da takım olarak satılır. Komple duy aksamını değiştirmeden; çatlayan, matlaşan veya kırılan dış camlarınızı pratik şekilde yenilemenizi sağlar.

🛠️ Öne Çıkan Özellikler:

%100 Orijinal Kalıp Uyum: Fiat fabrika stop gövdelerine ve vida deliklerine tam oturur. Ekstra kesme, delme veya yapıştırma gerektirmez.
Güneş Işığına ve Solmaya Dayanıklı: UV korumalı sert PMMA akrilik malzemeden üretilmiştir. Tarladaki yoğun güneş altında rengini kaybetmez, sararma veya çatlama yapmaz.
Yüksek Işık Geçirgenliği: Çift renkli (Sarı/Kırmızı) net mercek yapısı sayesinde gece ve gündüz arka araçların sizi uzaktan kolayca fark etmesini sağlar.
Ekonomik Çözüm: Komple lamba gövdesi satınalmaya gerek kalmadan sadece deforme olan dış camları yenileyerek bütçenizi korur.

📐 Teknik Özellikler:

Uyumlu Modeller: Fiat 480, Fiat 540, Fiat 640, Fiat 450, Fiat 500
Renk Seçeneği: Sarı / Kırmızı (Sinyal ve Park/Fren Bölmeli)
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet Sağ Arka Stop/Sinyal Lamba Camı
Sol seçilirse: 1 Adet Sol Arka Stop/Sinyal Lamba Camı
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-FIAT-ON-CAM', 'a1a2b063e98d0ede2b4b3d71fd76f7fe', $q$Fiat 480 - 640 Ön Sinyal / Park Lamba Camı (Sağ / Sol Set) - OEM: 4247213 / 4247214$q$,
   $q$Fiat 480 - 640 Ön Sinyal / Park Lamba Camı (Sağ / Sol) - OEM: 4247213 / 4247214$q$,
   $q$Fiat Efsane Seriler İçin Ön Sinyal ve Park Lamba Camı (OEM Kalitesinde)

Fiat 480, 540, 640 ve efsane serilerle tam uyumlu, ön çamurluk veya kaput yanındaki park/sinyal lambaları için özel üretilmiş yedek camıdır; sağ ve sol tek tek ya da takım olarak satılır. Komple duy aksamını değiştirmeden; çatlayan, matlaşan veya kırılan dış camlarınızı pratik ve ekonomik bir şekilde yenilemenizi sağlar.

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet Fiat Sağ Ön Park-Sinyal Lamba Camı (4247214)
Sol seçilirse: 1 Adet Fiat Sol Ön Park-Sinyal Lamba Camı (4247213)
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-MF-ARKA-CAM', '584792cfba98467211a69e8096ebaf3f', $q$Massey Ferguson 240 ve Efsane Seriler İçin Arka Stop Lamba Camı (Sağ / Sol Set) - OEM: 1672809M91 / 1672810M91$q$,
   $q$Massey Ferguson 240 ve Efsane Seriler İçin Arka Stop Lamba Camı (Sağ / Sol) - OEM: 1672809M91 / 1672810M91$q$,
   $q$Massey Ferguson Efsane Seriler İçin Arka Stop Lamba Camı (Sağ / Sol) - OEM: 1672809M91 / 1672810M91

Massey Ferguson’un efsaneleşmiş 100 ve 200 serisi traktörlerinizle tam uyumlu, OEM standartlarında üretilmiş arka stop lamba camıdır; sağ ve sol tek tek ya da takım olarak satılır. Zamanla tarlada kırılan, güneşten matlaşan veya çatlayan camlarınızı komple lamba gövdesini değiştirmeden, ekonomik ve pratik şekilde yenilemenizi sağlar.

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet Massey Ferguson Sağ Arka Stop Lamba Camı (1672809M91)
Sol seçilirse: 1 Adet Massey Ferguson Sol Arka Stop Lamba Camı (1672810M91)
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-MF-ARKA-KOMPLE', '6c4931abef5ef947a5190cff34e8a379', $q$Massey Ferguson 240 ve Efsane Seriler İçin Komple Arka Stop Lambası (Sağ / Sol Set) - OEM: 1672809M91 / 1672810M91$q$,
   $q$Massey Ferguson 240 ve Efsane Seriler İçin Komple Arka Stop Lambası (Sağ / Sol) - OEM: 1672809M91 / 1672810M91$q$,
   $q$Massey Ferguson Efsane Seriler İçin Komple Arka Stop Lambası (OEM Kalitesinde)

Massey Ferguson’un efsaneleşmiş 100 ve 200 serisi traktörlerinizle tam uyumlu, iç duy aksamı, sızdırmazlık contası ve dış camı dahil komple arka stop lambasıdır; sağ ve sol tek tek ya da takım olarak satılır. Zamanla tarlada kırılan, tesisatı bozulan veya su alan eski lamba ünitelerinizi kesme-biçme yapmadan doğrudan yenilemenizi sağlar.

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

Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet Massey Ferguson Komple Sağ Arka Stop Lambası (1672809M91)

Sol seçilirse: 1 Adet Massey Ferguson Komple Sol Arka Stop Lambası (1672810M91)
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-MF-ON-CAM', 'bc9d5db24cc1f1ea43bb18d2ee29e8af', $q$Massey Ferguson Ön Park - Sinyal Lamba Camı (Sarı / Şeffaf Çiftli Set) - OEM: 1672807M1 / 1672808M1$q$,
   $q$Massey Ferguson Ön Park - Sinyal Lamba Camı (Sarı / Şeffaf) - OEM: 1672807M1 / 1672808M1$q$,
   $q$Massey Ferguson Efsane Seriler İçin Ön Park ve Sinyal Lamba Camı (OEM Kalitesinde)

Massey Ferguson’un 100 ve 200 serisi efsane traktörleri ile tam uyumlu, ön çamurluk/kaput yanındaki park ve sinyal lambaları için özel üretilmiş yedek camıdır; sağ ve sol tek tek ya da takım olarak satılır. Zamanla tarlada kırılan, güneşten matlaşan veya çatlayan camlarınızı komple lamba duyunu değiştirmeden pratik ve ekonomik bir şekilde yenilemenizi sağlar.

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet Massey Ferguson Sağ Ön Park-Sinyal Lamba Camı (1672807M1)
Sol seçilirse: 1 Adet Massey Ferguson Sol Ön Park-Sinyal Lamba Camı (1672808M1)
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-MF-ON-KOMPLE', 'f05ca38d105592a0536ae1c0fcc0f545', $q$Massey Ferguson 240 ve Efsane Seriler İçin Komple Ön Park - Sinyal Lambası (Sağ / Sol Set) - OEM: 1672807M91 / 1672808M91$q$,
   $q$Massey Ferguson 240 ve Efsane Seriler İçin Komple Ön Park - Sinyal Lambası (Sağ / Sol) - OEM: 1672807M91 / 1672808M91$q$,
   $q$Massey Ferguson Efsane Seriler İçin Komple Ön Park ve Sinyal Lambası (OEM Kalitesinde)

Massey Ferguson’un efsaneleşmiş 100 ve 200 serisi traktörlerinizle tam uyumlu, iç duy aksamı, sızdırmazlık contası ve dış camı dahil komple ön park/sinyal lambasıdır; sağ ve sol tek tek ya da takım olarak satılır. Zamanla tarlada kırılan, tesisatı bozulan veya su alan eski lamba ünitelerinizi kesme-biçme yapmadan doğrudan yenilemenizi sağlar.

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet Massey Ferguson Komple Sağ Ön Park-Sinyal Lambası (1672807M91)
Sol seçilirse: 1 Adet Massey Ferguson Komple Sol Ön Park-Sinyal Lambası (1672808M91)
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-NH-ARKA-CAM', 'd2d24d5f4ee028b63ebebcbbbb6be9b5', $q$New Holland TT50 Arka Stop Lamba Camı (Sağ / Sol Set) - OEM: 5183350 / 5183351$q$,
   $q$New Holland TT50 Arka Stop Lamba Camı (Sağ / Sol) - OEM: 5183350 / 5183351$q$,
   $q$New Holland TT Serisi İçin Arka Stop Lamba Camı (OEM Kalitesinde)

New Holland TT50 ve TT serisi yerli üretim traktörlerinizle tam uyumlu, OEM standartlarında üretilmiş arka stop lamba camıdır; sağ ve sol tek tek ya da takım olarak satılır. Zamanla tarlada kırılan, güneşten matlaşan veya çatlayan camlarınızı komple lamba gövdesini değiştirmeden, ekonomik ve pratik şekilde yenilemenizi sağlar.

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet New Holland Sağ Arka Stop Lamba Camı (5183350)
Sol seçilirse: 1 Adet New Holland Sol Arka Stop Lamba Camı (5183351)
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-NH-ARKA-KOMPLE', '884f78ae33e90da1eadb081172de8cd9', $q$New Holland TT50 Arka Stop Lambası Komple (Sağ / Sol Set) - OEM: 5183348 / 5183349$q$,
   $q$New Holland TT50 Arka Stop Lambası Komple (Sağ / Sol) - OEM: 5183348 / 5183349$q$,
   $q$New Holland TT Serisi İçin Komple Arka Stop Lambası (OEM Kalitesinde)

New Holland TT50 ve TT serisi traktörlerinizle tam uyumlu, duy aksamı, sızdırmazlık contası ve dış camı dahil komple arka stop lambasıdır; sağ ve sol tek tek ya da takım olarak satılır. Kırılan, tesisatı bozulan veya su alan eski lamba ünitelerinizi kesme-biçme yapmadan doğrudan yenilemenizi sağlar.

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet New Holland Komple Sağ Arka Stop Lambası (5183348)
Sol seçilirse: 1 Adet New Holland Komple Sol Arka Stop Lambası (5183349)
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-NH-ON-CAM', '69cd0eff5a7e46c6c099bddf14fb2f3f', $q$New Holland TT50 Ön Park - Sinyal Lamba Camı (Sağ / Sol Set) - OEM: 5174542 / 5174543$q$,
   $q$New Holland TT50 Ön Park - Sinyal Lamba Camı (Sağ / Sol) - OEM: 5174542 / 5174543$q$,
   $q$New Holland TT Serisi İçin Ön Park ve Sinyal Lamba Camı (OEM Kalitesinde)

New Holland TT50 ve TT serisi traktörlerinizle tam uyumlu, ön çamurluk ve kaput yanındaki park/sinyal lambaları için özel üretilmiş yedek camıdır; sağ ve sol tek tek ya da takım olarak satılır. Zamanla tarlada kırılan, güneşten matlaşan veya çatlayan camlarınızı komple lamba gövdesini değiştirmeden, ekonomik ve pratik şekilde yenilemenizi sağlar.

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.
Malzeme: Darbeye Dayanıklı Akrilik Lens (PMMA)

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet New Holland Sağ Ön Park-Sinyal Lamba Camı (5174542)
Sol seçilirse: 1 Adet New Holland Sol Ön Park-Sinyal Lamba Camı (5174543)
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-NH-ON-KOMPLE', '18a0688a848c0b671a9fb33daa84cf19', $q$New Holland TT50 Ön Park - Sinyal Lambası Komple (Sağ / Sol Set) - OEM: 5174540 / 5174541$q$,
   $q$New Holland TT50 Ön Park - Sinyal Lambası Komple (Sağ / Sol) - OEM: 5174540 / 5174541$q$,
   $q$New Holland TT Serisi İçin Komple Ön Park ve Sinyal Lambası (OEM Kalitesinde)

New Holland TT50 ve TT serisi traktörlerinizle tam uyumlu, duy aksamı, bağlantı kabloları ve dış camı dahil komple ön park/sinyal lambasıdır; sağ ve sol tek tek ya da takım olarak satılır. Kırılan, tesisatı bozulan veya su alan eski lamba ünitelerinizi kesme-biçme yapmadan doğrudan yenilemenizi sağlar.

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.

📦 Paket İçeriği:

Sağ seçilirse: 1 Adet New Holland Komple Sağ Ön Park-Sinyal Lambası (5174540)
Sol seçilirse: 1 Adet New Holland Komple Sol Ön Park-Sinyal Lambası (5174541)
Sağ + Sol takım seçilirse: her iki parça birlikte gönderilir.$q$),
  ('ZR-FIAT-ARKA-KOMPLE', 'd2fcbedda61f420d41a4e74b86698a1f', $q$Fiat 480 - 640 Arka Stop Lambası Komple (Sağ / Sol)$q$,
   $q$Fiat 480 - 640 Arka Stop Lambası Komple (Sağ / Sol)$q$,
   $q$Fiat 480 - 640 Serisi Komple Arka Stop Lambası (Sağ / Sol)

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.

📦 Paket İçeriği:

1 Adet Fiat Komple Arka Stop Lambası (seçtiğiniz taraf)
Sızdırmazlık Contası ve Bağlantı Civataları
Sağ + Sol takım seçilirse: sağ ve sol olmak üzere 2 adet komple lamba gönderilir.$q$),
  ('ZR-FIAT-ON-KOMPLE', '856ddc2434d5087a475b5a4e2ba6ff0f', $q$Fiat 480 - 640 Ön Sinyal / Park Lambası Komple (Sağ / Sol)$q$,
   $q$Fiat 480 - 640 Ön Sinyal / Park Lambası Komple (Sağ / Sol)$q$,
   $q$Fiat 480 - 640 Serisi Komple Ön Sinyal ve Park Lambası (Sağ / Sol Uyumlu)

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
Satış Seçenekleri: Tek taraf (Sağ veya Sol) ya da Sağ + Sol takım — ürün sayfasından seçebilirsiniz.

📦 Paket İçeriği:

1 Adet Fiat Komple Ön Sinyal / Park Lambası (seçtiğiniz taraf)
Sızdırmazlık Contası ve Montaj Somunları/Vidaları
Sağ + Sol takım seçilirse: sağ ve sol olmak üzere 2 adet komple lamba gönderilir.$q$)
) as v(sku, old_md5, old_name, new_name, new_description)
where p.sku = v.sku
  and md5(p.description) = v.old_md5
  and p.name = v.old_name;

commit;

-- Kontrol: 12 satır; guncellendi = true olmalı
select sku, name, description like '%Satış Seçenekleri:%' as guncellendi
from public.products
where sku in ('ZR-FIAT-ARKA-CAM', 'ZR-FIAT-ON-CAM', 'ZR-MF-ARKA-CAM', 'ZR-MF-ARKA-KOMPLE', 'ZR-MF-ON-CAM', 'ZR-MF-ON-KOMPLE', 'ZR-NH-ARKA-CAM', 'ZR-NH-ARKA-KOMPLE', 'ZR-NH-ON-CAM', 'ZR-NH-ON-KOMPLE', 'ZR-FIAT-ARKA-KOMPLE', 'ZR-FIAT-ON-KOMPLE')
order by sku;
