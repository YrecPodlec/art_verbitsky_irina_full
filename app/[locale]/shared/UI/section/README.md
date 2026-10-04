# Общий каркас секций

[Section.tsx](Section.tsx) содержит несколько небольших компонентов с едиными стилями
из [Section.module.scss](Section.module.scss).

| Компонент | Для чего |
| --- | --- |
| `Section` | Фон, отступы, верхняя строка и внешний `section` |
| `SectionTopline` | Верхняя строка отдельно, например поверх фотографии шоурума |
| `SectionTitle` | Заголовок `h2` с общим шрифтом и выделением через `em` |
| `SectionHeading` | Заголовок слева, вводный текст справа; на телефоне — вертикально |
| `Eyebrow` | Небольшая вводная подпись |
| `FinePrint` | Примечание мелким текстом |

`Section` принимает `id`, готовые строки `eyebrow` и `index`, `children`,
необязательные `className` и `tone`.
Фоны: `forest`, `deep` (по умолчанию), `surface`, `muted`.

## Пример

```tsx
<Section id="services" eyebrow={t('eyebrow')} index={t('sectionIndex')} tone="muted">
  <SectionTitle id="services-title">{t('heading')}</SectionTitle>
  {/* Содержимое секции */}
</Section>
```

У заголовка обязательно используй ID `<id секции>-title`:
`Section` ссылается на него через `aria-labelledby`.
В примере `heading` — условный ключ; реальные заголовки интерьера используют `t.rich('title', …)`.

Общие отступы меняй в `.section`, шрифт и выделение — в `.title`,
верхнюю строку — в `.topline`. Это затронет все секции с этим каркасом.
Тексты и содержимое принадлежат вызывающему widget; первый экран имеет собственный каркас.
[Каталог UI](../README.md).
