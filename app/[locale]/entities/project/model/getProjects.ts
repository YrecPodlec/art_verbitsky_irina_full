import 'server-only';
import {getTranslations} from 'next-intl/server';
import {getProjectRecords, type ProjectQuery} from '../api/getProjectRecords';
import {getProjectCover} from './getProjectCover';
import type {ProjectData} from './projects';

export type Project = ProjectData & {
  name: string;
  country: string;
  city: string;
  summary: string;
  description: string;
  story: string;
  spaceType: string;
  imageAlt: string;
};

// Серверный адаптер подготавливает локализованные проекты для любой страницы.
// База хранит коды; этот адаптер добавляет тексты из JSON выбранного языка.
export async function getProjects(query: ProjectQuery = {}): Promise<Project[]> {
  const [records, t, classification] = await Promise.all([
    getProjectRecords(query),
    getTranslations('projects'),
    getTranslations('projectClassification'),
  ]);

  return records.map((record) => {
    const cover = getProjectCover(record);
    const key = record.contentKey;
    return {
      id: record.id,
      slug: record.slug,
      featured: record.featured,
      image: cover.url,
      imagePosition: record.coverPosition ?? {x: 50, y: 50},
      name: t(`${key}.name`),
      country: t(`${key}.country`),
      city: t(`${key}.city`),
      summary: t(`${key}.summary`),
      description: t(`${key}.description`),
      story: t(`${key}.story`),
      spaceType: classification(`categories.${record.category}`),
      imageAlt: t(`${key}.media.${cover.contentKey}.alt`),
    };
  });
}
