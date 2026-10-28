# UI — каталог общих компонентов

Папки ниже описывают внешний вид элементов. Тексты обычно передаются через props;
логика тарифов, аккаунта и отправки формы остаётся в features.

| Папка | Компоненты и применение |
| --- | --- |
| [actionLink](actionLink/README.md) | `ActionLink`, `ActionButton`: общие переходы и кнопки со стрелкой |
| [section](section/README.md) | `Section`, `SectionTitle`, `SectionHeading`, `SectionTopline`, `Eyebrow`, `FinePrint`: оформление секций |
| [breadcrumbs](breadcrumbs/README.md) | `Breadcrumbs`: отображение готовой цепочки страниц |
| [pagination](pagination/README.md) | `Pagination`: номера страниц, прямые стрелки и неактивные состояния |
| [fixedHeaderShell](fixedHeaderShell/README.md) | Место под фиксированную шапку без глобального отступа на всех страницах |
| [accordion](accordion/README.md) | `AccordionItem`: раскрывающийся пункт на `details` |
| [formField](formField/README.md) | `FormField`: подпись и оформление input/select/textarea |
| [icons](icons/README.md) | SVG-стрелки и сердце |
| [floorPlan/FloorPlan.tsx](floorPlan/FloorPlan.tsx) | Декоративная векторная планировка, prop `caption` — её подпись |
| [sectionPlaceholder/SectionPlaceholder.tsx](sectionPlaceholder/SectionPlaceholder.tsx) | Временная страница с props `section` и `breadcrumbs` |
| [mainLinkCards/mainLinkCards.tsx](mainLinkCards/mainLinkCards.tsx) | Карточка-картинка главной: `src`, `alt`, `href` |
| [tags/tags.tsx](tags/tags.tsx) | Простая подпись через `tagName`; сейчас не подключена к странице интерьера |

## Стили и импорты

SCSS-модуль расположен рядом с TSX. Его классы используются только через импорт `styles`.

Для портфолио добавлены `iconButton/IconButton.tsx` (компактные кнопки просмотрщика),
`portfolioState/PortfolioState.tsx` (пустое состояние/ошибка с текстами из props) и
`refreshButton/RefreshButton.tsx` (повторный запрос серверной страницы с pending-состоянием).
Последний переиспользует ActionButton и не содержит собственной копии стилей.
Цвета и длительности движения доступны через переменные из `../../globals.css`.
`className`, если компонент его принимает, позволяет задать расположение в конкретном блоке.

Общий `UI/index.ts` сейчас экспортирует только старые `Tags` и `MainLinkCards`.
Для новых компонентов с собственным `index.ts` используется импорт из их папки,
например `@/app/[locale]/shared/UI/actionLink`.

## Небольшие компоненты без отдельного README

У `FloorPlan` рисунок меняется в SVG внутри TSX, сетка и цвета — в соседнем SCSS.
Это прежняя декоративная схема. `workProcess` теперь показывает обычную картинку
`public/img.png` вместо неё; здесь компонент оставлен для возможного повторного использования.

`SectionPlaceholder` принимает `section: 'gallery' | 'articles' | 'showroom'`.
Тексты берёт из `siteHeader`, возвращает отдельный `main`.
При готовой странице её заменяют в файле маршрута; не вкладывай этот компонент в другой `main`.

`MainLinkCards` — изображение со ссылкой, использующее `Image fill`:
размер контейнера задаёт его SCSS. Выбор карточек описан в
[mainCardFeature](../../features/mainCardFeature/README.md).
`Tags` сейчас просто выводит строку; соседний SCSS-модуль компонентом не импортируется.
