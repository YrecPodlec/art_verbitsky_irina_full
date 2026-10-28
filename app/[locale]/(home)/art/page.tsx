import type {Metadata} from 'next';
import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {site} from '@/app/[locale]/shared/config/site';
import styles from '../home.module.scss';

type Props = {params: Promise<{locale: string}>};
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'home.artPreview'});
  return {title: t('title'), robots: {index: false}};
}

// Пока у направления нет собственного сайта, ссылка ведёт в честную заготовку, не в 404.
export default async function ArtPreviewPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home.artPreview');
  return <main id="main" className={styles.artPreview}><Link href="/">{t('back')}</Link>
    <h1>{t('title')}</h1><p>{t('description')}</p>
    <Image src="/home/art-study.svg" alt={t('imageAlt')} width={1200} height={800} />
    <p>{t('note')}</p><a href={`mailto:${site.email}`}>{t('action')}</a>
  </main>;
}
