# Service — тарифы и общая карточка услуги

| Файл | Ответственность |
| --- | --- |
| [model/services.ts](model/services.ts) | ID услуг, группы пакетов, типы и проверка `isServiceId` |
| [model/getServices.ts](model/getServices.ts) | Локализованные пакеты и список options для формы |
| [ui/ServiceCard.tsx](ui/ServiceCard.tsx) | Представление одной карточки |
| [ui/ServiceCard.module.scss](ui/ServiceCard.module.scss) | Оформление карточки и её адаптив |
| [index.ts](index.ts) | Компонент, типы и проверка ID |
| [server.ts](server.ts) | Серверный вход для `getServices` |

## Как собираются данные

`packageDefinitions` задаёт порядок пакетов и ID их вариантов.
`serviceIds` задаёт допустимые значения select формы, включая консультации.

`getServices` берёт:

- Названия из `services.options.<id>`.
- Подпись, вводный текст и короткую подпись второго варианта из `services.packages.<packageId>`.
- Состав и отличие варианта из `services.variants.<variantId>`.

`items` — массив строк в JSON, получаемый через `t.raw`.
Для первого переключателя используется название услуги, для дополнительных —
`extraLabel`. Общие цена, единица и примечание передаются через `labels`;
числовые цены пока не заданы.

## Что умеет ServiceCard

Props: `service`, выбранный `variant`, `labels`, номер `index`,
готовые `controls` и `action`.
Карточка сама не выбирает вариант и не хранит состояние. Это делает
[ServicePackageChoice](../../features/projectInquiry/README.md).

Внешний вид всех карточек меняй здесь; вид кнопок переключателя — в feature,
сетку карточек — в widget `interiorServices`.

## Добавить вариант или пакет

Добавь ID в `serviceIds`, укажи его в нужной записи `packageDefinitions`
и создай перевод в `options` и `variants` для каждой локали.
Для нового пакета также нужны его `tag`, `intro`, `extraLabel`
и ID, по которому получается название.

При изменении числа вариантов проверь UX переключателя и данные:
текущая модель использует группы с двумя вариантами.
Не заменяй ID переведёнными названиями.

В серверном widget импортируй `getServices` из `entities/service/server`.
В клиентской feature импортируй `ServiceCard` и типы из `entities/service`.
Это отделяет `next-intl/server` от клиентского импорта.
[Назад к entities](../README.md).
