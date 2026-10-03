import type {ReactNode} from 'react';
import styles from './AccordionItem.module.scss';

// Нативный details работает с клавиатурой и без JavaScript. Состояние раскрытия ведёт браузер.
export function AccordionItem({title, index, children, defaultOpen = false}: {title: string; index: string; children: ReactNode; defaultOpen?: boolean}) {
  return <details className={styles.item} open={defaultOpen}>
    <summary><span className={styles.index}>{index}</span><h3>{title}</h3><span className={styles.toggle} aria-hidden="true">＋</span></summary>
    <div className={styles.content}>{children}</div>
  </details>;
}
