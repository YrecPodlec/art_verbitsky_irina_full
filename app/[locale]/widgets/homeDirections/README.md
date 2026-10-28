# HomeDirections — прокручиваемая колонка ссылок

Серверный widget перебирает `entities/direction/model/directions.mock.json`
через общий `DirectionCard`. Число/порядок следуют данным, без жёсткого лимита.

Высота/scrollbar/sticky — `ui/HomeDirections.module.scss`. Контейнер фокусируется
с клавиатуры и описан подсказкой из messages. Native scroll не требует хуков.
На телефоне sticky отключается, внутренняя прокрутка сохраняется.

Как добавить объект и перевод — в [карте главной](../../(home)/README.md).
