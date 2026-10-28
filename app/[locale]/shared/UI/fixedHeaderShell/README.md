# FixedHeaderShell

Серверная оболочка с props `header` и `children`, резервирующая место для fixed-шапки.
Высота берётся из `--fixed-header-height`; до гидратации — responsive fallback.
Используется главной и Interior, но не навязывается страницам без шапки.

Шапка вызывает `shared/lib/layout/useFixedHeaderOffset.ts` со своим ref.
ResizeObserver обновляет высоту и `--site-header-offset` для якорей, cleanup
снимает inline-переменные при уходе из layout. Высоту самого header не фиксируем.

Второй аргумент хука — поправка якорей: по умолчанию `1rem`, у Interior — `-5rem`.
Она записывается в `--anchor-scroll-adjustment` отдельно от высоты шапки.
