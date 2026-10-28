import {getTranslations} from 'next-intl/server';
import {PortfolioState} from '@/app/[locale]/shared/UI/portfolioState/PortfolioState';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import styles from '../portfolio.module.scss';

// Отдельное состояние для удалённого, неопубликованного или несуществующего проекта.
export default async function ProjectNotFound() {
  const t = await getTranslations('projectCase');
  return <main id="main" className={styles.state}><PortfolioState title={t('notFoundTitle')} description={t('notFoundDescription')}><ActionLink href="/gallery" variant="outline">{t('back')}</ActionLink></PortfolioState></main>;
}
