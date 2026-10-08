import type {Project, ProjectMedia} from '@/app/generated/prisma/client';

// Чистая функция: её можно проверять без React, переводов и подключения к БД.
// Если обложка явно задана, не подменяем ошибочный ID другим изображением молча.
export function getProjectCover(project: Pick<Project, 'coverMediaId' | 'media'>): ProjectMedia {
  const cover = project.coverMediaId
    ? project.media.find((image) => image.id === project.coverMediaId)
    : project.media[0];
  if (!cover) throw new Error('PROJECT_COVER_NOT_FOUND');
  return cover;
}
