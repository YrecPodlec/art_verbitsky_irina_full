import type {ReactNode} from 'react';
import styles from './Section.module.scss';

type SectionProps = {
  id: string;
  eyebrow: string;
  index: string;
  children: ReactNode;
  className?: string;
  tone?: 'forest' | 'deep' | 'surface' | 'muted';
};

// Общий каркас секций: одинаковые отступы и верхняя строка задаются в одном месте.
export function Section({id, eyebrow, index, children, className, tone = 'deep'}: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={[styles.section, styles[tone], className].filter(Boolean).join(' ')}>
      <SectionTopline eyebrow={eyebrow} index={index} />
      {children}
    </section>
  );
}

// Превью шоурума использует ту же строку поверх фотографии.
export function SectionTopline({eyebrow, index}: Pick<SectionProps, 'eyebrow' | 'index'>) {
  return <div className={styles.topline}><span><span aria-hidden="true">✦</span>{eyebrow}</span><span>{index}</span></div>;
}

// Заголовок получает уже переведённую разметку; логика локализации остаётся в виджете.
export function SectionTitle({id, children, className}: {id?: string; children: ReactNode; className?: string}) {
  return <h2 id={id} className={[styles.title, className].filter(Boolean).join(' ')}>{children}</h2>;
}

export function SectionHeading({title, children}: {title: ReactNode; children: ReactNode}) {
  return <div className={styles.heading}>{title}<div className={styles.intro}>{children}</div></div>;
}

export function Eyebrow({children}: {children: ReactNode}) {
  return <p className={styles.eyebrow}>{children}</p>;
}

export function FinePrint({children, className}: {children: ReactNode; className?: string}) {
  return <p className={[styles.fineprint, className].filter(Boolean).join(' ')}>{children}</p>;
}
