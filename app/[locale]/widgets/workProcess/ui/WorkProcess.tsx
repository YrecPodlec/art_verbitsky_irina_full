import {getTranslations} from 'next-intl/server';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import {AccordionItem} from '@/app/[locale]/shared/UI/accordion/AccordionItem';
import {FloorPlan} from '@/app/[locale]/shared/UI/floorPlan/FloorPlan';
import {Section, SectionTitle, FinePrint} from '@/app/[locale]/shared/UI/section';
import styles from './WorkProcess.module.scss';

const steps = ['sketch', 'visual', 'documents', 'supervision', 'procurement'] as const;

// Все этапы уже есть в серверном HTML, включая текст свёрнутых пунктов.
export async function WorkProcess() {
  const t = await getTranslations('workProcess');
  return <Section id="process" eyebrow={t('eyebrow')} index={t('sectionIndex')}>
    <div className={styles.layout}>
      <div className={styles.intro}>
        <SectionTitle id="process-title">{t.rich('title', {br: () => <br />, accent: (text) => <em>{text}</em>})}</SectionTitle>
        <p>{t.rich('description', {br: () => <br />})}</p>
        <div className={styles.plan}><FloorPlan caption={t('planCaption')} /></div>
        <ActionLink className={styles.action} href="#contacts">{t('action')}</ActionLink>
      </div>
      <div>{steps.map((id, index) => <AccordionItem key={id} title={t(`steps.${id}.name`)} index={String(index + 1).padStart(2, '0')} defaultOpen={index === 0}>
        <div className={styles.step}>
          <p className={styles.label}>{t('whatWeDo')}</p><p>{t(`steps.${id}.do`)}</p>
          <p className={styles.label}>{t('whatYouGet')}</p><p>{t(`steps.${id}.get`)}</p>
          <div className={styles.example}><span>{t('exampleLabel')}</span>{t(`steps.${id}.example`)}</div>
        </div>
      </AccordionItem>)}</div>
    </div>
    <FinePrint>{t('fineprint')}</FinePrint>
  </Section>;
}
