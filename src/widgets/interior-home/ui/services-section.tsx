import {interiorServices, ServiceCard} from '@/src/entities/interior-service';
import {useTranslations} from 'next-intl';
import {SectionLabel} from './section-label';
import styles from './interior-home.module.scss';

// Здесь собираются пакеты услуг; варианты внутри каждой карточки переключаются независимо.
export function ServicesSection() {
  const t = useTranslations('interior.services');
  return (
    <section className={`${styles.section} ${styles.services}`} id="services">
      <SectionLabel title={t('label')} number={t('number')} />
      <div className={styles.sectionHeading}><h2>{t('headingLine1')}<br /><em>{t('headingAccent')}</em></h2><p>{t('intro')}</p></div>
      <div className={styles.pricingGrid}>{interiorServices.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}</div>
      <p className={styles.fineprint}>{t('fineprint')}</p>
      <div className={styles.therapyPanel}><div className={styles.therapySymbol} aria-hidden="true">✦</div><div><p className={styles.eyebrow}>{t('therapy.eyebrow')}</p><h3>{t('therapy.headingLine1')}<br />{t('therapy.headingLine2')} <em>{t('therapy.headingAccent')}</em></h3><p>{t('therapy.description')}</p><small>{t('therapy.disclaimer')}</small></div><a className={styles.outlineButton} href="#contacts">{t('therapy.link')} ↗</a></div>
    </section>
  );
}
