import {Link} from '@/i18n/navigation';
import styles from './Breadcrumbs.module.scss';

type BreadcrumbItem = {
  href: string;
  label: string;
};

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  label: string;
};

// Компонент отображает готовую цепочку. Ему не нужно знать текущий URL или родителей страниц.
// На главной странице цепочка из одного пункта не показывается.
export function Breadcrumbs({items, label}: BreadcrumbsProps) {
  if (items.length < 2) return null;

  return (
    <nav className={styles.root} aria-label={label}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li className={styles.item} key={item.href}>
            {index > 0 && <span className={styles.separator} aria-hidden="true">›</span>}
            {/* Последний пункт — текущая страница, поэтому переход на неё не нужен. */}
            {index === items.length - 1 ? (
              <span className={styles.current} aria-current="page">{item.label}</span>
            ) : (
              <Link className={styles.link} href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
