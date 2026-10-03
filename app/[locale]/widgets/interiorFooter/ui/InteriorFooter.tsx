import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {ProfileButton} from '@/app/[locale]/features/profileButton/ui/ProfileButton';
import {ArrowUpRight} from '@/app/[locale]/shared/UI/icons/ArrowUpRight';
import styles from './InteriorFooter.module.scss';

// Подключаем футер к interior, а не к общему layout: другие страницы сейчас вне задачи.
export async function InteriorFooter() {
  const [t, navigation] = await Promise.all([getTranslations('interiorFooter'), getTranslations('siteHeader')]);
  return <footer className={styles.footer}>
    <div className={styles.top}>
      <p>{t.rich('motto', {br: () => <br />})}</p>
      <nav aria-label={t('navigation')}>
        <Link href="/gallery">{navigation('gallery')}</Link>
        <Link href="/interior#services">{navigation('services')}</Link>
        <Link href="/articles">{navigation('articles')}</Link>
      </nav>
      <div className={styles.links}>
        <Link href="/showroom">{navigation('showroom')}<ArrowUpRight /></Link>
        <ProfileButton mobile />
        <Link href="/interior#contacts">{t('discuss')}</Link>
      </div>
      <Link className={styles.contact} href="/interior#contacts">{t.rich('invitation', {br: () => <br />})}<ArrowUpRight /></Link>
    </div>
    <p className={styles.wordmark}>{navigation('brandName')}</p>
    <div className={styles.bottom}><span>{t('caption')}</span><span>{t('legalNote')}</span></div>
  </footer>;
}
