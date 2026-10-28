import 'server-only';
import {cache} from 'react';
import {connection} from 'next/server';
import {getTranslations} from 'next-intl/server';
import {prisma} from '@/app/[locale]/shared/lib/db/prisma';
import {getProjectCover} from '../model/getProjectCover';

// Одна серверная обложка для разных блоков. Повторное использование на странице
// не создаёт второй запрос: React cache действует в пределах текущего рендера.
export const getProjectCoverImage = cache(async (contentKey: string) => {
  await connection();
  const record = await prisma.project.findFirst({
    where: {contentKey, publicationStatus: 'published'},
    select: {media: true, coverMediaId: true, coverPosition: true},
  });
  if (!record) return null;
  const cover = getProjectCover(record);
  const t = await getTranslations('projects');
  return {url: cover.url, alt: t(`${contentKey}.media.${cover.contentKey}.alt`), position: record.coverPosition};
});
