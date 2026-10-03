'use client';

import {useEffect, useState} from 'react';

export type ReadingSection = {id: string; label: string};

// Измерения сгруппированы в один animation frame; обработчики удаляются при уходе со страницы.
export function useReadingProgress(sections: ReadingSection[]) {
  const [state, setState] = useState({active: sections[0]?.id, progress: 0, showTop: false});
  useEffect(() => {
    let frame = 0;
    const elements = sections.map(({id}) => document.getElementById(id));
    function measure() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      let active = sections[0]?.id;
      elements.forEach((element, index) => {
        if (element && element.getBoundingClientRect().top < window.innerHeight * .4) active = sections[index].id;
      });
      const next = {active, progress: Math.round(progress * 1000) / 1000, showTop: window.scrollY > 500};
      setState((previous) => previous.active === next.active && previous.progress === next.progress && previous.showTop === next.showTop ? previous : next);
    }
    function schedule() { if (!frame) frame = window.requestAnimationFrame(measure); }
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    // Высота меняется и без resize окна: например, после раскрытия этапа или загрузки шрифта.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [sections]);
  return state;
}
