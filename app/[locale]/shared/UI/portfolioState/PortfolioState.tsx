import type {ReactNode} from 'react';
import styles from './PortfolioState.module.scss';

// Пустая выдача, отсутствие материалов и ошибка — разные тексты в одном оформлении.
export function PortfolioState({title, description, children}: {title: string; description: string; children?: ReactNode}) {
  return <div className={styles.state}>
    <span className={styles.symbol} aria-hidden="true">◇</span>
    <h2>{title}</h2><p>{description}</p>
    {children && <div className={styles.action}>{children}</div>}
  </div>;
}
