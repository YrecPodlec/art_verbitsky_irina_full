import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';
import {Link} from '@/i18n/navigation';
import styles from './SectionPlaceholder.module.scss';

type Section = 'gallery' | 'articles' | 'showroom';

type SectionPlaceholderProps = {
  section: Section;
  breadcrumbs?: ReactNode;
};

// Временная точка назначения: ссылки шапки работают до переноса соответствующей страницы макета.
export function SectionPlaceholder({section, breadcrumbs}: SectionPlaceholderProps) {
  const t = useTranslations('siteHeader');
  return (
    <main className={styles.page}>
      {breadcrumbs}
      <p>{t('comingSoon')}</p>
      <h1>{t(section)}</h1>
      <Link className={styles.backLink} href="/">{t('backHome')} ↗</Link>
    </main>
  );
}
