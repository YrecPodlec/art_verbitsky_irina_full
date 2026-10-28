import {categoriesByType} from './projectClassification';
import type {ProjectCategory, ProjectType} from '@/app/generated/prisma/enums';

export type CatalogFilters = {type: ProjectType | ''; category: ProjectCategory | ''; country: string; q: string; page: number};
export type CatalogSearchParams = Record<string, string | string[] | undefined>;
export const CATALOG_PAGE_SIZE = 6;

// URL хранит состояние каталога: фильтры переживают обновление страницы и кнопку «Назад».
// Это чистая функция: не обращается ни к браузеру, ни к базе данных.
export function parseCatalogFilters(params: CatalogSearchParams): CatalogFilters {
  const first = (key: string) => typeof params[key] === 'string' ? params[key] as string : '';
  const type = first('type') === 'residential' || first('type') === 'commercial' ? first('type') as ProjectType : '';
  const candidate = first('category') as ProjectCategory;
  const allowed: readonly ProjectCategory[] = type ? categoriesByType[type] : Object.values(categoriesByType).flat();
  const country = first('country').toUpperCase();
  const page = Number(first('page') || 1);
  return {
    type, category: allowed.includes(candidate) ? candidate : '', country: /^[A-Z]{2}$/.test(country) ? country : '',
    q: first('q').trim().slice(0, 100), page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1,
  };
}

export function catalogHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  for (const key of ['type', 'category', 'country', 'q'] as const) if (filters[key]) params.set(key, filters[key]);
  if (filters.page > 1) params.set('page', String(filters.page));
  return `/gallery${params.size ? `?${params}` : ''}`;
}

export function matchingContentKeys(projects: Record<string, unknown>, query: string): string[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];
  return Object.entries(projects).filter(([, value]) => {
    if (!value || typeof value !== 'object') return false;
    const record = value as Record<string, unknown>;
    return ['name', 'country', 'city', 'summary', 'description'].some((field) =>
      typeof record[field] === 'string' && record[field].toLocaleLowerCase().includes(normalized));
  }).map(([key]) => key);
}
