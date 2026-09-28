import {useTranslations} from 'next-intl';
import styles from './interior-home.module.scss';

// Footer завершает страницу и повторяет ссылки на существующие разделы.
export function SiteFooter() {
  const t = useTranslations('interior.footer');
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <p>{t('taglineLine1')}<br />{t('taglineLine2')}</p>
        <nav aria-label={t('sectionsLabel')}>
          <a href="#projects">{t('projects')}</a>
          <a href="#services">{t('services')}</a>
          <a href="#approach">{t('approach')}</a>
        </nav>
        <a className={styles.footerContact} href="#contacts">
          {t('contactLine1')}<br />{t('contactLine2')} ↗
        </a>
      </div>
      <div className={styles.footerLarge}>{t('brandName')}</div>
      <div className={styles.footerBottom}>
        <span>{t('brandCaption')}</span>
        <span>{t('legalPlaceholder')}</span>
        <a href="#beginning">{t('backToTop')} ↑</a>
      </div>
    </footer>
  );
}
