import {SectionPlaceholder} from '@/app/[locale]/shared/UI/sectionPlaceholder/SectionPlaceholder';
import {Breadcrumbs} from '@/app/[locale]/shared/UI/breadcrumbs';
import {getLocalizedBreadcrumbs} from '@/app/[locale]/shared/lib/navigation/getLocalizedBreadcrumbs';

// Журнал из макета пока обозначен маршрутом-заглушкой для навигации.
export default async function ArticlesPage() {
  const breadcrumbs = await getLocalizedBreadcrumbs('articles');
  return <SectionPlaceholder section="articles" breadcrumbs={<Breadcrumbs {...breadcrumbs} />} />;
}
