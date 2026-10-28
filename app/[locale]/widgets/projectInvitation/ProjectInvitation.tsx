import {getTranslations} from 'next-intl/server';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import styles from './ProjectInvitation.module.scss';

// Один CTA используется в каталоге и кейсе; ведёт к уже существующей форме контакта.
export async function ProjectInvitation() {
  const t = await getTranslations('portfolioInvitation');
  return <section className={styles.root}>
    <p>{t('eyebrow')}</p>
    <h2>{t.rich('title', {accent: (text) => <em>{text}</em>})}</h2>
    <ActionLink href="/interior#contacts" variant="gold" size="large">{t('action')}</ActionLink>
  </section>;
}
