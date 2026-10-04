# InteriorContact — контактная секция

Серверная секция с якорем `contacts` соединяет вводный текст и клиентскую форму.

[ui/InteriorContact.tsx](ui/InteriorContact.tsx) параллельно получает:

- Перевод `interiorContact` для левой части.
- Раздел `messages.contactForm` для полей и подтверждения.
- Options услуг из `getServices`.

В форму передаются только `copy` и `services`, а не весь словарь сайта.

| Хочу изменить | Где |
| --- | --- |
| Приглашение и сведения слева | `messages.interiorContact` |
| Подписи полей и подтверждения | `messages.contactForm` |
| Список услуг | Модель и переводы `entities/service` |
| Сетку двух колонок и орнамент | [ui/InteriorContact.module.scss](ui/InteriorContact.module.scss) |
| Поля и поведение формы | [projectInquiry](../../features/projectInquiry/README.md) |

`ContactForm` требует `InquiryProvider`. Он подключён выше, в странице интерьера.
Для использования этого widget на другой странице также обеспечь провайдер.
Форма сейчас показывает демо-подтверждение без отправки.

Подписи формата общения и географии представлены через `dl/dt/dd`:
название сведения и его значение. Секция пока не задаёт реальных адресов связи.
[Назад к widgets](../README.md).
