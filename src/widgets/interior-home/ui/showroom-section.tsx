import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {SectionLabel} from './section-label';
import styles from './interior-home.module.scss';

// Тизер сохраняет место шоурума в композиции, пока интерактивный инструмент переносится из макета.
export function ShowroomSection() {
  const t = useTranslations('interior.showroom');
  return (
    <section className={styles.showroom} id="showroom"><Image src="/interior/interior-evening.png" alt="" fill sizes="100vw" /><div className={styles.showroomShade} aria-hidden="true" /><div className={styles.showroomContent}><SectionLabel title={t('label')} number={t('number')} /><div><p className={styles.eyebrow}>{t('eyebrow')}</p><h2>{t('headingLine1')}<br />{t('headingLine2')}<br /><em>{t('headingAccent')}</em></h2><p>{t('description')}</p><a className={styles.goldButton} href="#contacts">{t('contactLink')} ↗</a></div></div><span className={styles.showroomMark} aria-hidden="true">3D</span></section>
  );
}
