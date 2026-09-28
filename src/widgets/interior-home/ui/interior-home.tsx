import type {ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {SiteHeader} from './site-header';
import {SiteFooter} from './site-footer';
import styles from './interior-home.module.scss';

// Общая оболочка направления Interior Design: шапка, область страницы и футер.
export function InteriorShell({children}: {children: ReactNode}) {
  const t = useTranslations('interior.common');
  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#interior-main">
        {t('skipLink')}
      </a>
      <SiteHeader />
      <main id="interior-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
