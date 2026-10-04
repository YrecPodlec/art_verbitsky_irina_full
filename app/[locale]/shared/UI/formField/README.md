# FormField — подпись и оформление поля

[FormField.tsx](FormField.tsx) оборачивает один элемент ввода в `label`.
Название поля передаётся через `label`, сам `input`, `select` или `textarea` — через `children`.

```tsx
<FormField label={copy.email.label}>
  <input name="email" type="email" required placeholder={copy.email.placeholder} />
</FormField>
```

Вложенное поле связано с подписью без отдельного `htmlFor`.
Компонент не задаёт `name`, значение, обработчик или правила проверки — это делает форма.

Общие стили полей, placeholder, фокус и варианты select находятся в
[FormField.module.scss](FormField.module.scss). Изменение здесь влияет на все использования.
Сетка и расстояние между полями — в SCSS самой формы.
Не помещай несколько полей ввода в один `FormField`.

Поведение текущей формы: [projectInquiry](../../../features/projectInquiry/README.md).
[Каталог UI](../README.md).
