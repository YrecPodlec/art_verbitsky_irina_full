import styles from './DesignerAbout.module.scss';

// Повторяющийся пункт подхода получает готовые тексты; ключи словаря остаются у виджета.
export function Principle({index, title, description}: {index: number; title: string; description: string}) {
  return <li className={styles.principle}><span>{String(index).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>;
}
