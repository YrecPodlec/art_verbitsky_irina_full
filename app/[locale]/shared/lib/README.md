# Lib — общие функции

Здесь находятся функции, которые выполняют общую задачу вне JSX-компонента.

Сейчас доступна [navigation](navigation/README.md):

- `getBreadcrumbs` строит маршруты цепочки без React и переводов.
- `getLocalizedBreadcrumbs` добавляет переведённые подписи на сервере.

[db](db/README.md) — общий серверный Prisma Client для MongoDB.

`layout/useFixedHeaderOffset.ts` — общий хук измерения фиксированной шапки для
`HomeHeader` и `SiteHeader`. Работает вместе с `shared/UI/fixedHeaderShell`.

Браузерное состояние конкретного действия остаётся в `features/<задача>/model`,
а запросы проектов — в `entities/project/api`, подготовка переводов — в `model`.
Это позволяет понять назначение функции по её расположению.

[Назад к shared](../README.md).
