import Image from 'next/image';
import {useTranslations} from 'next-intl';
import styles from './interior-home.module.scss';

// Первый экран переносит композицию макета и ведёт к готовым секциям этой страницы.
export function HeroSection() {
  const t = useTranslations('interior.hero');
  const paths = [{id: 'projects', href: '#projects'}, {id: 'services', href: '#services'}, {id: 'contacts', href: '#contacts'}] as const;

  return (
    <section className={styles.hero} id="beginning">
      <Image className={styles.heroImage} src="/interior/interior-evening.png" alt={t('imageAlt')} fill priority sizes="100vw" />
      <div className={styles.heroShade} aria-hidden="true" /><div className={styles.heroFrame} aria-hidden="true" />
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>✦ &nbsp;{t('eyebrow')}</p>
        <h1>{t('titleLine1')}<br />{t('titleLine2')}<br /><em>{t('titleAccent')}</em></h1>
        <p className={styles.heroDescription}>{t('description')}</p>
        <p className={styles.heroSignature}>{t('signature')}</p>
      </div>
      <p className={styles.heroNote} aria-hidden="true">{t('noteLine1')}<br />{t('noteLine2')}</p>
      <div className={styles.heroPaths}>
        {paths.map((path, index) => <a href={path.href} key={path.id}><span className={styles.pathNumber}>{String(index + 1).padStart(2, '0')}</span><span><small>{t(`paths.${path.id}.eyebrow`)}</small><strong>{t(`paths.${path.id}.title`)}</strong></span><span className={styles.pathArrow} aria-hidden="true">↗</span></a>)}
      </div>
    </section>
  );
}
