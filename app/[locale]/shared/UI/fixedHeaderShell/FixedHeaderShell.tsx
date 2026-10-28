import type {ReactNode} from 'react';
import styles from './FixedHeaderShell.module.scss';

// Серверная оболочка резервирует место под любую фиксированную шапку.
// Страницы без шапки не получают лишний отступ на body.
export function FixedHeaderShell({header, children}: {header: ReactNode; children: ReactNode}) {
  return <div className={styles.shell}>{header}{children}</div>;
}
