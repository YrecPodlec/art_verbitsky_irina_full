import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {InteriorHomePage} from '@/src/_pages/interior-home';

type PageProps = {params: Promise<{locale: string}>};

// Маршрут только подключает FSD-страницу; язык определяется конфигурацией next-intl.
export default async function InteriorPage({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <InteriorHomePage />;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'interior.meta'});
  return {
    title: t('title'),
    description: t('description'),
  };
}
