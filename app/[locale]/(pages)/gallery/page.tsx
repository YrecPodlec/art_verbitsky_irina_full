import {SectionPlaceholder} from '@/app/[locale]/shared/UI/sectionPlaceholder/SectionPlaceholder';
import {Breadcrumbs} from '@/app/[locale]/shared/UI/breadcrumbs';
import {getLocalizedBreadcrumbs} from '@/app/[locale]/shared/lib/navigation/getLocalizedBreadcrumbs';

// Галерею из макета перенесём следующим этапом; маршрут уже доступен из общей шапки.
export default async function GalleryPage() {
  const breadcrumbs = await getLocalizedBreadcrumbs('gallery');
  return <SectionPlaceholder section="gallery" breadcrumbs={<Breadcrumbs {...breadcrumbs} />} />;
}
