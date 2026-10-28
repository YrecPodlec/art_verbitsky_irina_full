import {getTranslations} from 'next-intl/server';
import {site} from '@/app/[locale]/shared/config/site';
import {ArrowUpRight} from '@/app/[locale]/shared/UI/icons/ArrowUpRight';
import styles from './HomeAbout.module.scss';

// Небольшое знакомство на общей главной, не копия длинного интерьерного раздела.
export async function HomeAbout() {
  const t = await getTranslations('home.about');
  return <section className={styles.section} id="about" aria-labelledby="home-about-title">
    <div><p className={styles.eyebrow}>{t('eyebrow')}</p><h2 id="home-about-title">{t('titleOne')}<em>{t('titleTwo')}</em></h2><span className={styles.ornament} aria-hidden="true">✳</span></div>
    <div className={styles.copy}><p className={styles.lead}>{t('lead')}</p><p>{t('body')}</p><p className={styles.note}>{t('note')}</p><a href={`mailto:${site.email}`}>{t('action')}<ArrowUpRight /></a></div>
  </section>;
}
