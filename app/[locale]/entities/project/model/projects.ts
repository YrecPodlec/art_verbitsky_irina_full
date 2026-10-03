import type {StaticImageData} from 'next/image';
import interiorImage from '@/public/interior/interior-evening.png';
import placeholderImage from '@/public/interior/project-placeholder.jpeg';

export type ProjectId = 'miami' | 'dubai' | 'los-angeles';

export type ProjectData = {
  id: ProjectId;
  image: StaticImageData;
  imagePosition: 'center' | 'right' | 'farRight';
  featured: boolean;
  isDemo: boolean;
};

// Только данные и настройки изображений из макета. Все подписи находятся в messages.projects.
// featured — подборка для портфолио, а не избранное конкретного пользователя.
export const projectData: readonly ProjectData[] = [
  {id: 'miami', image: interiorImage, imagePosition: 'right', featured: true, isDemo: true},
  {id: 'dubai', image: placeholderImage, imagePosition: 'center', featured: true, isDemo: true},
  {id: 'los-angeles', image: interiorImage, imagePosition: 'farRight', featured: true, isDemo: true},
];
