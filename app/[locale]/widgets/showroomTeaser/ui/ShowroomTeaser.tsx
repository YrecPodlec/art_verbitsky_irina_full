import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import interiorImage from '@/public/interior/interior-evening.png';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import {SectionTopline, SectionTitle, Eyebrow, FinePrint} from '@/app/[locale]/shared/UI/section';
import styles from './ShowroomTeaser.module.scss';

// Это превью на interior. Самостоятельная страница шоурума в этой задаче не меняется.
export async function ShowroomTeaser() {
  const t = await getTranslations('showroomTeaser');
  return <section className={styles.section} id="showroom" aria-labelledby="showroom-title">
    <Image className={styles.image} src={interiorImage} alt={t('imageAlt')} fill sizes="100vw" loading="lazy" />
    <div className={styles.shade} aria-hidden="true" />
    <SectionTopline eyebrow={t('eyebrow')} index={t('sectionIndex')} />
    <div className={styles.copy}>
      <Eyebrow>{t('intro')}</Eyebrow>
      <SectionTitle id="showroom-title">{t.rich('title', {br: () => <br />, accent: (text) => <em>{text}</em>})}</SectionTitle>
      <p>{t.rich('description', {br: () => <br />})}</p>
      <ActionLink className={styles.action} href="/showroom" variant="gold">{t('action')}</ActionLink>
      <FinePrint>{t('note')}</FinePrint>
    </div>
    <span className={styles.watermark} aria-hidden="true">3D</span>
  </section>;
}
