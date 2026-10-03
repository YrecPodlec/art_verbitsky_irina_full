import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {InteriorHero} from '@/app/[locale]/widgets/interiorHero';
import {FeaturedProjects} from '@/app/[locale]/widgets/featuredProjects';
import {InteriorServices} from '@/app/[locale]/widgets/interiorServices';
import {WorkProcess} from '@/app/[locale]/widgets/workProcess';
import {DesignerAbout} from '@/app/[locale]/widgets/designerAbout';
import {ShowroomTeaser} from '@/app/[locale]/widgets/showroomTeaser';
import {InteriorContact} from '@/app/[locale]/widgets/interiorContact';
import {InteriorFooter} from '@/app/[locale]/widgets/interiorFooter';
import {InquiryProvider} from '@/app/[locale]/features/projectInquiry';
import {SectionNavigation} from '@/app/[locale]/features/sectionNavigation';
import {Breadcrumbs} from '@/app/[locale]/shared/UI/breadcrumbs';
import {getLocalizedBreadcrumbs} from '@/app/[locale]/shared/lib/navigation/getLocalizedBreadcrumbs';

type InteriorPageProps = {
  params: Promise<{locale: string}>;
};

// Заголовок и описание страницы локализуются на сервере, как и её содержимое.
export async function generateMetadata({params}: InteriorPageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'interiorHero'});
  return {title: t('metaTitle'), description: t('metaDescription')};
}

// Страница собирает виджеты; здесь нет клиентского состояния или обработчиков событий.
export default async function InteriorPage({params}: InteriorPageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const breadcrumbs = await getLocalizedBreadcrumbs('interior');
  const t = await getTranslations('sectionNavigation');
  const sections = ['beginning', 'projects', 'services', 'process', 'approach', 'showroom', 'contacts'].map((id) => ({id, label: t(id)}));

  return (
    <InquiryProvider>
      <main id="main">
        <InteriorHero breadcrumbs={<Breadcrumbs {...breadcrumbs} />} />
        <FeaturedProjects />
        <InteriorServices />
        <WorkProcess />
        <DesignerAbout />
        <ShowroomTeaser />
        <InteriorContact />
      </main>
      <SectionNavigation sections={sections} label={t('label')} backToTop={t('backToTop')} />
      <InteriorFooter />
    </InquiryProvider>
  );
}
