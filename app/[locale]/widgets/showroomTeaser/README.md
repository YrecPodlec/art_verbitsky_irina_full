# ShowroomTeaser — превью шоурума

Это секция `showroom` на странице интерьера; её кнопка ведёт на отдельную страницу
`/showroom`. В самом превью интерактивного 3D нет.

[ui/ShowroomTeaser.tsx](ui/ShowroomTeaser.tsx) содержит фоновое изображение,
слои затемнения, заголовок, кнопку и декоративную надпись 3D.
Тексты — в `messages.showroomTeaser`.

Фото импортируется из `public/interior/interior-evening.png`.
Кадрирование, затемнение, композиция и watermark меняются в
[ui/ShowroomTeaser.module.scss](ui/ShowroomTeaser.module.scss).
Общая верхняя строка и заголовок — из `shared/UI/section`,
золотая ссылка — из [actionLink](../../shared/UI/actionLink/README.md).

Для другой фотографии обнови импорт и alt.
Для изменения всех золотых кнопок редактируй общий `.gold`;
для расположения только этой — локальный `.action`.

Проверяй читаемость поверх фото, телефонную ширину и локализованный переход.
[Назад к widgets](../README.md).
