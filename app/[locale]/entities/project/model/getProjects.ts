import 'server-only';
import {getTranslations} from 'next-intl/server';
import {getProjectRecords, type ProjectQuery} from '../api/getProjectRecords';
import {getProjectCover} from './getProjectCover';
import type {ProjectData} from './projects';
import type {Project as ProjectRecord} from '@/app/generated/prisma/client';

export type Project = ProjectData & {
  contentKey: string;
  name: string;
  country: string;
  city: string;
  summary: string;
  description: string;
  story: string;
  spaceType: string;
  imageAlt: string;
  type: ProjectRecord['type'];
  category: ProjectRecord['category'];
  areaM2: number | null;
  year: number | null;
  media: LocalizedProjectMedia[];
};

export type LocalizedProjectMedia = {id: string; contentKey: string; category: string; url: string; width: number; height: number; alt: string; caption: string};

// Один адаптер используется каталогом, кейсом и подборкой. Prisma-объекты не уходят в браузер.
export async function localizeProjects(records: ProjectRecord[]): Promise<Project[]> {
  const [t, classification] = await Promise.all([getTranslations('projects'), getTranslations('projectClassification')]);
  return records.map((record) => {
    const cover = getProjectCover(record);
    const key = record.contentKey;
    return {
      id: record.id, slug: record.slug, contentKey: record.contentKey, featured: record.featured, type: record.type, category: record.category,
      areaM2: record.areaM2, year: record.year, image: cover.url, imagePosition: record.coverPosition ?? {x: 50, y: 50},
      name: t(`${key}.name`), country: t(`${key}.country`), city: t(`${key}.city`), summary: t(`${key}.summary`),
      description: t(`${key}.description`), story: t(`${key}.story`), spaceType: classification(`categories.${record.category}`),
      imageAlt: t(`${key}.media.${cover.contentKey}.alt`),
      media: record.media.map((image) => ({
        id: image.id, contentKey: image.contentKey, category: image.category, url: image.url, width: image.width, height: image.height,
        alt: t(`${key}.media.${image.contentKey}.alt`),
        caption: t.has(`${key}.media.${image.contentKey}.caption`) ? t(`${key}.media.${image.contentKey}.caption`) : '',
      })),
    };
  });
}

// Серверный адаптер подготавливает локализованные проекты для любой страницы.
// База хранит коды; этот адаптер добавляет тексты из JSON выбранного языка.
export async function getProjects(query: ProjectQuery = {}): Promise<Project[]> {
  return localizeProjects(await getProjectRecords(query));
}
