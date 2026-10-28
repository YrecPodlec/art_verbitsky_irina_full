import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {directions} from '@/app/[locale]/entities/direction';
import {site} from '@/app/[locale]/shared/config/site';
import {ArrowUpRight} from '@/app/[locale]/shared/UI/icons/ArrowUpRight';
import styles from './SiteFooter.module.scss';

// Единый серверный футер главной, интерьера и галереи. Направления — из того же mock.
export async function SiteFooter() {
  const [t, items] = await Promise.all([getTranslations('siteFooter'), getTranslations('home.directions.items')]);
  return <footer className={styles.footer} data-site-footer="true">
    <div className={styles.top}><p className={styles.motto}>{t('motto')}</p>
      <nav aria-label={t('directionsLabel')}><span className={styles.label}>{t('directionsLabel')}</span>
        {directions.map((direction) => <Link key={direction.id} href={direction.href} prefetch={false}>{items(`${direction.contentKey}.title`)}</Link>)}
        <Link href="/#about">{t('about')}</Link>
      </nav>
      <nav aria-label={t('exploreLabel')}><span className={styles.label}>{t('exploreLabel')}</span><Link href="/gallery" prefetch={false}>{t('gallery')}</Link><Link href="/articles" prefetch={false}>{t('journal')}</Link><Link href="/showroom" prefetch={false}>{t('showroom')}</Link></nav>
      <a className={styles.invitation} href={`mailto:${site.email}`}><span>{t('invitation')}</span><ArrowUpRight /></a>
    </div>
    <p className={styles.wordmark}>{site.name}</p>
    <div className={styles.bottom}><span>© {new Date().getFullYear()} {site.name}</span><span>{t('caption')}</span><Link href="/">{t('home')}</Link></div>
  </footer>;
}
