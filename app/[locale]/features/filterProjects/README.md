# Фильтры каталога

`ui/GalleryFilters.tsx` — вкладки, категория, страна и форма поиска.
`model/useCatalogNavigation.ts` — переход на URL новых фильтров с pending-состоянием.
Чистый разбор URL, ограничение ввода и построение ссылки находятся в
`entities/project/model/catalogQuery.ts` и проверяются без браузера.

Поиск отправляется по Enter/кнопке; выбор типа сбрасывает несовместимую категорию.
Любая смена фильтра возвращает на первую страницу. Данные фильтрует сервер,
а не массив в React state. Кнопки Back/Forward восстанавливают URL и выдачу.
Тексты передаются из `messages.gallery` и `messages.projectClassification`.

[Полная карта галереи](../../(pages)/gallery/README.md).
