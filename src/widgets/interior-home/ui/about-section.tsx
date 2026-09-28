import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {SectionLabel} from './section-label';
import styles from './interior-home.module.scss';

// Блок знакомит с дизайнером и объясняет три принципа подхода из макета.
export function AboutSection() {
  const t = useTranslations('interior.about');
  const principles = ['nature', 'clarity', 'personal'] as const;

  return (
    <section className={`${styles.section} ${styles.about}`} id="approach">
      <SectionLabel title={t('label')} number={t('number')} />
      <div className={styles.aboutLayout}><div className={styles.portrait}><Image src="/interior/irina.jpg" alt={t('portraitAlt')} fill sizes="(max-width: 800px) 100vw, 50vw" /><div className={styles.portraitCaption}>{t('portraitLine1')}<br />{t('portraitLine2')}<small>{t('portraitCaption')}</small></div><span aria-hidden="true">✦</span></div><div className={styles.aboutCopy}><p className={styles.eyebrow}>{t('eyebrow')}</p><h2>{t('headingLine1')}<br />{t('headingLine2')}<br /><em>{t('headingAccent')}</em></h2><p>{t('paragraph1')}</p><p>{t('paragraph2')}</p>{principles.map((id, index) => <div className={styles.principle} key={id}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{t(`principles.${id}.title`)}</h3><p>{t(`principles.${id}.description`)}</p></div></div>)}</div></div>
    </section>
  );
}
