import type {ReactNode} from 'react';
import {SiteFooter} from '@/app/[locale]/widgets/siteFooter';

// Будущий журнал получит собственную шапку; подвал уже общий для сайта.
export default function ArticlesLayout({children}: {children: ReactNode}) {
  return <>{children}<SiteFooter /></>;
}
