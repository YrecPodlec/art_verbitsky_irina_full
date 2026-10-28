# Widgets — крупные блоки сайта

Widget собирает целый раздел из общих элементов, карточек и действий.
Чтобы изменить порядок блоков, открой страницу, которая их подключает.
Чтобы изменить один блок — его папку ниже.

| Папка | Название на странице | Подключение |
| --- | --- | --- |
| [homeHeader](homeHeader/README.md) | Своя фиксированная шапка | Главная и Art |
| [homeIntro](homeIntro/README.md) | Авторский первый экран и портрет | Главная |
| [homeDirections](homeDirections/README.md) | Прокручиваемый список направлений | Главная |
| [homeAbout](homeAbout/README.md) | Знакомство | Главная |
| [homeContact](homeContact/README.md) | Контакты | Главная |
| [siteHeader](siteHeader/README.md) | Интерьерный фиксированный навбар | Только layout Interior |
| [interiorHero](interiorHero/README.md) | Приветственный экран | Interior |
| [featuredProjects](featuredProjects/README.md) | Избранные проекты | Interior |
| [interiorServices](interiorServices/README.md) | Услуги и стоимость | Interior |
| [workProcess](workProcess/README.md) | Этапы работы | Interior |
| [designerAbout](designerAbout/README.md) | Подход к дизайну: образование и принципы | Interior |
| [showroomTeaser](showroomTeaser/README.md) | Превью шоурума | Interior |
| [interiorContact](interiorContact/README.md) | Контакты и форма | Interior |
| [siteFooter](siteFooter/README.md) | Общий подвал сайта | Публичные страницы |
| [portfolioHero](../(pages)/gallery/README.md) | Общий первый экран каталога и кейса | Gallery |
| [projectCase](../(pages)/gallery/README.md) | Подробная история, материалы и боковое меню | Gallery / slug |
| [projectInvitation](../(pages)/gallery/README.md) | Приглашение обсудить интерьер | Каталог и кейс |

## Где искать нужное изменение

`ui/<Имя>.tsx` задаёт содержимое и композицию. Соседний SCSS задаёт оформление
этого блока. Переводы берутся из `messages`; общие карточки — из entities,
пользовательские действия — из features.

`SiteHeader` и клиентская часть `HomeHeader` содержат меню и измерения. Остальные widgets
получают контент на сервере; интерактивные участки подключают отдельно.
Не добавляй `'use client'` всему widget только ради одного переключателя.

`widgets/index.ts` сейчас экспортирует только `SiteHeader`.
У секций интерьера есть собственные `index.ts` для импорта из папки.

Общие заголовки и отступы — в [shared/UI/section](../shared/UI/section/README.md),
кнопки — в [shared/UI/actionLink](../shared/UI/actionLink/README.md).
Композиция страницы — в [interior](<../(pages)/interior/README.md>).
