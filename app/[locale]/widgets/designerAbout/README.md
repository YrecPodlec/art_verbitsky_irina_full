# DesignerAbout — Ирина и её подход

Серверный раздел с якорем `approach`.
[ui/DesignerAbout.tsx](ui/DesignerAbout.tsx) собирает портрет, подписи, описание
и список принципов. Тексты — в `messages.designerAbout`.

| Файл | Ответственность |
| --- | --- |
| `ui/DesignerAbout.tsx` | Композиция, импорт портрета и порядок принципов |
| [ui/Principle.tsx](ui/Principle.tsx) | Один пункт принципов с props index/title/description |
| [ui/DesignerAbout.module.scss](ui/DesignerAbout.module.scss) | Фото, рамка, подпись, звезда и оформление текста |

Портрет импортируется из `public/interior/irina.jpg` и загружается лениво.
Для замены изображения обнови файл или его импорт; alt меняется в переводах.
Кадрирование задаётся `object-position` в SCSS, насыщенность — `filter`.

Массив `principles` задаёт порядок ID; данные берутся из
`designerAbout.principles.<id>`. Новый принцип требует ID в массиве и обеих локалей.

`Principle` нужен только этому разделу, поэтому остаётся в widget.
Ссылка внизу ведёт на отдельный маршрут `/articles`, пока с заглушкой.
Проверяй кадрирование, длинное имя в подписи и вертикальную композицию на телефоне.
[Назад к widgets](../README.md).
