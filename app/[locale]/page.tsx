import styles from './styles/main.module.scss'
import Image from "next/image";
import {MainCardFeature} from "@/app/[locale]/features";
import {getTranslations} from 'next-intl/server';
import {useTranslations} from 'next-intl';
import type {Metadata} from 'next';

// Метаданные главной страницы берутся из того же словаря, что и текст интерфейса.
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('home');
    return {title: t('metaTitle'), description: t('metaDescription')};
}

// В корневой странице пока сохранена исходная разметка; локализуем и её видимые подписи.
export default function Home() {
    const t = useTranslations('home');
  return (
      <main className={styles.main}>
          <section className={styles.mainLeftBox}>
              <section className={styles.leftBox}>
                  <div className={styles.logo}>
                      <Image src={'/logo/Logo_white.webp'} alt={t('logoAlt')} width={977} height={338}/>
                  </div>
                  <div className={styles.photo}>
                      <Image src={'/logo/photo.jpg'} alt={t('photoAlt')} width={955} height={1280}/>
                  </div>
                  <div className={styles.name}>
                      <h1>{t('surname')}</h1>
                      <h1>{t('givenName')}</h1>
                  </div>
                  <div className={styles.contact}>
                      <a href="mailto:verbitsky.vastu@gmail.com">verbitsky.vastu@gmail.com</a>
                      <a href="tel:+79771315563">+79771315563</a>
                  </div>
              </section>
              <section className={styles.infoAbout}>
                  <h1>{t('aboutPlaceholder')}</h1>
              </section>
          </section>
          <section className={styles.mainBox}>
              <MainCardFeature/>
          </section>
      </main>
  );
}
