# Breadcrumbs — отображение хлебных крошек

[Breadcrumbs.tsx](Breadcrumbs.tsx) получает готовую цепочку:
`items: {href, label}[]` и `label` — имя навигации для экранного диктора.

Предыдущие элементы становятся локализованными ссылками, последний — текстом
с `aria-current="page"`. Цепочка короче двух пунктов не отображается.

```tsx
const breadcrumbs = await getLocalizedBreadcrumbs('gallery');
return <Breadcrumbs {...breadcrumbs} />;
```

Это пример внутри серверной страницы. Функция подготовки импортируется из
`shared/lib/navigation/getLocalizedBreadcrumbs`.

Внешний вид меняй в [Breadcrumbs.module.scss](Breadcrumbs.module.scss).
Родителей и адреса задавай в [config/navigation.ts](../../config/navigation.ts),
подписи — в `messages.breadcrumbs`. UI не определяет текущую страницу и не читает историю браузера.

Полная цепочка подготовки и добавление страницы описаны в
[lib/navigation](../../lib/navigation/README.md).
[Каталог UI](../README.md).
