import {useTranslations} from 'next-intl';
import {ContactForm} from '@/src/features/interior-contact';
import {SectionLabel} from './section-label';
import styles from './interior-home.module.scss';

// Контактная секция соединяет текст страницы с самостоятельной feature формы.
export function ContactSection() {
  const t = useTranslations('interior.contact');
  return (
    <section className={`${styles.section} ${styles.contacts}`} id="contacts"><SectionLabel title={t('label')} number={t('number')} /><div className={styles.contactLayout}><div><h2>{t('headingLine1')}<br /><em>{t('headingAccent')}</em></h2><p>{t('description')}</p><dl><dt>{t('meetingLabel')}</dt><dd>{t('meetingValue')}</dd><dt>{t('locationLabel')}</dt><dd>{t('locationValue')}</dd></dl><div className={styles.contactOrnament} aria-hidden="true">✦ ─────────</div></div><ContactForm /></div></section>
  );
}
