import type {Metadata} from 'next';
import {unstable_rethrow} from 'next/navigation';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {getProjectCatalog, ProjectCard, ProjectCoverImage} from '@/app/[locale]/entities/project';
import {catalogHref, CATALOG_PAGE_SIZE, parseCatalogFilters, type CatalogSearchParams} from '@/app/[locale]/entities/project/model/catalogQuery';
import {GalleryFilters} from '@/app/[locale]/features/filterProjects';
import {FavoriteProjectButton} from '@/app/[locale]/features/favoriteProject';
import {PortfolioHero} from '@/app/[locale]/widgets/portfolioHero';
import {ProjectInvitation} from '@/app/[locale]/widgets/projectInvitation';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import {PortfolioState} from '@/app/[locale]/shared/UI/portfolioState/PortfolioState';
import {RefreshButton} from '@/app/[locale]/shared/UI/refreshButton/RefreshButton';
import {Breadcrumbs} from '@/app/[locale]/shared/UI/breadcrumbs';
import {Pagination} from '@/app/[locale]/shared/UI/pagination';
import {getLocalizedBreadcrumbs} from '@/app/[locale]/shared/lib/navigation/getLocalizedBreadcrumbs';
import styles from './portfolio.module.scss';

type Props = {params: Promise<{locale: string}>; searchParams: Promise<CatalogSearchParams>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'gallery'});
  return {title: t('metaTitle'), description: t('metaDescription')};
}

// Страница остаётся серверной: и карточки, и переводы доступны до выполнения JS в браузере.
export default async function GalleryPage({params, searchParams}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const filters = parseCatalogFilters(await searchParams);
  const [t, messages] = await Promise.all([getTranslations('gallery'), getMessages()]);
  const breadcrumbs = await getLocalizedBreadcrumbs('gallery');
  const catalog = await getProjectCatalog(filters).catch((error: unknown) => {
    unstable_rethrow(error);
    console.error('PROJECT_CATALOG_LOAD_FAILED');
    return null;
  });
  const active = {...filters, page: catalog?.page ?? filters.page};
  return <main id="main">
    <PortfolioHero title={t.rich('title', {br: () => <br />, accent: (text) => <em>{text}</em>})} eyebrow={t('eyebrow')} description={t('description')} background={<ProjectCoverImage contentKey="miami" preload />} breadcrumbs={<Breadcrumbs {...breadcrumbs} />}>
      <ActionLink href="#catalog" direction="down">{t('explore')}</ActionLink>
    </PortfolioHero>
    <section id="catalog" className={styles.catalog} aria-label={t('catalogLabel')}>
      {catalog ? <>
        <GalleryFilters key={catalogHref(active)} filters={active} countries={catalog.countries} copy={messages.gallery} classification={messages.projectClassification} />
        <div className={styles.caption}>
          <p role="status">{t('results', {from: catalog.total ? (catalog.page - 1) * CATALOG_PAGE_SIZE + 1 : 0, to: Math.min(catalog.page * CATALOG_PAGE_SIZE, catalog.total), total: catalog.total})}</p>
          <strong>{t('catalogNote')}</strong>
        </div>
        {catalog.projects.length ? <div className={styles.grid}>
          {catalog.projects.map((project, index) => <ProjectCard key={project.id} project={project} index={(catalog.page - 1) * CATALOG_PAGE_SIZE + index + 1} imageSizes="(max-width: 40rem) 90vw, (max-width: 64rem) 45vw, 30vw" favoriteAction={<FavoriteProjectButton projectId={project.id} projectName={project.name} />} />)}
        </div> : <PortfolioState title={t('emptyTitle')} description={t('emptyDescription')}><ActionLink href="/gallery" variant="outline">{t('reset')}</ActionLink></PortfolioState>}
        {catalog.projects.length > 0 && <div className={styles.pagination}>
          <Pagination currentPage={catalog.page} totalPages={catalog.pages}
            hrefForPage={(page) => catalogHref({...active, page})}
            labels={{navigation: t('pagination'), previous: t('previous'), next: t('next'), page: (page) => t('page', {current: page, total: catalog.pages})}} />
        </div>}
      </> : <PortfolioState title={t('unavailableTitle')} description={t('unavailableDescription')}><RefreshButton label={t('retry')} /></PortfolioState>}
    </section>
    <ProjectInvitation />
  </main>;
}
