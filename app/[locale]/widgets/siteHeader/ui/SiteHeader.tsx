'use client';

import {useEffect, useId, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from '@/app/[locale]/features/languageSwitcher/ui/LanguageSwitcher';
import {ProfileButton} from '@/app/[locale]/features/profileButton/ui/ProfileButton';
import {NavLink} from './NavLink';
import styles from './SiteHeader.module.scss';

const links = [
  {id: 'gallery', href: '/gallery'},
  {id: 'articles', href: '/articles'},
  {id: 'showroom', href: '/showroom'},
] as const;

// Общая шапка из макета: сохраняет состав навигации и плавно раскрывает меню на узком экране.
export function SiteHeader() {
  const t = useTranslations('siteHeader');
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuId = useId();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Fixed-шапка не участвует в потоке: измеряем её реальную высоту, а не задаём её вручную.
    const syncOffset = () => document.documentElement.style.setProperty('--site-header-offset', `${header.offsetHeight}px`);
    const observer = new ResizeObserver(syncOffset);
    observer.observe(header);
    syncOffset();

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--site-header-offset');
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header} ref={headerRef}>
      <Link className={styles.brand} href="/" aria-label={t('brandLabel')} onClick={() => setMenuOpen(false)}>
        {/* Заглушку заменим изображением логотипа, когда оно будет готово. */}
        <span className={styles.logoPlaceholder} aria-hidden="true">IV</span>
        <span className={styles.brandName}>{t('brandName')}<small>{t('brandCaption')}</small></span>
      </Link>

      <nav className={styles.desktopNav} aria-label={t('mainNavigation')}>
        {links.map(({id, href}) => (
          <NavLink key={id} href={href} accented={id === 'showroom'}>
            {id === 'showroom' && <span className={styles.cube} aria-hidden="true">◇</span>}
            {t(id)}{id === 'showroom' && <span aria-hidden="true"> ↗</span>}
          </NavLink>
        ))}
      </nav>

      <div className={styles.actions}>
        <LanguageSwitcher />
        <span className={styles.desktopProfile}><ProfileButton /></span>
        <button
          className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ''}`}
          type="button"
          aria-label={t(menuOpen ? 'closeMenu' : 'openMenu')}
          aria-expanded={menuOpen}
          aria-controls={mobileMenuId}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span /><span />
        </button>
      </div>

      <nav className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`} id={mobileMenuId} aria-label={t('mobileNavigation')} aria-hidden={!menuOpen} inert={!menuOpen}>
        <NavLink href="/" mobile onClick={() => setMenuOpen(false)}>{t('home')}</NavLink>
        {links.map(({id, href}) => (
          <NavLink key={id} href={href} mobile accented={id === 'showroom'} onClick={() => setMenuOpen(false)}>
            {t(id)}{id === 'showroom' && <span aria-hidden="true"> ↗</span>}
          </NavLink>
        ))}
        <ProfileButton mobile />
      </nav>
    </header>
  );
}
