import {getTranslations} from 'next-intl/server';
import styles from './portfolio.module.scss';

// Next показывает этот серверный fallback, пока читает MongoDB и собирает новую выдачу.
export default async function GalleryLoading() {
  const t = await getTranslations('gallery');
  return <main className={styles.loading} aria-busy="true"><p role="status">{t('loading')}</p></main>;
}
