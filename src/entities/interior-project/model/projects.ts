export type InteriorProject = {
  id: string;
  image: string;
  position: string;
};

// Данные из макета демонстрационные: реальные кейсы и фотографии заменим после согласования.
export const featuredProjects: InteriorProject[] = [
  {
    id: 'miami',
    image: '/interior/interior-evening.png',
    position: '70% 50%',
  },
  {
    id: 'dubai',
    image: '/interior/project-placeholder.jpeg',
    position: '50% 50%',
  },
  {
    id: 'los-angeles',
    image: '/interior/interior-evening.png',
    position: '98% 50%',
  },
];
