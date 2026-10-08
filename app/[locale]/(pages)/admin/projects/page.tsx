import type {Metadata} from 'next';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {ProjectCreateForm} from '@/app/[locale]/features/createProject';
import styles from './page.module.scss';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'projectAdmin'});
  return {title: t('title'), robots: {index: false, follow: false}};
}

// Серверная страница отдаёт только разметку и словари. Чтения/записи БД здесь нет.
export default async function ProjectAdminPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return <main className={styles.page}>
    <h1>{messages.projectAdmin.title}</h1>
    <p>{messages.projectAdmin.description}</p>
    <ProjectCreateForm copy={messages.projectAdmin} classification={messages.projectClassification} />
  </main>;
}
