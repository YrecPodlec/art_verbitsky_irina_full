import {getTranslations} from 'next-intl/server';
import {site} from '@/app/[locale]/shared/config/site';
import {ArrowUpRight} from '@/app/[locale]/shared/UI/icons/ArrowUpRight';
import styles from './HomeContact.module.scss';

// Общий контакт главной. Email не отправляет форму и не создаёт записи в БД.
export async function HomeContact() {
  const t = await getTranslations('home.contact');
  return <section className={styles.section} id="contact" aria-labelledby="home-contact-title">
    <div><p className={styles.eyebrow}>{t('eyebrow')}</p><h2 id="home-contact-title">{t('titleOne')}<em>{t('titleTwo')}</em></h2></div>
    <div className={styles.copy}><p>{t('body')}</p><a href={`mailto:${site.email}`}>{site.email}<ArrowUpRight /></a><span>{t('format')}</span></div>
  </section>;
}
