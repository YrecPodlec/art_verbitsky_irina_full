import type {Metadata} from 'next';
import {notFound, unstable_rethrow} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getProjectBySlug} from '@/app/[locale]/entities/project';
import {ProjectCase} from '@/app/[locale]/widgets/projectCase';
import {PortfolioHero} from '@/app/[locale]/widgets/portfolioHero';
import {ProjectInvitation} from '@/app/[locale]/widgets/projectInvitation';
import {FavoriteProjectButton} from '@/app/[locale]/features/favoriteProject';
import {Breadcrumbs} from '@/app/[locale]/shared/UI/breadcrumbs';
import {getLocalizedBreadcrumbs} from '@/app/[locale]/shared/lib/navigation/getLocalizedBreadcrumbs';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import {PortfolioState} from '@/app/[locale]/shared/UI/portfolioState/PortfolioState';
import {RefreshButton} from '@/app/[locale]/shared/UI/refreshButton/RefreshButton';
import styles from '../portfolio.module.scss';

type Props = {params: Promise<{locale: string; slug: string}>};

async function loadProject(slug: string) {
  return getProjectBySlug(slug).catch((error: unknown) => {
    unstable_rethrow(error);
    console.error('PROJECT_CASE_LOAD_FAILED');
    return undefined;
  });
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale, namespace: 'projectCase'});
  const project = await loadProject(slug);
  if (!project) return {title: t('notFoundTitle'), robots: {index: false}};
  return {title: t('metaTitle', {name: project.name}), description: project.description || project.summary, openGraph: {title: project.name, description: project.summary, images: [{url: project.image, alt: project.imageAlt}]}};
}

// Доступны только опубликованные проекты. Неизвестный slug даёт 404, а не первый проект из БД.
export default async function ProjectPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const [project, t, breadcrumbs] = await Promise.all([loadProject(slug), getTranslations('projectCase'), getLocalizedBreadcrumbs('gallery')]);
  if (project === null) notFound();
  if (project === undefined) return <main id="main" className={styles.state}><PortfolioState title={t('unavailableTitle')} description={t('unavailableDescription')}><RefreshButton label={t('retry')} /></PortfolioState></main>;
  const items = [...breadcrumbs.items, {href: `/gallery/${slug}`, label: project.name}];
  const firstMediaSection = project.media.some((image) => image.category === 'visualization') ? 'visuals' : project.media.some((image) => image.category === 'concept') ? 'concept' : project.media.some((image) => image.category === 'drawing') ? 'documents' : 'result';
  return <main id="main">
    <PortfolioHero title={project.name} eyebrow={`${project.country} / ${project.city}`} description={project.summary} image={project.image} imageAlt={project.imageAlt} position={project.imagePosition} breadcrumbs={<Breadcrumbs label={breadcrumbs.label} items={items} />}>
      <ActionLink href={`#${firstMediaSection}`} variant="outline" direction="down">{t('viewImages', {count: project.media.length})}</ActionLink>
      <FavoriteProjectButton projectId={project.id} projectName={project.name} />
    </PortfolioHero>
    <ProjectCase project={project} contentKey={project.contentKey} locale={locale} />
    <ProjectInvitation />
  </main>;
}
