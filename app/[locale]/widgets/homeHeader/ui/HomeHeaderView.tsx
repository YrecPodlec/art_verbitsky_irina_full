'use client';

import {useEffect, useId, useRef, useState} from 'react';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from '@/app/[locale]/features/languageSwitcher/ui/LanguageSwitcher';
import {useFixedHeaderOffset} from '@/app/[locale]/shared/lib/layout/useFixedHeaderOffset';
import {site} from '@/app/[locale]/shared/config/site';
import {ArrowUpRight} from '@/app/[locale]/shared/UI/icons/ArrowUpRight';
import styles from './HomeHeader.module.scss';

type Copy = {brand: string; caption: string; brandLabel: string; navigation: string; directions: string; about: string; contact: string; write: string; openMenu: string; closeMenu: string};

// Здесь только поведение меню и измерение шапки. Выпадающий язык — существующая feature.
export function HomeHeaderView({copy}: {copy: Copy}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useFixedHeaderOffset(ref);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    const closeEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); menuRef.current?.focus(); } };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeEscape); };
  }, [open]);
  const links = [{href: '/#directions', label: copy.directions}, {href: '/#about', label: copy.about}, {href: '/#contact', label: copy.contact}];
  return <header className={styles.header} ref={ref} data-home-header="true">
    <div className={styles.inner}>
      <Link className={styles.brand} href="/" aria-label={copy.brandLabel} onClick={() => setOpen(false)}>
        <Image src="/home/monogram.svg" width={48} height={48} alt="" /><span>{copy.brand}<small>{copy.caption}</small></span>
      </Link>
      <nav className={styles.desktopNav} aria-label={copy.navigation}>{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      <div className={styles.actions}>
        <LanguageSwitcher />
        <a className={styles.write} href={`mailto:${site.email}`}>{copy.write}<ArrowUpRight /></a>
        <button className={styles.menuButton} type="button" ref={menuRef} aria-label={open ? copy.closeMenu : copy.openMenu}
          aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((value) => !value)}><span /><span /></button>
      </div>
    </div>
    <nav className={`${styles.mobileNav} ${open ? styles.mobileNavOpen : ''}`} id={menuId} aria-label={copy.navigation} aria-hidden={!open} inert={!open}>
      {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
    </nav>
  </header>;
}
