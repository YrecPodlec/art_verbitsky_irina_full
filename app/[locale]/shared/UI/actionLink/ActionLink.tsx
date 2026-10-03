import type {ComponentProps} from 'react';
import {Link} from '@/i18n/navigation';
import {ActionContent, actionClassName, type ActionAppearance} from './ActionContent';

export type ActionLinkProps = ActionAppearance & Omit<ComponentProps<typeof Link>, keyof ActionAppearance>;

// Это ссылка для перехода, даже если визуально она выглядит как кнопка.
// Компонент отвечает только за оформление: маршрут и переведённый текст задаёт вызывающий блок.
export function ActionLink({
  href,
  children,
  variant = 'text',
  size = 'small',
  direction = 'upRight',
  caption,
  index,
  className,
  ...linkProps
}: ActionLinkProps) {
  const appearance = {children, variant, size, direction, caption, index, className};

  return (
    <Link {...linkProps} className={actionClassName(appearance)} href={href}>
      <ActionContent {...appearance} />
    </Link>
  );
}
