import {navigationPages, type NavigationPage, type PageId} from '../../config/navigation';

type BreadcrumbRoute = {
  id: PageId;
  href: string;
};

// Чистая функция: строит цепочку без React, переводов и истории браузера.
export function getBreadcrumbs(pageId: PageId): BreadcrumbRoute[] {
  const items: BreadcrumbRoute[] = [];
  const visited = new Set<PageId>();
  let currentPage: PageId | null = pageId;

  while (currentPage !== null) {
    // Запоминаем пройденные страницы: ошибка в родителях не должна создать бесконечный цикл.
    if (visited.has(currentPage)) {
      throw new Error(`Circular navigation parent: ${currentPage}`);
    }
    visited.add(currentPage);

    const {href, parent}: NavigationPage = navigationPages[currentPage];
    // Идём от текущей страницы к корню, поэтому каждого родителя вставляем в начало.
    items.unshift({id: currentPage, href});
    currentPage = parent;
  }

  return items;
}
