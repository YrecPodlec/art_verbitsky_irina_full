# MainCardFeature — карточки исходной главной

Это ранний компонент главной `app/[locale]/page.tsx`, отдельной от `/interior`.
Файлы пока лежат прямо в папке без `ui` и `model`.

[mainCardFeature.tsx](mainCardFeature.tsx) содержит массив карточек:
`id` — ключ перевода, `href` — переход, `src` — изображение.
Он передаёт данные в `MainLinkCards`; расположение карточек задаёт
[mainCardFeature.module.scss](mainCardFeature.module.scss).

`interior` ведёт на `/interior`, а `art` и `about` пока имеют временный адрес
`test2`; соответствующий маршрут не создан.
Подписи ожидаются в `home.cards`, которого сейчас нет в словарях.

Чтобы доработать главную, согласуй её направления, создай реальные маршруты,
восстанови переводы и обнови массив. Для внешнего вида одной карточки открой
`shared/UI/mainLinkCards/mainLinkCards.module.scss`.

Экспорт через `features/index.ts` сейчас ведёт именно к этому компоненту.
[Назад к features](../README.md).
