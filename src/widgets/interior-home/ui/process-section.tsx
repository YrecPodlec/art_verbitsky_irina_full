import {useTranslations} from 'next-intl';
import {processSteps} from '../model/steps';
import {SectionLabel} from './section-label';
import styles from './interior-home.module.scss';

// Нативные details дают раскрывающиеся этапы без дополнительного JavaScript.
export function ProcessSection() {
  const t = useTranslations('interior.process');
  return (
    <section className={`${styles.section} ${styles.process}`} id="process">
      <SectionLabel title={t('label')} number={t('number')} />
      <div className={styles.processLayout}><div className={styles.processIntro}><h2>{t('headingLine1')}<br />{t('headingLine2')}<br /><em>{t('headingAccent')}</em></h2><p>{t('intro')}</p><div className={styles.planArt} aria-hidden="true"><span>01</span><span>◇</span><span>02</span><span>╱</span><span>03</span></div><a className={styles.textLink} href="#contacts">{t('contactLink')} ↗</a></div><div className={styles.processList}>{processSteps.map((step, index) => <details key={step} open={index === 0}><summary><span>{String(index + 1).padStart(2, '0')}</span><h3>{t(`steps.${step}.title`)}</h3><span aria-hidden="true">＋</span></summary><div className={styles.stepContent}><small>{t('workLabel')}</small><p>{t(`steps.${step}.work`)}</p><small>{t('resultLabel')}</small><p>{t(`steps.${step}.result`)}</p></div></details>)}</div></div>
      <p className={styles.fineprint}>{t('fineprint')}</p>
    </section>
  );
}
