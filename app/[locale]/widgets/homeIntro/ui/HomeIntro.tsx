import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import portrait from '@/public/interior/irina.jpg';
import {directions} from '@/app/[locale]/entities/direction';
import {ArrowUpRight} from '@/app/[locale]/shared/UI/icons/ArrowUpRight';
import styles from './HomeIntro.module.scss';

// Крупный авторский блок без эффектов на фотографии. Все тексты переводятся на сервере.
export async function HomeIntro() {
  const t = await getTranslations('home.intro');
  return <div className={styles.intro}>
    <p className={styles.eyebrow}><span aria-hidden="true">✳</span>{t('eyebrow')}</p>
    <h1 id="home-title"><span>{t('titleOne')}</span><span>{t('titleTwo')}</span><em>{t('titleThree')}</em></h1>
    <p className={styles.description}>{t('description')}</p>
    <a className={styles.choose} href="#directions">{t('choose')}<ArrowUpRight /></a>
    <div className={styles.author}>
      <Image className={styles.portrait} src={portrait} alt={t('portraitAlt')} sizes="(max-width: 40rem) 40vw, 224px" quality={90} />
      <div><span className={styles.signature} aria-hidden="true">Irina.</span><p>{t('portraitCopy')}</p><a href="#about">{t('meet')}<ArrowUpRight /></a></div>
    </div>
    <div className={styles.footnote}><span>01 — {String(directions.length).padStart(2, '0')}</span><span>{t('closing')}</span></div>
  </div>;
}
