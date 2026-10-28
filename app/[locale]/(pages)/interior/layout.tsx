import type {ReactNode} from 'react';
import {SiteHeader} from '@/app/[locale]/widgets/siteHeader';
import {FixedHeaderShell} from '@/app/[locale]/shared/UI/fixedHeaderShell/FixedHeaderShell';

// Интерьерная шапка относится только к /interior, не ко всему сайту.
export default function InteriorLayout({children}: {children: ReactNode}) {
  return <FixedHeaderShell header={<SiteHeader />}>{children}</FixedHeaderShell>;
}
