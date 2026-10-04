# WorkProcess — этапы работы

Серверный раздел с якорем `process`.
[ui/WorkProcess.tsx](ui/WorkProcess.tsx) собирает вводную часть, планировку и пять этапов.

Массив `steps` задаёт порядок: `sketch`, `visual`, `documents`,
`supervision`, `procurement`. Текст — в `messages.workProcess.steps.<id>`:
`name`, `do`, `get`, `example`.

Чтобы добавить этап, обнови массив и объект перевода в каждой локали.
Первый пункт получает `defaultOpen`; номера выводятся из порядка массива.

Раздел использует [AccordionItem](../../shared/UI/accordion/README.md).
Его общий вид и механизм раскрытия меняются в shared, а оформление текста,
схемы примера и композиции раздела — в
[ui/WorkProcess.module.scss](ui/WorkProcess.module.scss).

Рисунок планировки находится в `shared/UI/floorPlan/FloorPlan.tsx`;
подпись — `workProcess.planCaption`. Это декоративная демонстрационная схема,
не редактор и не план конкретного проекта.

Все тексты готовятся на сервере; браузер управляет раскрытием `details`.
Проверяй порядок этапов, первый открытый пункт, клавиатуру, длинные тексты
и изменение высоты страницы при раскрытии.
[Назад к widgets](../README.md).
