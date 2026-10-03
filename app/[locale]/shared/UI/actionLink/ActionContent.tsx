import type {ReactNode} from 'react';
import {ArrowUpRight} from '../icons/ArrowUpRight';
import {ArrowDown} from '../icons/ArrowDown';
import styles from './ActionLink.module.scss';

export type ActionAppearance = {
  children: ReactNode;
  variant?: 'text' | 'outline' | 'gold' | 'green' | 'path';
  size?: 'small' | 'large';
  direction?: 'upRight' | 'down';
  caption?: string;
  index?: string;
  className?: string;
};

export function actionClassName({variant = 'text', size = 'small', direction = 'upRight', className}: ActionAppearance) {
  return [styles.link, styles[variant], styles[size], direction === 'down' && styles.down, className].filter(Boolean).join(' ');
}

// Кнопка и ссылка используют одинаковое содержимое и анимации, но сохраняют свою HTML-семантику.
export function ActionContent({children, caption, index, direction = 'upRight'}: ActionAppearance) {
  return <>
    {index && <span className={styles.index} aria-hidden="true">{index}</span>}
    <span className={styles.copy}>
      {caption && <span className={styles.caption}>{caption}</span>}
      <span className={styles.label}>{children}</span>
    </span>
    {direction === 'down' ? <ArrowDown className={styles.arrow} /> : <ArrowUpRight className={styles.arrow} />}
  </>;
}
