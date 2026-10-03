import Image from 'next/image';
import type {ReactNode} from 'react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {ArrowUpRight} from '@/app/[locale]/shared/UI/icons/ArrowUpRight';
import type {Project} from '../model/getProjects';
import styles from './ProjectCard.module.scss';

type ProjectCardProps = {
  project: Project;
  index?: number;
  href?: string;
  compact?: boolean;
  imageSizes?: string;
  favoriteAction?: ReactNode;
};

// Общая серверная карточка для портфолио и галереи.
// favoriteAction — место для features: карточка сама ничего не знает об аккаунте и сохранении.
export async function ProjectCard({
  project,
  index,
  href,
  compact = false,
  imageSizes = '(max-width: 32.5rem) 90vw, (max-width: 50rem) 45vw, 30vw',
  favoriteAction,
}: ProjectCardProps) {
  const t = await getTranslations('projectCard');

  const cover = (
    <>
      {/* Кадрирование выбирается SCSS-классом; изображения ниже первого экрана загружаются лениво. */}
      <Image className={`${styles.image} ${styles[project.imagePosition]}`} src={project.image} alt={project.imageAlt} fill sizes={imageSizes} loading="lazy" />
      {index !== undefined && <span className={styles.index} aria-hidden="true">{String(index).padStart(2, '0')}</span>}
      {project.isDemo && <span className={styles.demo} aria-hidden="true">{t('demoImage')}</span>}
    </>
  );

  const content = (
    <>
      <p className={styles.location}>
        <span>{project.country}</span>
        <span className={styles.locationDivider} aria-hidden="true" />
        <span>{project.city}</span>
      </p>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>{project.name}</h3>
        <ArrowUpRight className={styles.arrow} />
      </div>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.footer}>
        <span>{project.spaceType}</span>
        <span className={styles.story}>{href ? t('viewStory') : t('detailsSoon')}</span>
      </div>
    </>
  );

  return (
    <article className={`${styles.card} ${compact ? styles.compact : ''}`} data-project-id={project.id}>
      <div className={styles.imageWrap}>
        {/* Ссылки появятся при передаче href после создания страницы кейса. Пока здесь обычная разметка. */}
        {href ? (
          <Link className={styles.cover} href={href} aria-label={t('openProject', {name: project.name})}>{cover}</Link>
        ) : (
          <div className={styles.cover}>{cover}</div>
        )}
        {favoriteAction && <div className={styles.favorite}>{favoriteAction}</div>}
      </div>
      {href ? <Link className={styles.content} href={href}>{content}</Link> : <div className={styles.content}>{content}</div>}
    </article>
  );
}
