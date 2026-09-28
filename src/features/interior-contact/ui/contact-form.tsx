'use client';

import {useState, type FormEvent} from 'react';
import {useTranslations} from 'next-intl';
import styles from './contact-form.module.scss';

// Форма пока демонстрационная: браузер проверяет поля, но данные никуда не отправляются.
export function ContactForm() {
  const t = useTranslations('interior.contactForm');
  const [preview, setPreview] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPreview(true);
  }

  if (preview) {
    return (
      <div className={styles.success} role="status">
        <span aria-hidden="true">✦</span>
        <p className={styles.caption}>{t('previewCaption')}</p>
        <h3>{t('previewTitle')}</h3>
        <p>{t('previewDescription')}</p>
        <button type="button" onClick={() => setPreview(false)}>{t('backToForm')} ↗</button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.caption}>{t('caption')}</p>
      <div className={styles.grid}>
        <label>{t('nameLabel')}<input name="name" required autoComplete="name" maxLength={100} placeholder={t('namePlaceholder')} /></label>
        <label>{t('emailLabel')}<input name="email" required type="email" autoComplete="email" maxLength={200} placeholder={t('emailPlaceholder')} /></label>
        <label>{t('locationLabel')}<input name="location" required maxLength={160} placeholder={t('locationPlaceholder')} /></label>
        <label>{t('areaLabel')}<input name="area" type="number" min="1" max="100000" placeholder={t('areaPlaceholder')} /></label>
        <label>{t('typeLabel')}<select name="type"><option value="apartment">{t('types.apartment')}</option><option value="house">{t('types.house')}</option><option value="commercial">{t('types.commercial')}</option><option value="other">{t('types.other')}</option></select></label>
        <label>{t('serviceLabel')}<select name="service"><option value="unsure">{t('serviceOptions.unsure')}</option><option value="essential">{t('serviceOptions.essential')}</option><option value="standard">{t('serviceOptions.standard')}</option><option value="premium">{t('serviceOptions.premium')}</option><option value="therapeutic">{t('serviceOptions.therapeutic')}</option></select></label>
      </div>
      <label>{t('messageLabel')}<textarea name="message" rows={3} maxLength={3000} placeholder={t('messagePlaceholder')} /></label>
      <label className={styles.checkbox}><input name="video" type="checkbox" />{t('videoLabel')}</label>
      <p className={styles.notice}>{t('notice')}</p>
      <button className={styles.submit} type="submit">{t('submit')} <span aria-hidden="true">↗</span></button>
    </form>
  );
}
