# Project — данные проекта и общая карточка

| Файл | Что здесь находится |
| --- | --- |
| [model/projects.ts](model/projects.ts) | Тип данных для UI; локального массива проектов больше нет |
| [api/getProjectRecords.ts](api/getProjectRecords.ts) | Запрос опубликованных проектов через Prisma, фильтр и лимит |
| [api/findOrderedProjects.ts](api/findOrderedProjects.ts) | Общий запрос с Майами первым и корректными смещениями страниц |
| [model/projectOrder.ts](model/projectOrder.ts) | Ключ закреплённого проекта и чистый расчёт пагинации |
| [api/getProjectCoverImage.ts](api/getProjectCoverImage.ts) | Кэшируемое в пределах рендера чтение обложки и её перевода |
| [ui/ProjectCoverImage.tsx](ui/ProjectCoverImage.tsx) | Одно серверное фоновое изображение для hero и превью шоурума |
| [model/getProjectCover.ts](model/getProjectCover.ts) | Выбор обложки по `coverMediaId`, без запросов и JSX |
| [model/getProjects.ts](model/getProjects.ts) | Серверный перевод и итоговый тип `Project` |
| [model/projectClassification.ts](model/projectClassification.ts) | Фиксированные группы категорий и проверка сочетания с типом |
| [model/projectClassification.test.mjs](model/projectClassification.test.mjs) | Тесты всех сочетаний и ошибочных данных |
| [classification.ts](classification.ts) | Публичный вход проверки, безопасный для сервера и клиентской формы |
| [ui/ProjectCard.tsx](ui/ProjectCard.tsx) | Серверная карточка с фотографией и описанием |
| [ui/ProjectCard.module.scss](ui/ProjectCard.module.scss) | Вид, кадрирование, размеры и адаптив карточки |
| [index.ts](index.ts) | Экспорт для widgets и серверных страниц |

## Какие данные хранить где

В MongoDB: идентификаторы, характеристики, `featured`, массив изображений и их URL.
`featured` отмечает подборку портфолио, не избранное пользователя.
В `messages.projects.<contentKey>`: название, страна, город, `summary` для карточки,
`description` для описания страницы и `story` для истории. Название категории берём
из `projectClassification.categories`, alt — из `media.<image.contentKey>.alt`.
`getProjects` объединяет данные и переводы. Общие подписи карточки — `messages.projectCard`.

Карточка показывает только `summary`. Описание, история и локализованный `media`
используются на странице `/gallery/[slug]`. Карта файлов — в [галерее](../../(pages)/gallery/README.md).
Для новых проектов добавлены базовые описания и временные истории. Подробности
реальных проектов должен заполнить автор в каждой локали.

Модель MongoDB описана в [prisma/README.md](../../../../prisma/README.md).
База уже заполнена. Проверка соединения — `npm run db:check`, повторяемый импорт —
по [инструкции](../../../../prisma/IMPORT.md). `db:init` — старый сценарий для пустой базы.
В БД хранится `contentKey`, который связывает
проект с `messages.projects.<contentKey>` независимо от языка.

## Тип и категория проекта

В БД `residential` допускает `house`/`apartment`,
`commercial` — `hotel`/`cafe`. Prisma хранит фиксированные enum-коды.
Справочник `categoriesByType` нужен и для вариантов формы, и для проверки сервера:
проверка одной формы не защищает от некорректного запроса API.

`isProjectClassification` возвращает boolean и сужает TS-тип данных.
`assertProjectClassification` останавливает выполнение исключением при неверной паре.
Импортировать их можно из `entities/project/classification`, не из серверного index.ts.
Перед обновлением проверяем оба итоговых значения, затем записываем их вместе.
Будущий API должен вызывать проверку непосредственно перед сохранением;
сама функция не записывает данные и не подключает действующие карточки к БД.

Дополнительно `prisma/projectValidator.ts` описывает условное правило самой MongoDB.
Оно устанавливается командой `db:init`, а не генерацией клиента. После установки
неверная пара отклоняется даже при записи через Compass.

Подписи — `messages.projectClassification.types`, `.categories`, `.errors`.
Тесты: `npm run test:project-classification` после `npx prisma generate`, Node 22.18+.

## Props карточки

| Prop | Назначение |
| --- | --- |
| `project` | Готовый локализованный проект |
| `index` | Необязательный номер, форматируется как `01` |
| `href` | Необязательный маршрут существующего кейса |
| `compact` | Плотный планшетный вариант, по умолчанию выключен |
| `imageSizes` | Информация для next/image о размере картинки в раскладке |
| `favoriteAction` | Готовая кнопка избранного или другое содержимое слота |

Без явного `href` карточка открывает существующий маршрут `/gallery/<project.slug>`.
`href` можно передать для другого назначения; пустая строка явно отключает переход.
`favoriteAction` расположен вне ссылок карточки, чтобы кнопка не оказалась внутри ссылки.

Изображение использует `fill` и ленивую загрузку. Высота обложки определяется aspect-ratio.
Кадрирование задаёт `coverPosition` из БД в процентах; без него используется центр.

## Добавить проект

1. Загрузить изображения в публичный Blob, сохранить URL и реальные размеры.
2. Добавить документ в `projects` по схеме Prisma, задать уникальные `slug`, `contentKey`.
3. Добавить `projects.<contentKey>` во все JSON-локали, включая `media.<ключ>.alt/caption`.
4. Задать `coverMediaId` из массива `media`, при необходимости — `coverPosition`.
5. Для подборки включить `featured: true` и `publicationStatus: published`.

`db:init` — безопасный старт для пустой dev-базы с одним Майами, не импорт всех будущих
проектов и не административная панель. Повторный запуск не перезаписывает Майами.
Сервер выбирает максимум три отмеченных опубликованных проекта, сортируя новые первыми.
`connection()` исключает запрос из предварительной сборки Next.js: данные читаются
при открытии страницы. Поэтому новая запись не требует пересборки; новые переводы требуют.

Проверки модели и правила MongoDB без соединения: `npm run test:projects`.
Они не доказывают установку валидатора в удалённой БД.

Для нового размещения карточки настрой сетку в widget и подходящий `imageSizes`,
а не копируй её разметку. Серверный компонент не импортируй напрямую в клиентский TSX.

[Избранные проекты](../../widgets/featuredProjects/README.md).
[Будущее избранное](../../features/favoriteProject/README.md). [Назад к entities](../README.md).
