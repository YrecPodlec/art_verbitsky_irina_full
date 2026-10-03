import {SectionPlaceholder} from '@/app/[locale]/shared/UI/sectionPlaceholder/SectionPlaceholder';
import {Breadcrumbs} from '@/app/[locale]/shared/UI/breadcrumbs';
import {getLocalizedBreadcrumbs} from '@/app/[locale]/shared/lib/navigation/getLocalizedBreadcrumbs';

// 3D-шоурум получит собственную реализацию позже; сейчас ссылка не ведёт на 404.
export default async function ShowroomPage() {
  const breadcrumbs = await getLocalizedBreadcrumbs('showroom');
  return <SectionPlaceholder section="showroom" breadcrumbs={<Breadcrumbs {...breadcrumbs} />} />;
}
