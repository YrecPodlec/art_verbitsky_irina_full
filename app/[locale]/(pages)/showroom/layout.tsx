import type {ReactNode} from 'react';
import {SiteFooter} from '@/app/[locale]/widgets/siteFooter';

// Не наследуем интерьерную шапку в самостоятельном направлении.
export default function ShowroomLayout({children}: {children: ReactNode}) {
  return <>{children}<SiteFooter /></>;
}
