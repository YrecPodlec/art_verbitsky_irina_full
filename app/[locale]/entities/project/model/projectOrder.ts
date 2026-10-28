// Редакторский приоритет: Майами первым, остальные — от новых к старым.
// Не подменяем даты в MongoDB и не связываем порядок с флагом featured.
export const FIRST_PROJECT_CONTENT_KEY = 'miami';

// Закреплённый проект занимает одно место только на первой странице.
// На следующих страницах смещение обычных записей уменьшается на это место.
export function projectPagePlan(skip: number, take: number | undefined, hasFirst: boolean) {
  const includeFirst = hasFirst && skip === 0;
  return {
    includeFirst,
    skip: Math.max(0, skip - Number(hasFirst)),
    take: take === undefined ? undefined : Math.max(0, take - Number(includeFirst)),
  };
}
