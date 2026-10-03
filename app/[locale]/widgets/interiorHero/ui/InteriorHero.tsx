import Image from 'next/image';
import type {ReactNode} from 'react';
import {getTranslations} from 'next-intl/server';
import interiorImage from '@/public/interior/interior-evening.png';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import {heroActions} from '../model/actions';
import styles from './InteriorHero.module.scss';

type InteriorHeroProps = {
  breadcrumbs?: ReactNode;
};

// Серверный блок: перевод и разметка формируются до отправки страницы в браузер.
// Наведение и движение стрелок работают через SCSS, поэтому React-состояние здесь не требуется.
export async function InteriorHero({breadcrumbs}: InteriorHeroProps) {
  const t = await getTranslations('interiorHero');

  return (
    <section className={styles.hero} id="beginning" aria-labelledby="interior-hero-title">
      {/* Первый экран загружаем заранее; fill и sizes позволяют Next.js подобрать размер изображения. */}
      <Image className={styles.image} src={interiorImage} alt={t('imageAlt')} fill sizes="100vw" preload />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.frame} aria-hidden="true" />

      <div className={styles.content}>
        {/* Страница передаёт готовую навигацию: виджет отвечает только за её расположение. */}
        {breadcrumbs && <div className={styles.breadcrumbs}>{breadcrumbs}</div>}
        <p className={styles.eyebrow}>
          <span className={styles.star} aria-hidden="true">✦</span>
          {t('eyebrow')}
        </p>
        <h1 className={styles.title} id="interior-hero-title">
          {/* Слова и переносы остаются в словаре: другой язык может изменить порядок строк. */}
          {t.rich('title', {
            br: () => <br />,
            accent: (chunks) => <span>{chunks}</span>,
          })}
        </h1>
        <p className={styles.description}>
          {t.rich('description', {br: () => <br className={styles.desktopBreak} />})}
        </p>
        <p className={styles.signature}>{t('signature')}</p>
      </div>

      <p className={styles.note}>
        <span>{t.rich('note', {br: () => <br />})}</span>
      </p>

      <div className={styles.actions}>
        {heroActions.map(({id, index, href}) => (
          <ActionLink
            key={id}
            className={styles.action}
            href={href}
            variant="path"
            size="large"
            index={index}
            caption={t(`actions.${id}.caption`)}
          >
            {t(`actions.${id}.label`)}
          </ActionLink>
        ))}
      </div>
    </section>
  );
}
