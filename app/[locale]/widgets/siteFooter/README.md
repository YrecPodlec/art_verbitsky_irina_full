# SiteFooter — общий подвал

Один серверный компонент для главной, Art, Interior, Gallery, Articles и Showroom.
В `(home)` он подключается в layout; в Interior — после секций; у остальных —
в соответствующих layouts. На одной странице должен быть ровно один футер.

Слова и ссылки разделов — `messages.siteFooter`. Направления и их порядок —
`entities/direction/model/directions.mock.json`, их названия — из `home.directions.items`.
Email и бренд — `shared/config/site.ts`. Собственные стили — `ui/SiteFooter.module.scss`.
Старый `widgets/interiorFooter/index.ts` оставлен только как совместимый alias.

Готовых соцсетей, отзывов, формы и профиля здесь не имитируем.
