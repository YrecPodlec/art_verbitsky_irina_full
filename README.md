# Сайт Ирины Вербицкой — карта проекта

Начинай с этого файла, когда нужно понять, где находится код и что редактировать.
Сайт использует Next.js, React, TypeScript, next-intl и SCSS-модули.
Страница дизайна интерьера доступна по `/ru/interior` и `/en/interior`.

## Быстрый запуск

В терминале из корня проекта:

```bash
npm ci
npm run dev
```

Открыть: [главная на русском](http://localhost:3000/ru)
или [главная на английском](http://localhost:3000/en).
Адрес рассчитан на стандартный порт 3000; если он занят, используй адрес из терминала.

## Общая карта папок

```text
art_verbitsky_irina/
├── app/
│   └── [locale]/                 Всё приложение для выбранного языка
│       ├── layout.tsx            Язык и общая техническая оболочка, без шапки
│       ├── (home)/               Главная /ru или /en, своя шапка и /art
│       ├── globals.css           Общие цвета, шрифты, анимации и базовые стили
│       ├── (pages)/              Папка маршрутов; в адрес сайта не попадает
│       │   ├── interior/         Страница дизайна интерьера
│       │   ├── gallery/          Страница галереи
│       │   ├── articles/         Страница статей
│       │   └── showroom/         Страница 3D-шоурума
│       ├── widgets/              Готовые крупные блоки страниц
│       ├── features/             Действия пользователя и их логика
│       ├── entities/             Проекты, услуги, их данные и карточки
│       ├── shared/               Общие элементы, настройки и функции
│       ├── fonts/                Шрифты, подключённые в globals.css
│       └── styles/               Стили исходной главной страницы
├── messages/                     Все переводы: ru.json и en.json
├── i18n/                         Загрузка переводов и маршруты с языком
├── public/                       Изображения и другие публичные файлы
├── maket/                        Исходный HTML/CSS/JS-макет
├── docs/                         Общие правила архитектуры
├── proxy.ts                      Обработка языкового префикса в URL
└── package.json                  Зависимости и команды проекта
```

`[locale]` — переменная часть маршрута: вместо неё в URL будет `ru` или `en`.
`(pages)` — только группа папок Next.js: например,
`app/[locale]/(pages)/interior/page.tsx` открывается как `/ru/interior`.

`maket/` — визуальный образец. Чтобы изменить работающий сайт, редактируй компоненты
в `app/[locale]/`, переводы в `messages/` и нужные изображения, а не файлы макета.

## Как устроены слои FSD

FSD здесь помогает разделить сборку страницы, действия пользователя и общие элементы.

| Слой | Простыми словами | Пример в проекте |
| --- | --- | --- |
| Страница — `(pages)/interior/page.tsx` | Расставляет готовые блоки в нужном порядке | Первый экран → проекты → услуги → этапы |
| `widgets` — блоки | Собирает целый раздел из компонентов | `featuredProjects` — раздел с подборкой проектов |
| `features` — действия | Отвечает за взаимодействие и состояние | `projectInquiry` — выбор услуги и форма |
| `entities` — сущности | Описывает предмет сайта и его отображение | `project` — данные проекта и карточка |
| `shared` — общее | Содержит элементы без привязки к конкретной услуге или проекту | Кнопка со стрелкой, поле формы, хлебные крошки |

Сборка идёт сверху вниз: страница использует widgets и features; widget может использовать
features, entities и shared; feature — entities и shared; entity — shared.
Например, сердечко передаётся в карточку проекта через `favoriteAction`:
карточка получает готовое действие, а логику избранного хранит отдельная feature.

Внутри папок компонентов:

- `ui/` — JSX-разметка и соседние `*.module.scss`.
- `model/` — данные, типы, состояние и логика.
- `api/` — серверные запросы к источнику данных.
- `index.ts` — вход для импорта из папки; обычно экспортирует её основные компоненты.
- `server.ts` — отдельный серверный вход, если его нужно отделить от клиентских импортов.
- `README.md` — подробности конкретной части, если ей нужно отдельное объяснение.

Например, у `entities/project` карточка лежит в `ui/ProjectCard.tsx`,
формат для UI — в `model/projects.ts`, запрос MongoDB — в `api/getProjectRecords.ts`,
подготовка переводов — в `model/getProjects.ts`. Подключение и начальное заполнение:
[Prisma](prisma/README.md).

## Где находятся страницы

| Адрес на примере русского языка | Файл | Текущее содержимое |
| --- | --- | --- |
| `/ru` | [Главная](<app/[locale]/(home)/page.tsx>) | Тёмная авторская главная и прокручиваемые карточки направлений |
| `/ru/art` | [Искусство](<app/[locale]/(home)/art/page.tsx>) | Страница-заготовка отдельного направления |
| `/ru/interior` | [Дизайн интерьера](<app/[locale]/(pages)/interior/page.tsx>) | Все блоки страницы из макета |
| `/ru/gallery` | [Галерея](<app/[locale]/(pages)/gallery/page.tsx>) | Заглушка с хлебными крошками |
| `/ru/articles` | [Статьи](<app/[locale]/(pages)/articles/page.tsx>) | Заглушка с хлебными крошками |
| `/ru/showroom` | [Шоурум](<app/[locale]/(pages)/showroom/page.tsx>) | Заглушка с хлебными крошками |

Английские страницы используют те же файлы с префиксом `/en`.
У главной собственная фиксированная шапка в [(home)/layout.tsx](<app/[locale]/(home)/layout.tsx>).
Интерьерная шапка подключена только в `(pages)/interior/layout.tsx`.
`widgets/siteFooter` — общий футер публичных страниц. [Карта главной](<app/[locale]/(home)/README.md>).

## Как называются блоки страницы интерьера

Пути в таблице начинаются с `app/[locale]/widgets/`.
У каждого блока рядом с TSX есть SCSS-модуль с его оформлением.

| Название папки | Что видно на сайте | Основной компонент |
| --- | --- | --- |
| `siteHeader` — шапка | Фиксированный навбар | [SiteHeader.tsx](<app/[locale]/widgets/siteHeader/ui/SiteHeader.tsx>) |
| `interiorHero` — первый экран | Большое приветствие, фон и три перехода | [InteriorHero.tsx](<app/[locale]/widgets/interiorHero/ui/InteriorHero.tsx>) |
| `featuredProjects` — выбранные проекты | Второй блок с максимум тремя карточками из БД | [FeaturedProjects.tsx](<app/[locale]/widgets/featuredProjects/ui/FeaturedProjects.tsx>) |
| `interiorServices` — услуги | Тарифы, особый подход и консультации | [InteriorServices.tsx](<app/[locale]/widgets/interiorServices/ui/InteriorServices.tsx>) |
| `workProcess` — процесс работы | Этапы с раскрывающимися пунктами | [WorkProcess.tsx](<app/[locale]/widgets/workProcess/ui/WorkProcess.tsx>) |
| `designerAbout` — о дизайнере | Портрет Ирины и принципы её подхода | [DesignerAbout.tsx](<app/[locale]/widgets/designerAbout/ui/DesignerAbout.tsx>) |
| `showroomTeaser` — превью шоурума | Блок с фотографией и переходом в шоурум | [ShowroomTeaser.tsx](<app/[locale]/widgets/showroomTeaser/ui/ShowroomTeaser.tsx>) |
| `interiorContact` — контакты | Приглашение обсудить проект и форма | [InteriorContact.tsx](<app/[locale]/widgets/interiorContact/ui/InteriorContact.tsx>) |
| `interiorFooter` — подвал | Нижняя навигация и имя дизайнера | [InteriorFooter.tsx](<app/[locale]/widgets/interiorFooter/ui/InteriorFooter.tsx>) |

У формы и карточек есть собственные компоненты ниже по слоям:
widget лишь собирает их в раздел.

## Хочу изменить…

| Задача | Где редактировать |
| --- | --- |
| Переставить или добавить блок страницы интерьера | [(pages)/interior/page.tsx](<app/[locale]/(pages)/interior/page.tsx>) |
| Изменить подпись, описание, заголовок или текст кнопки | [messages/ru.json](messages/ru.json) и [messages/en.json](messages/en.json) |
| Изменить ссылки в навбаре | [SiteHeader.tsx](<app/[locale]/widgets/siteHeader/ui/SiteHeader.tsx>) |
| Изменить переходы первого экрана | [interiorHero/model/actions.ts](<app/[locale]/widgets/interiorHero/model/actions.ts>) |
| Заменить фотографию первого экрана | Импорт изображения в [InteriorHero.tsx](<app/[locale]/widgets/interiorHero/ui/InteriorHero.tsx>); изображения в `public/interior/` |
| Заменить портрет | Импорт изображения в [DesignerAbout.tsx](<app/[locale]/widgets/designerAbout/ui/DesignerAbout.tsx>) |
| Добавить проект или заменить его изображение | Документ в MongoDB и раздел `projects` в переводах; [инструкция](prisma/README.md) |
| Изменить вид карточки проекта | [ProjectCard.tsx](<app/[locale]/entities/project/ui/ProjectCard.tsx>) и [ProjectCard.module.scss](<app/[locale]/entities/project/ui/ProjectCard.module.scss>) |
| Доработать сердечко избранного | [FavoriteProjectButton.tsx](<app/[locale]/features/favoriteProject/ui/FavoriteProjectButton.tsx>) |
| Изменить состав тарифов и их тексты | Раздел `services` в переводах; для изменения набора пакетов — [service/model/services.ts](<app/[locale]/entities/service/model/services.ts>) |
| Изменить вид карточки услуги | [ServiceCard.tsx](<app/[locale]/entities/service/ui/ServiceCard.tsx>) и соседний SCSS-модуль |
| Изменить переключение вариантов тарифа | [ServicePackageChoice.tsx](<app/[locale]/features/projectInquiry/ui/ServicePackageChoice.tsx>) |
| Понять, как услуга попадает в форму | [InquiryProvider.tsx](<app/[locale]/features/projectInquiry/model/InquiryProvider.tsx>) и [ServiceChoiceLink.tsx](<app/[locale]/features/projectInquiry/ui/ServiceChoiceLink.tsx>) |
| Изменить поля формы | [ContactForm.tsx](<app/[locale]/features/projectInquiry/ui/ContactForm.tsx>) |
| Изменить поведение формы и подключить отправку | [useContactForm.ts](<app/[locale]/features/projectInquiry/model/useContactForm.ts>); настоящей отправке также нужен серверный обработчик |
| Изменить одинаковые кнопки и ссылки со стрелкой | [shared/UI/actionLink](<app/[locale]/shared/UI/actionLink/index.ts>) — общие разметка и SCSS |
| Изменить общие отступы и заголовки секций | [Section.module.scss](<app/[locale]/shared/UI/section/Section.module.scss>) |
| Изменить хлебные крошки | [navigation.ts](<app/[locale]/shared/config/navigation.ts>) — иерархия; [Breadcrumbs.tsx](<app/[locale]/shared/UI/breadcrumbs/Breadcrumbs.tsx>) — отображение |
| Изменить боковую навигацию по секциям | Список `sections` в странице `interior`, [SectionNavigation.tsx](<app/[locale]/features/sectionNavigation/ui/SectionNavigation.tsx>) |
| Изменить определение текущей секции при прокрутке | [useReadingProgress.ts](<app/[locale]/features/sectionNavigation/model/useReadingProgress.ts>) |
| Изменить общие цвета, шрифты или скорости анимаций | [globals.css](<app/[locale]/globals.css>) |
| Изменить оформление отдельного блока | Его `*.module.scss` рядом с компонентом |
| Добавить язык | [i18n/routing.ts](i18n/routing.ts) и новый `messages/<код>.json` |

## Переводы и изображения

Все отображаемые тексты находятся в `messages/`. Названия разделов словаря совпадают
с частями сайта: например, `interiorHero`, `featuredProjects`, `services`, `contactForm`.
Идентификаторы проектов и услуг в TypeScript остаются одинаковыми для всех языков.

Теги `<br></br>` и `<accent>…</accent>` в переводах задают переносы и выделение текста.
При переводе сохраняй используемые имена тегов и параметры вроде `{name}`.

Для нового языка скопируй `en.json`, переведи значения, сохранив ключи,
и добавь код в `routing.locales`. Переключатель берёт список языков оттуда.
Флаг добавляется отдельно в [LanguageSwitcher.tsx](<app/[locale]/features/languageSwitcher/ui/LanguageSwitcher.tsx>);
без флага отображается значок глобуса. Для английского уже используется флаг США.

`i18n/request.ts` загружает словарь, а `i18n/navigation.ts` даёт ссылки с учётом языка.
В компонентах внутренние переходы обычно пишутся как `/gallery` или `/showroom`.

Изображения интерьера лежат в `public/interior/`, изображения исходной главной — в `public/logo/`.
Файл `public/interior/irina.jpg` доступен по адресу `/interior/irina.jpg`:
слово `public` не включается в URL. В компонентах также используются статические импорты для `next/image`.

Рабочие шрифты подключаются из `app/[locale]/fonts/interior/` через `globals.css`.
Копии в `public/interior/fonts/` сейчас не являются источником этих `@font-face`.

## Как проверять изменения

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

Для запуска собранного приложения: `npm run start` после успешной сборки.

Линтер проверяет правила кода, TypeScript — типы, сборка — готовность приложения к production.
Вёрстку и взаимодействия проверяй также в браузере на обеих локалях и на разных размерах экрана.
Подробные сценарии для формы, тарифов и адаптива перечислены в
[документации страницы интерьера](<app/[locale]/(pages)/interior/README.md#как-проверять>).

В `package.json` пока есть `check:messages`, но файл `scripts/check-messages.mjs` удалён:
эта команда сейчас не работает. Отдельного настроенного набора автоматических тестов пока нет.

## Что ещё требует доработки

- Галерея, статьи и шоурум имеют маршруты и заглушки; их полноценные страницы ещё предстоит перенести.
- Профиль и сердечки избранного пока отключены.
- Форма показывает демонстрационное подтверждение; отправка и сохранение заявок не подключены.
- Проекты, изображения и тарифы взяты из макета; реальные материалы и стоимость нужно подтвердить.
- Главная использует `messages.home`. Карточки направлений редактируются в
  `app/[locale]/entities/direction/model/directions.mock.json`; это не MongoDB.
- Контакты и правовые сведения для страницы интерьера ещё требуют согласования.

## Куда читать дальше

- [Навигатор по всей документации](docs/README.md) — выбирай тему или открывай README нужной папки.
- [Общая кнопка: какие файлы и классы менять](<app/[locale]/shared/UI/actionLink/README.md>).
- [Выбор тарифа и форма: как связаны компоненты](<app/[locale]/features/projectInquiry/README.md>).
- [Каталог общих UI-компонентов](<app/[locale]/shared/UI/README.md>).
- [Архитектура и правила изменения кода](docs/architecture.md).
- [Страница интерьера: состав и взаимодействия](<app/[locale]/(pages)/interior/README.md>).
- [Первый экран и общие кнопки](<app/[locale]/widgets/interiorHero/README.md>).
- [Избранные проекты и общая карточка](<app/[locale]/widgets/featuredProjects/README.md>).

Для первого знакомства открой `(pages)/interior/page.tsx`, выбери интересующий блок,
затем перейди в его widget. Если внутри импортируется карточка или действие, переходи
по импорту в entity или feature. Текст ищи по ключу в `messages`, оформление — в соседнем SCSS.
