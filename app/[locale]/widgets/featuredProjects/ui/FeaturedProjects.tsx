import {getTranslations} from 'next-intl/server';
import {getProjects, ProjectCard} from '@/app/[locale]/entities/project';
import {FavoriteProjectButton} from '@/app/[locale]/features/favoriteProject';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import {Section, SectionHeading, SectionTitle} from '@/app/[locale]/shared/UI/section';
import styles from './FeaturedProjects.module.scss';

// Серверный блок собирает данные, карточки и feature избранного.
// Саму карточку можно использовать в галерее без копирования этой секции.
export async function FeaturedProjects() {
  const [t, projects] = await Promise.all([getTranslations('featuredProjects'), getProjects()]);
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <Section id="projects" eyebrow={t('eyebrow')} index={t('sectionIndex')} tone="forest">
      <SectionHeading title={<SectionTitle id="projects-title">{t.rich('title', {br: () => <br />, accent: (chunks) => <em>{chunks}</em>})}</SectionTitle>}>
        <p>{t.rich('description', {br: () => <br />})}</p>
        <ActionLink className={styles.galleryLink} href="/gallery">{t('gallery')}</ActionLink>
      </SectionHeading>

      <div className={styles.grid}>
        {featuredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index + 1}
            compact
            imageSizes="(max-width: 32.5rem) 90vw, 30vw"
            favoriteAction={<FavoriteProjectButton projectId={project.id} projectName={project.name} />}
          />
        ))}
      </div>

      <div className={styles.bottom}>
        <p>{t('closing')}</p>
        <div className={styles.actions}>
          <ActionLink href="/interior#services" direction="down">{t('chooseService')}</ActionLink>
          <ActionLink href="/showroom">{t('showroom')}</ActionLink>
        </div>
      </div>
    </Section>
  );
}
