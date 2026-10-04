# AccordionItem — раскрывающийся пункт

[AccordionItem.tsx](AccordionItem.tsx) отображает `details` с заголовком `summary`.
Браузер сам раскрывает пункт; React-состояния для этого здесь нет.
Можно открыть несколько пунктов одновременно.

Props: `title` — заголовок, `index` — строка номера, `children` — содержимое,
`defaultOpen` — начальное открытое состояние (по умолчанию `false`).

```tsx
<AccordionItem title={title} index="01" defaultOpen>
  <p>{description}</p>
</AccordionItem>
```

В [AccordionItem.module.scss](AccordionItem.module.scss) меняются рамка, отступы,
заголовок и поворот плюса. Анимация раскрытия включается через `@supports`;
при отсутствии поддержки этих CSS-свойств остаётся нативное раскрытие.

Текст и структура этапов относятся к [workProcess](../../../widgets/workProcess/README.md).
После изменений проверь первый открытый пункт, несколько раскрытых пунктов,
Enter/Space на summary, видимый фокус и уменьшение движения.
[Каталог UI](../README.md).
