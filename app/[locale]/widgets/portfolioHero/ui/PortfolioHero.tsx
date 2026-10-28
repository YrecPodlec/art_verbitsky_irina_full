import Image from 'next/image';
import type {ReactNode} from 'react';
import {getTranslations} from 'next-intl/server';
import styles from './PortfolioHero.module.scss';

type Props = {title: ReactNode; eyebrow: string; description: string; breadcrumbs: ReactNode; children?: ReactNode} & (
  {background: ReactNode; image?: never; imageAlt?: never; position?: never} |
  {background?: never; image: string; imageAlt: string; position?: {x: number; y: number}}
);

// Общая серверная обложка каталога и кейса. Состояние и обработчики здесь не нужны.
export async function PortfolioHero({title, eyebrow, description, image, imageAlt, breadcrumbs, children, position, background}: Props) {
  const t = await getTranslations('portfolioInvitation');
  return <section className={styles.hero} aria-labelledby="portfolio-title">
    {/* Каталог передаёт обложку Майами, кейс — единственную обложку своего проекта. */}
    {background ?? (image && <Image className={styles.image} src={image} alt={imageAlt} fill sizes="100vw" quality={90} preload style={position ? {objectPosition: `${position.x}% ${position.y}%`} : undefined} />)}
    <div className={styles.shade} aria-hidden="true" />
    <div className={styles.content}>
      {breadcrumbs}
      <p className={styles.eyebrow}><span aria-hidden="true">✦</span>{eyebrow}</p>
      <h1 id="portfolio-title">{title}</h1>
      <p className={styles.description}>{description}</p>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
    <span className={styles.signature} aria-hidden="true">{t('signature')}</span>
  </section>;
}
