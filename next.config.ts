import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    // Разрешаем только наш публичный Blob и каталог проектов, а не любые внешние URL.
    remotePatterns: [{
      protocol: 'https',
      hostname: 'mstvzrmidf14lpdu.public.blob.vercel-storage.com',
      port: '',
      pathname: '/projects/**',
      search: '',
    }],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
