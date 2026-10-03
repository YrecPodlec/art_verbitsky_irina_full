import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import portrait from '@/public/interior/irina.jpg';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import {Section, SectionTitle, Eyebrow} from '@/app/[locale]/shared/UI/section';
import {Principle} from './Principle';
import styles from './DesignerAbout.module.scss';

const principles = ['nature', 'clarity', 'personal'] as const;

// Статичный блок об авторе рендерится на сервере, фотография загружается по мере прокрутки.
export async function DesignerAbout() {
  const t = await getTranslations('designerAbout');
  return <Section id="approach" eyebrow={t('eyebrow')} index={t('sectionIndex')} tone="surface">
    <div className={styles.layout}>
      <figure className={styles.portrait}>
        <Image src={portrait} alt={t('imageAlt')} sizes="(max-width: 50rem) 90vw, 45vw" loading="lazy" />
        <figcaption>{t.rich('name', {br: () => <br />})}<span>{t('role')}</span></figcaption>
        <span className={styles.spark} aria-hidden="true">✦</span>
      </figure>
      <div className={styles.copy}>
        <Eyebrow>{t('greeting')}</Eyebrow>
        <SectionTitle id="approach-title">{t.rich('title', {br: () => <br />, accent: (text) => <em>{text}</em>})}</SectionTitle>
        <p>{t('description')}</p><p>{t('philosophy')}</p>
        <ol className={styles.principles}>{principles.map((id, index) => <Principle key={id} index={index + 1} title={t(`principles.${id}.title`)} description={t(`principles.${id}.description`)} />)}</ol>
        <ActionLink className={styles.action} href="/articles">{t('action')}</ActionLink>
      </div>
    </div>
  </Section>;
}
