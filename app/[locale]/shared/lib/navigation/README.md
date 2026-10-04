# Подготовка хлебных крошек

Крошки описывают структуру сайта. Это не кнопка «назад» и не история посещённых страниц.

## Как связаны файлы

1. [config/navigation.ts](../../config/navigation.ts) задаёт ID, адрес и родителя страницы.
2. [getBreadcrumbs.ts](getBreadcrumbs.ts) идёт по родителям к корню и возвращает цепочку маршрутов.
3. [getLocalizedBreadcrumbs.ts](getLocalizedBreadcrumbs.ts) добавляет названия из `messages.breadcrumbs`.
4. [UI/Breadcrumbs](../../UI/breadcrumbs/README.md) показывает готовый результат.

Для `gallery` цепочка сейчас такая:
`home → interior → gallery`, хотя URL страницы — `/ru/gallery`.
Переход в галерею из другого места не меняет эту цепочку.

## Подключить на страницу

```tsx
import {Breadcrumbs} from '@/app/[locale]/shared/UI/breadcrumbs';
import {getLocalizedBreadcrumbs} from '@/app/[locale]/shared/lib/navigation/getLocalizedBreadcrumbs';

export default async function GalleryPage() {
  const breadcrumbs = await getLocalizedBreadcrumbs('gallery');
  return <Breadcrumbs {...breadcrumbs} />;
}
```

Это пример только подключения крошек, а не замена всей текущей страницы галереи.

Для нового маршрута добавь ID в `PageId`, запись в `navigationPages`
и ключ `breadcrumbs.<id>` в каждой локали. Затем вызывай адаптер с этим ID
из серверной страницы. Нужный nav или widget получает готовую разметку.

`getBreadcrumbs` использует `Set` посещённых ID для защиты от циклов.
Ошибка `Circular navigation parent` означает, что нужно исправить `parent` в конфигурации.
Серверный адаптер не импортируй в компонент с `'use client'`.

Проверяй порядок цепочки, локализованные ссылки, отсутствие ссылки у текущего пункта
и скрытую цепочку на главной.
[Назад к lib](../README.md).
