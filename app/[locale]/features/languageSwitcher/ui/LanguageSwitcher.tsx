'use client';

import {useEffect, useId, useRef, useState} from 'react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import ruFlag from '@/app/[locale]/shared/assets/flags/ru.svg';
import usFlag from '@/app/[locale]/shared/assets/flags/us.svg';
import styles from './LanguageSwitcher.module.scss';

const flags: Record<string, typeof ruFlag> = {ru: ruFlag, en: usFlag};

// Переключает язык на текущем маршруте; флаг — подсказка, код языка остаётся видимым текстом.
export function LanguageSwitcher() {
  const t = useTranslations('siteHeader');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const currentFlag = flags[locale];

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        className={styles.trigger}
        type="button"
        aria-label={t('languageLabel', {locale: locale.toUpperCase()})}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        {currentFlag ? <Image className={styles.flag} src={currentFlag} alt="" width={32} height={24} /> : <span aria-hidden="true">🌐</span>}
        <span>{locale.toUpperCase()}</span>
        <span className={styles.chevron} aria-hidden="true">⌄</span>
      </button>
      <nav className={`${styles.options} ${open ? styles.optionsOpen : ''}`} id={listId} aria-label={t('languageOptions')} aria-hidden={!open} inert={!open}>
        {routing.locales.map((option) => (
          <Link
            className={styles.option}
            href={pathname || '/'}
            locale={option}
            lang={option}
            key={option}
            aria-current={locale === option ? 'true' : undefined}
            onClick={() => setOpen(false)}
          >
            {flags[option] ? <Image className={styles.flag} src={flags[option]} alt="" width={32} height={24} /> : <span aria-hidden="true">🌐</span>}
            <span>{option.toUpperCase()}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
