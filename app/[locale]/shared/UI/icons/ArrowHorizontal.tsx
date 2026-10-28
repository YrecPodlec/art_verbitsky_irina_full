type Props = {direction?: 'left' | 'right'; className?: string};

// Горизонтальная стрелка без диагонального наклона. Подпись задаёт ссылка/кнопка.
export function ArrowHorizontal({direction = 'right', className}: Props) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d={direction === 'left' ? 'M20 12H4m8-8-8 8 8 8' : 'M4 12h16m-8-8 8 8-8 8'}
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
