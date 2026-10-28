import type {ReactNode} from 'react';
import {SiteFooter} from '@/app/[locale]/widgets/siteFooter';
import styles from './portfolio.module.scss';

// Общий футер каталога и кейсов. Интерьерная шапка сюда больше не наследуется.
export default function PortfolioLayout({children}: {children: ReactNode}) {
  return <div className={styles.root}>{children}<SiteFooter /></div>;
}
