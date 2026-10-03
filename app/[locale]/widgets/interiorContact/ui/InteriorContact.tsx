import {getMessages, getTranslations} from 'next-intl/server';
import {getServices} from '@/app/[locale]/entities/service/server';
import {ContactForm, type ContactFormMessages} from '@/app/[locale]/features/projectInquiry';
import {Section, SectionTitle} from '@/app/[locale]/shared/UI/section';
import styles from './InteriorContact.module.scss';

// Текст секции — серверный. В форму передаётся только её словарь и список услуг.
export async function InteriorContact() {
  const [t, messages, {options}] = await Promise.all([getTranslations('interiorContact'), getMessages(), getServices()]);
  return <Section id="contacts" eyebrow={t('eyebrow')} index={t('sectionIndex')} tone="muted">
    <div className={styles.layout}>
      <div>
        <SectionTitle id="contacts-title">{t.rich('title', {br: () => <br />, accent: (text) => <em>{text}</em>})}</SectionTitle>
        <p className={styles.intro}>{t('description')}</p>
        <dl className={styles.details}>
          <div><dt>{t('formatLabel')}</dt><dd>{t('format')}</dd></div>
          <div><dt>{t('locationLabel')}</dt><dd>{t('location')}</dd></div>
        </dl>
        <div className={styles.ornament} aria-hidden="true">✦<span /></div>
      </div>
      <ContactForm copy={messages.contactForm as ContactFormMessages} services={options} />
    </div>
  </Section>;
}
