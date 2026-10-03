'use client';

import type {ReactNode} from 'react';
import {Link, usePathname} from '@/i18n/navigation';
import styles from './NavLink.module.scss';

type Props = {
  href: string;
  children: ReactNode;
  mobile?: boolean;
  accented?: boolean;
  onClick?: () => void;
};

// Ссылка сама отмечает активную страницу и одинаково работает в десктопном и мобильном меню.
export function NavLink({href, children, mobile = false, accented = false, onClick}: Props) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={`${styles.link} ${mobile ? styles.mobile : ''} ${accented ? styles.accented : ''}`}
      aria-current={pathname === href ? 'page' : undefined}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
