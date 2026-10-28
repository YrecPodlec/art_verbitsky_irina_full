import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {ArrowUpRight} from '@/app/[locale]/shared/UI/icons/ArrowUpRight';
import type {Direction} from '../model/directions';
import styles from './DirectionCard.module.scss';

// Серверная карточка: один шаблон для любого количества направлений.
// Вся площадь — ссылка, данные и порядок приходят снаружи, тексты — из messages.
export async function DirectionCard({direction, index}: {direction: Direction; index: number}) {
  const t = await getTranslations('home.directions.items');
  const key = direction.contentKey;
  return <article className={styles.card} data-direction-id={direction.id}>
    <Link className={styles.link} href={direction.href} prefetch={false} aria-label={`${t(`${key}.title`)} — ${t(`${key}.action`)}`}>
      <Image className={styles.image} src={direction.image} alt={t(`${key}.imageAlt`)} fill
        sizes="(max-width: 60rem) 90vw, 50vw" quality={90} preload={index === 0} />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.top}><span>{String(index + 1).padStart(2, '0')} / {t(`${key}.code`)}</span><span>{t(`${key}.tag`)}</span></div>
      <div className={styles.bottom}>
        <div><p className={styles.kicker}>{t(`${key}.kicker`)}</p><h3>{t(`${key}.title`)}</h3><p className={styles.description}>{t(`${key}.description`)}</p></div>
        <span className={styles.roundArrow}><ArrowUpRight /></span>
      </div>
      <span className={styles.action}>{t(`${key}.action`)}</span>
    </Link>
    {t.has(`${key}.note`) && <p className={styles.note}>{t(`${key}.note`)}</p>}
  </article>;
}
