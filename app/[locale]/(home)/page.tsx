import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {HomeIntro} from '@/app/[locale]/widgets/homeIntro';
import {HomeDirections} from '@/app/[locale]/widgets/homeDirections';
import {HomeAbout} from '@/app/[locale]/widgets/homeAbout';
import {HomeContact} from '@/app/[locale]/widgets/homeContact';
import styles from './home.module.scss';

type Props = {params: Promise<{locale: string}>};
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'home'});
  return {title: t('metaTitle'), description: t('metaDescription')};
}

// Главная собирает серверные блоки. MongoDB и HTTP-запросов для неё не требуется.
export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  return <>
    <a href="#main" className={styles.skip}>{t('skip')}</a>
    <main id="main" data-home-page="true">
      <section className={styles.portal} aria-labelledby="home-title"><HomeIntro /><HomeDirections /></section>
      <div className={styles.interlude} aria-hidden="true"><span>NATURE</span><span>✳</span><span>FEELING</span><span>✳</span><span>YOU</span></div>
      <HomeAbout />
      <HomeContact />
    </main>
  </>;
}
