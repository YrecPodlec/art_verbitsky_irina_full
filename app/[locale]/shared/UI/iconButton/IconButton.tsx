import type {ComponentProps} from 'react';
import styles from './IconButton.module.scss';

// Доступная кнопка для компактных действий: подпись читает скринридер, символ виден пользователю.
export function IconButton({label, children, className, ...props}: ComponentProps<'button'> & {label: string}) {
  return <button {...props} type="button" className={[styles.button, className].filter(Boolean).join(' ')} aria-label={label} title={label}><span aria-hidden="true">{children}</span></button>;
}
