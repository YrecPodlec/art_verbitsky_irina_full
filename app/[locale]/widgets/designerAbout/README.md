# DesignerAbout — подход к дизайну

Серверный раздел с якорем `approach`.
[ui/DesignerAbout.tsx](ui/DesignerAbout.tsx) собирает портрет, описание
и список принципов. Тексты — в `messages.designerAbout`.

| Файл | Ответственность |
| --- | --- |
| `ui/DesignerAbout.tsx` | Композиция, импорт портрета и порядок принципов |
| [ui/Principle.tsx](ui/Principle.tsx) | Один пункт принципов с props index/title/description |
| [ui/DesignerAbout.module.scss](ui/DesignerAbout.module.scss) | Адаптивная раскладка, размер фото и оформление текста |

Портрет импортируется из `public/interior/irina.jpg` и загружается лениво.
Для замены изображения обнови файл или его импорт; alt меняется в переводах.
Фото отображается в естественных пропорциях (`width: 100%; height: auto`),
без обрезки, фильтров, рамки, звезды и текста поверх изображения.

Массив `principles` задаёт порядок ID; данные берутся из
`designerAbout.principles.<id>`. Новый принцип требует ID в массиве и обеих локалей.

Текущий порядок: `education` (магистр), `salutogenic`, `biophilic`.
Заголовки секции — `designerAbout.eyebrow` и `sectionIndex`, основной текст —
`title`, `description`, `philosophy`. Название боковой точки — `sectionNavigation.approach`.
Степень магистра указана по данным владельца сайта, без неподтверждённых вуза,
специальности, года и регалий. Описания подходов не обещают медицинского эффекта.
Терминологическая опора: [Salutogenic Architecture](https://www.ncbi.nlm.nih.gov/books/NBK584090/)
и [The Practice of Biophilic Design](https://biophilicdesign.umn.edu/sites/biophilic-net-positive.umn.edu/files/2021-09/2015_Kellert%20_The_Practice_of_Biophilic_Design.pdf).

`Principle` нужен только этому разделу, поэтому остаётся в widget.
Ссылка внизу ведёт на отдельный маршрут `/articles`, пока с заглушкой.
Проверяй пропорции фото и вертикальную композицию на телефоне.
[Назад к widgets](../README.md).
