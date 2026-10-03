import type {ReactNode} from 'react';
import styles from './FormField.module.scss';

// Вложенный input/select автоматически связан с label; компонент подходит для разных форм.
export function FormField({label, children}: {label: string; children: ReactNode}) {
  return <label className={styles.field}><span>{label}</span>{children}</label>;
}
