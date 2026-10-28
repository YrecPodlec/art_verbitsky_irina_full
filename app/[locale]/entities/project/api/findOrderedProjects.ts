import 'server-only';
import type {Prisma} from '@/app/generated/prisma/client';
import {prisma} from '@/app/[locale]/shared/lib/db/prisma';
import {FIRST_PROJECT_CONTENT_KEY, projectPagePlan} from '../model/projectOrder';

// Общий порядок каталога, API и подборки. Фильтры применяются и к закреплённой записи.
// Пагинация остаётся в MongoDB: не скачиваем всю коллекцию ради перестановки массива.
export async function findOrderedProjects(where: Prisma.ProjectWhereInput, skip = 0, take?: number) {
  const first = await prisma.project.findFirst({where: {AND: [where, {contentKey: FIRST_PROJECT_CONTENT_KEY}]}});
  const plan = projectPagePlan(skip, take, Boolean(first));
  const rest = plan.take === 0 ? [] : await prisma.project.findMany({
    where: {AND: [where, {contentKey: {not: FIRST_PROJECT_CONTENT_KEY}}]},
    orderBy: [{createdAt: 'desc'}, {id: 'asc'}], skip: plan.skip,
    ...(plan.take === undefined ? {} : {take: plan.take}),
  });
  return plan.includeFirst && first ? [first, ...rest] : rest;
}
