type ArrowUpRightProps = {
  className?: string;
};

// Декоративная стрелка не дублирует название ссылки для экранного диктора.
// SVG сохраняет один и тот же рисунок при любом размере и цвете компонента.
export function ArrowUpRight({className}: ArrowUpRightProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
