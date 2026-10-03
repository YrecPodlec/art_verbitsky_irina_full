import type {ComponentProps} from 'react';
import {ActionContent, actionClassName, type ActionAppearance} from './ActionContent';

type ActionButtonProps = ActionAppearance & Omit<ComponentProps<'button'>, keyof ActionAppearance>;

// Для отправки формы и других действий используем button, сохраняя оформление ActionLink.
export function ActionButton({children, variant, size, direction, caption, index, className, type = 'button', ...props}: ActionButtonProps) {
  const appearance = {children, variant, size, direction, caption, index, className};
  return <button {...props} type={type} className={actionClassName(appearance)}><ActionContent {...appearance} /></button>;
}
