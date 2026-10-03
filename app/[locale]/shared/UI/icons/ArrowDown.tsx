type ArrowDownProps = {
  className?: string;
};

// Стрелка вниз для перехода к следующему разделу; название действия задаёт сама ссылка.
export function ArrowDown({className}: ArrowDownProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 4v16m-7-7 7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
