import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {useLocale, useTranslations} from 'next-intl';
import styles from './interior-home.module.scss';

// Header отвечает только за навигацию этой страницы; мобильное меню работает через HTML details.
export function SiteHeader() {
  const t = useTranslations('interior.header');
  const locale = useLocale();
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/interior" aria-label={t('brandLabel')}>
        <span className={styles.brandMark} aria-hidden="true">iv</span>
        <span className={styles.brandName}>{t('brandName')}<small>{t('brandCaption')}</small></span>
      </Link>
      <nav className={styles.desktopNav} aria-label={t('mainNavigation')}>
        <a href="#projects">{t('projects')}</a>
        <a href="#services">{t('services')}</a>
        <a href="#approach">{t('approach')}</a>
        <a href="#contacts">{t('contacts')}</a>
      </nav>
      <div className={styles.headerActions}>
        {/* Список строится из routing.locales, поэтому число языков не зашито в компоненте. */}
        <details className={styles.languageMenu}>
          <summary className={styles.language} aria-label={t('languageLabel')}>{locale.toUpperCase()} ▾</summary>
          <nav className={styles.languageOptions} aria-label={t('languageLabel')}>
            {routing.locales.map((option) => (
              <Link key={option} href="/interior" locale={option} lang={option} aria-current={locale === option ? 'page' : undefined}>
                {option.toUpperCase()}
              </Link>
            ))}
          </nav>
        </details>
        <a className={styles.headerContact} href="#contacts">{t('contactCta')} ↗</a>
        <details className={styles.mobileMenu}>
          <summary aria-label={t('openMenu')}><span></span><span></span></summary>
          <nav aria-label={t('mobileNavigation')}>
            <a href="#projects">{t('projects')}</a><a href="#services">{t('services')}</a><a href="#approach">{t('approach')}</a><a href="#contacts">{t('contacts')}</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
