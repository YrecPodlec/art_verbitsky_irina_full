'use client';

import type {CSSProperties} from 'react';
import {useReadingProgress, type ReadingSection} from '../model/useReadingProgress';
import styles from './SectionNavigation.module.scss';

// Ссылки — обычные якоря. JS только подсвечивает текущую секцию и обновляет прогресс.
export function SectionNavigation({sections, label, backToTop}: {sections: ReadingSection[]; label: string; backToTop: string}) {
  const {active, progress, showTop} = useReadingProgress(sections);
  return <>
    <nav className={styles.navigation} aria-label={label}>
      <div className={styles.track} aria-hidden="true"><div className={styles.fill} style={{'--reading-progress': progress} as CSSProperties} /></div>
      {sections.map((section) => <a className={styles.dot} key={section.id} href={`#${section.id}`} aria-label={section.label} aria-current={active === section.id ? 'location' : undefined}><span>{section.label}</span></a>)}
    </nav>
    <a className={styles.top} href={`#${sections[0]?.id ?? 'main'}`} aria-label={backToTop} hidden={!showTop}><span aria-hidden="true">↑</span></a>
  </>;
}
