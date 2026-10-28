'use client';

import {useEffect, type RefObject} from 'react';

// Общая механика фиксированной шапки. Измеряем её, а не задаём фиксированную высоту.
// Offset нужен якорям, fixed-header-height — оболочке для места над контентом.
export function useFixedHeaderOffset(ref: RefObject<HTMLElement | null>, scrollAdjustment = '1rem') {
  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const root = document.documentElement;
    // У разных направлений своя поправка якорей, независимая от измеренной высоты.
    root.style.setProperty('--anchor-scroll-adjustment', scrollAdjustment);
    const update = () => {
      const height = `${header.offsetHeight}px`;
      root.style.setProperty('--site-header-offset', height);
      root.style.setProperty('--fixed-header-height', height);
    };
    const observer = new ResizeObserver(update);
    observer.observe(header);
    update();
    return () => {
      observer.disconnect();
      root.style.removeProperty('--site-header-offset');
      root.style.removeProperty('--fixed-header-height');
      root.style.removeProperty('--anchor-scroll-adjustment');
    };
  }, [ref, scrollAdjustment]);
}
