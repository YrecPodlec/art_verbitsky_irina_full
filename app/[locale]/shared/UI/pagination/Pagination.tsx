import {Link} from '@/i18n/navigation';
import {ArrowHorizontal} from '../icons/ArrowHorizontal';
import styles from './Pagination.module.scss';

type Props = {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  labels: {navigation: string; previous: string; next: string; page: (page: number) => string};
  className?: string;
};

// Серверный переиспользуемый UI: не знает о MongoDB или фильтрах каталога.
// Переходы — ссылки, недоступные стрелки — настоящие disabled-кнопки без href.
export function Pagination({currentPage, totalPages, hrefForPage, labels, className}: Props) {
  if (totalPages < 1) return null;
  const previous = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;

  function arrow(direction: 'left' | 'right', page: number | null, label: string) {
    const icon = <ArrowHorizontal direction={direction} className={styles.arrow} />;
    return page === null
      ? <button className={styles.control} type="button" disabled aria-label={label} title={label}>{icon}</button>
      : <Link className={styles.control} href={hrefForPage(page)} scroll={false} prefetch={false}
          rel={direction === 'left' ? 'prev' : 'next'} aria-label={label} title={label}>{icon}</Link>;
  }

  return <nav className={[styles.pagination, className].filter(Boolean).join(' ')} aria-label={labels.navigation} data-pagination="true">
    {arrow('left', previous, labels.previous)}
    <ol className={styles.pages}>
      {Array.from({length: totalPages}, (_, index) => {
        const page = index + 1;
        return <li key={page}>
          <Link className={styles.control} href={hrefForPage(page)} scroll={false} prefetch={false}
            aria-label={labels.page(page)} aria-current={page === currentPage ? 'page' : undefined}>{page}</Link>
        </li>;
      })}
    </ol>
    {arrow('right', next, labels.next)}
  </nav>;
}
