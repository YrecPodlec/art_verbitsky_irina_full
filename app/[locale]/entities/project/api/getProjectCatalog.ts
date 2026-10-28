import 'server-only';
import {cache} from 'react';
import {connection} from 'next/server';
import {getMessages, getTranslations} from 'next-intl/server';
import type {Prisma} from '@/app/generated/prisma/client';
import {prisma} from '@/app/[locale]/shared/lib/db/prisma';
import {localizeProjects} from '../model/getProjects';
import {CATALOG_PAGE_SIZE, matchingContentKeys, type CatalogFilters} from '../model/catalogQuery';
import {findOrderedProjects} from './findOrderedProjects';

// В MongoDB выполняются фильтры, подсчёт и пагинация. В браузер не отправляем всю коллекцию.
export async function getProjectCatalog(filters: CatalogFilters) {
  await connection();
  const messages = await getMessages();
  const t = await getTranslations('projects');
  const where: Prisma.ProjectWhereInput = {
    publicationStatus: 'published',
    ...(filters.type && {type: filters.type}), ...(filters.category && {category: filters.category}),
    ...(filters.country && {countryCode: filters.country}),
    ...(filters.q && {OR: [
      {contentKey: {in: matchingContentKeys(messages.projects as Record<string, unknown>, filters.q)}},
      {slug: filters.q.toLowerCase()}, {citySlug: filters.q.toLowerCase()},
    ]}),
  };
  const [total, countries] = await Promise.all([
    prisma.project.count({where}),
    prisma.project.findMany({where: {publicationStatus: 'published', countryCode: {not: null}}, distinct: ['countryCode'], select: {countryCode: true, contentKey: true}}),
  ]);
  const pages = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const records = await findOrderedProjects(where, (page - 1) * CATALOG_PAGE_SIZE, CATALOG_PAGE_SIZE);
  return {
    projects: await localizeProjects(records), total, pages, page,
    countries: countries.map((country) => ({value: country.countryCode!, label: t(`${country.contentKey}.country`)})).sort((a, b) => a.label.localeCompare(b.label)),
  };
}

// React cache устраняет повторное чтение одного кейса для metadata и JSX в рамках запроса.
export const getProjectBySlug = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) return null;
  await connection();
  const record = await prisma.project.findFirst({where: {slug, publicationStatus: 'published'}});
  return record ? (await localizeProjects([record]))[0] : null;
});
