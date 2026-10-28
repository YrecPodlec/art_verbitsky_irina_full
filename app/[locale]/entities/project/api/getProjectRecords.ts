import 'server-only';
import {connection} from 'next/server';
import {findOrderedProjects} from './findOrderedProjects';

export type ProjectQuery = {
  featured?: boolean;
  limit?: number;
};

// Запрос не знает ничего о JSX и переводах. Черновики никогда не отдаём посетителю.
export async function getProjectRecords({featured, limit}: ProjectQuery = {}) {
  if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)) {
    throw new RangeError('INVALID_PROJECT_LIMIT');
  }

  // Читаем актуальную БД при запросе страницы, а не сохраняем подборку на этапе сборки.
  // Это серверный рендеринг: содержимое остаётся доступным поисковым системам.
  await connection();
  return findOrderedProjects({
    publicationStatus: 'published', ...(featured === undefined ? {} : {featured}),
  }, 0, limit);
}
