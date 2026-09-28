'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import type {InteriorService} from '../model/services';
import styles from './service-card.module.scss';

type Props = {service: InteriorService; index: number};

// Переключение вариантов живёт здесь, чтобы вся страница не становилась клиентским компонентом.
export function ServiceCard({service, index}: Props) {
  const t = useTranslations('interior.services');
  const [selected, setSelected] = useState(0);
  const variant = service.variants[selected];
  const prefix = `cards.${service.id}`;
  const itemIds = ['one', 'two', 'three'] as const;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{t(`${prefix}.tag`)}</span>
      </div>
      <h3>{t(`${prefix}.name`)}</h3>
      <p className={styles.intro}>{t(`${prefix}.intro`)}</p>
      <div
        className={styles.tabs}
        role="group"
        aria-label={t('variantLabel', {name: t(`${prefix}.name`)})}
      >
        {service.variants.map((option, optionIndex) => (
          <button
            key={option}
            type="button"
            aria-pressed={selected === optionIndex}
            onClick={() => setSelected(optionIndex)}
          >
            {t(`${prefix}.variants.${option}.name`)}
          </button>
        ))}
      </div>
      <ul>
        {itemIds.map((item) => <li key={item}>{t(`${prefix}.variants.${variant}.items.${item}`)}</li>)}
      </ul>
      <p className={styles.difference}>{t(`${prefix}.variants.${variant}.difference`)}</p>
      <div className={styles.price}>
        <strong>{t('priceAgreement')}</strong>
        <span>{t('priceUnit')}</span>
      </div>
      <a className={styles.link} href="#contacts">
        {t('discussPackage')}
        <span aria-hidden="true">↗</span>
      </a>
      <p className={styles.remote}>{t('remote')}</p>
    </article>
  );
}
