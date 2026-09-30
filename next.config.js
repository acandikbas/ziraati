/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Yalnızca bu adreslerdeki ürün fotoğrafları optimize edilip gösterilir.
    remotePatterns: [
      // ikas'tan aktarılan ürün fotoğrafları
      { protocol: 'https', hostname: 'cdn.myikas.com', pathname: '/images/**', search: '' },
      // İleride Supabase Storage'a yüklenecek fotoğraflar
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**', search: '' },
    ],
  },
};

module.exports = nextConfig;
