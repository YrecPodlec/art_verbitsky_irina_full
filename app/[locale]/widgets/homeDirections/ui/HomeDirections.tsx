import {getTranslations} from 'next-intl/server';
import {directions, DirectionCard} from '@/app/[locale]/entities/direction';
import styles from './HomeDirections.module.scss';

// Любое число карточек берётся из одного локального массива. Прокрутка нативная:
// мышь, тачпад, касание и клавиатура работают без обработчиков wheel и тяжёлых каруселей.
export async function HomeDirections() {
  const t = await getTranslations('home.directions');
  return <section className={styles.panel} id="directions" aria-labelledby="directions-title">
    <div className={styles.heading}><h2 id="directions-title">{t('heading')}</h2><span>{t('count', {count: directions.length})}</span></div>
    <p className={styles.hint} id="directions-scroll-hint">{t('scrollHint')}</p>
    <div className={styles.scroll} role="region" tabIndex={0} aria-label={t('scrollLabel')} aria-describedby="directions-scroll-hint" data-directions-scroll="true">
      <div className={styles.list}>{directions.map((direction, index) => <DirectionCard key={direction.id} direction={direction} index={index} />)}</div>
    </div>
  </section>;
}
