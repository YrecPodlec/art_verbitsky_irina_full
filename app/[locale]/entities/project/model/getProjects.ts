import {getTranslations} from 'next-intl/server';
import {projectData, type ProjectData} from './projects';

export type Project = ProjectData & {
  name: string;
  country: string;
  city: string;
  description: string;
  spaceType: string;
  imageAlt: string;
};

// Серверный адаптер подготавливает локализованные проекты для любой страницы.
// Позже источник данных можно заменить API, сохранив тот же формат для карточки.
export async function getProjects(): Promise<Project[]> {
  const t = await getTranslations('projects');

  return projectData.map((project) => ({
    ...project,
    name: t(`${project.id}.name`),
    country: t(`${project.id}.country`),
    city: t(`${project.id}.city`),
    description: t(`${project.id}.description`),
    spaceType: t(`${project.id}.spaceType`),
    imageAlt: t(`${project.id}.imageAlt`),
  }));
}
