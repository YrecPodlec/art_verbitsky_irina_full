# Общая конфигурация

Сейчас здесь один файл: [navigation.ts](navigation.ts).
Он задаёт список ID страниц, их `href` и логического родителя `parent`
для хлебных крошек.

`PageId` — допустимые идентификаторы. `parent: null` означает корень.
`gallery`, `articles` и `showroom` имеют родителя `interior`,
при этом их URL остаются плоскими: `/gallery`, `/articles`, `/showroom`.

Чтобы добавить страницу, обнови `PageId`, `navigationPages` и перевод
`breadcrumbs.<id>` в обеих локалях. Сам маршрут создаётся отдельно.
Не создавай циклы в родителях.

Полный пример использования: [lib/navigation](../lib/navigation/README.md).
Список ссылок навбара хранится отдельно в `SiteHeader.tsx`; эта конфигурация его не изменяет.
[Назад к shared](../README.md).
