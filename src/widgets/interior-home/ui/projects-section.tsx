import {featuredProjects, ProjectCard} from '@/src/entities/interior-project';
import {useTranslations} from 'next-intl';
import {SectionLabel} from './section-label';
import styles from './interior-home.module.scss';

// Секция собирает карточки проектов; сами данные и карточка находятся в entities.
export function ProjectsSection() {
  const t = useTranslations('interior.projects');
  return (
    <section className={`${styles.section} ${styles.projects}`} id="projects">
      <SectionLabel title={t('label')} number={t('number')} />
      <div className={styles.sectionHeading}><h2>{t('headingLine1')}<br /><em>{t('headingAccent')}</em></h2><p>{t('intro')}</p></div>
      <div className={styles.projectGrid}>{featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
      <div className={styles.sectionBottom}><p>{t('bottom')}</p><a href="#services">{t('servicesLink')} <span aria-hidden="true">↓</span></a></div>
    </section>
  );
}
