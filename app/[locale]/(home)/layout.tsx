import type {ReactNode} from 'react';
import {HomeHeader} from '@/app/[locale]/widgets/homeHeader';
import {SiteFooter} from '@/app/[locale]/widgets/siteFooter';
import {FixedHeaderShell} from '@/app/[locale]/shared/UI/fixedHeaderShell/FixedHeaderShell';
import styles from './home.module.scss';

// Скобки в (home) не добавляют сегмент в URL: главная остаётся /ru или /en.
// Здесь отдельная шапка и тема главной, а общий locale-layout только задаёт язык.
export default function HomeLayout({children}: {children: ReactNode}) {
  return <div className={styles.root}><FixedHeaderShell header={<HomeHeader />}>{children}<SiteFooter /></FixedHeaderShell></div>;
}
