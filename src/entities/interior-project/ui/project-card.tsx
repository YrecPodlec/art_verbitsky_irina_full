import Image from 'next/image';
import {useTranslations} from 'next-intl';
import type {InteriorProject} from '../model/projects';
import styles from './project-card.module.scss';

type Props = {project: InteriorProject; index: number};

// Карточка показывает один проект; сейчас она ведёт к контактам, пока страницы кейсов не готовы.
export function ProjectCard({project, index}: Props) {
  const t = useTranslations('interior.projects');
  const name = t(`cards.${project.id}.name`);
  return (
    <article className={styles.card}>
      <a
        className={styles.imageLink}
        href="#contacts"
        aria-label={t('cardLinkLabel', {name})}
      >
        <Image
          src={project.image}
          alt={`${name} — ${t(`cards.${project.id}.theme`)}`}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          style={{objectFit: 'cover', objectPosition: project.position}}
        />
        <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.demo}>{t('demoLabel')}</span>
      </a>
      <div className={styles.content}>
        <span className={styles.location}>{t(`cards.${project.id}.location`)}</span>
        <div className={styles.titleRow}>
          <h3>{name}</h3>
          <span aria-hidden="true">↗</span>
        </div>
        <p>{t(`cards.${project.id}.theme`)}</p>
        <div className={styles.foot}>
          <span>{t(`cards.${project.id}.kind`)}</span>
          <span>{t('demoShort')}</span>
        </div>
      </div>
    </article>
  );
}
