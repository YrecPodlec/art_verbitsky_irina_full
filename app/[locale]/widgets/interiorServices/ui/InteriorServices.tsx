import {getTranslations} from 'next-intl/server';
import {getServices} from '@/app/[locale]/entities/service/server';
import {ServicePackageChoice, ServiceChoiceLink} from '@/app/[locale]/features/projectInquiry';
import {Section, SectionHeading, SectionTitle, Eyebrow, FinePrint} from '@/app/[locale]/shared/UI/section';
import styles from './InteriorServices.module.scss';

// Сервер готовит контент. Клиентскими остаются только выбор пакета и перенос услуги в форму.
export async function InteriorServices() {
  const [t, {packages}] = await Promise.all([getTranslations('services'), getServices()]);
  const labels = {price: t('price'), unit: t('unit'), remote: t('remote'), choose: t('choose'), variantGroup: t('variantGroup')};
  return <Section id="services" eyebrow={t('eyebrow')} index={t('sectionIndex')} tone="muted">
    <SectionHeading title={<SectionTitle id="services-title">{t.rich('title', {br: () => <br />, accent: (text) => <em>{text}</em>})}</SectionTitle>}>
      <p>{t.rich('description', {br: () => <br />})}</p>
    </SectionHeading>
    <div className={styles.grid}>{packages.map((service, index) => <ServicePackageChoice key={service.id} service={service} index={index + 1} labels={labels} />)}</div>
    <FinePrint>{t('fineprint')}</FinePrint>
    <div className={styles.therapy}>
      <div className={styles.symbol} aria-hidden="true">✦</div>
      <div className={styles.copy}>
        <Eyebrow>{t('therapy.eyebrow')}</Eyebrow>
        <h3>{t.rich('therapy.title', {br: () => <br />, accent: (text) => <em>{text}</em>})}</h3>
        <p>{t('therapy.description')}</p>
        <FinePrint>{t('therapy.note')}</FinePrint>
      </div>
      <div className={styles.therapyAction}><p>{t.rich('therapy.price', {br: () => <br />})}</p><ServiceChoiceLink service="therapy" variant="outline">{t('therapy.action')}</ServiceChoiceLink></div>
    </div>
    <div className={styles.consultations}>
      <p>{t('consultations.title')}</p>
      <ServiceChoiceLink service="consultation">{t('options.consultation')}</ServiceChoiceLink>
      <ServiceChoiceLink service="therapyConsultation">{t('consultations.therapy')}</ServiceChoiceLink>
    </div>
  </Section>;
}
