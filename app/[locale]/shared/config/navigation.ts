export type PageId = 'home' | 'interior' | 'gallery' | 'articles' | 'showroom';

export type NavigationPage = {
  href: string;
  parent: PageId | null;
};

// Родитель задаёт место страницы в структуре сайта, а не вложенность её URL.
// При добавлении страницы здесь задаём маршрут и родителя, а название — в messages.breadcrumbs.
export const navigationPages: Record<PageId, NavigationPage> = {
  home: {href: '/', parent: null},
  interior: {href: '/interior', parent: 'home'},
  gallery: {href: '/gallery', parent: 'interior'},
  articles: {href: '/articles', parent: 'interior'},
  showroom: {href: '/showroom', parent: 'interior'},
};
