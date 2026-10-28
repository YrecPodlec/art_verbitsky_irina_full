# Общие SVG-иконки

| Файл | Рисунок |
| --- | --- |
| [ArrowUpRight.tsx](ArrowUpRight.tsx) | Стрелка вверх-вправо |
| [ArrowDown.tsx](ArrowDown.tsx) | Стрелка вниз |
| [ArrowHorizontal.tsx](ArrowHorizontal.tsx) | Прямая стрелка; `direction`: `left` или `right` |
| [Heart.tsx](Heart.tsx) | Контур сердца |

Компоненты принимают `className`. Размер и цвет задаёт SCSS вызывающего элемента:
иконки используют `currentColor`, поэтому наследуют его цвет.
Для изменения рисунка редактируй `path` в соответствующем TSX.
Не меняй `viewBox` только ради размера на странице — размер задаётся CSS.

SVG помечены `aria-hidden`: имя действия должно быть у ссылки или кнопки,
например текстом или `aria-label`. Иконка не дублирует его для экранного диктора.

Стрелки общих действий используются в [actionLink](../actionLink/README.md),
сердце — в [favoriteProject](../../../features/favoriteProject/README.md).
[Каталог UI](../README.md).
