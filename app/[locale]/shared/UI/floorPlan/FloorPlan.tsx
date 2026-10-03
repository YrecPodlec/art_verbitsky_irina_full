import styles from './FloorPlan.module.scss';

// Схема из макета — вектор, поэтому остаётся чёткой на любом экране.
export function FloorPlan({caption}: {caption: string}) {
  return <figure className={styles.plan}>
    <svg viewBox="0 0 330 235" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor">
        <path strokeWidth="3" d="M25 25h280v200H25V25m170 0v90h110M25 175h85v50" />
        <path d="M130 25v60m-20 90v-40m85-20v35M60 45h70v36H60zm85 113h88v42h-88zm16-24h54v13h-54zM270 140v60h21v-60zm-63-101h74v50h-74zM15 10h300M10 20v210" />
        <path strokeDasharray="3 4" d="M135 106h43v22h-43z" />
        <circle cx="61" cy="126" r="22" /><path d="M38 126h46m-23-23v46" />
      </g>
    </svg>
    <figcaption>{caption}</figcaption>
  </figure>;
}
