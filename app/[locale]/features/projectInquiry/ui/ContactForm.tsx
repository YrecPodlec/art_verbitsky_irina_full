'use client';

import {useId} from 'react';
import type englishMessages from '@/messages/en.json';
import {isServiceId, type ServiceOption} from '@/app/[locale]/entities/service';
import {ActionButton} from '@/app/[locale]/shared/UI/actionLink';
import {FormField} from '@/app/[locale]/shared/UI/formField/FormField';
import {useContactForm} from '../model/useContactForm';
import styles from './ContactForm.module.scss';

export type ContactFormMessages = typeof englishMessages.contactForm;
type Props = {copy: ContactFormMessages; services: ServiceOption[]};

// Клиент получает только нужные ему строки, уже выбранные сервером из messages.
export function ContactForm({copy, services}: Props) {
  const {service, selectService, preview, setPreview, ready, submit, nameRef, previewRef} = useContactForm();
  const noticeId = useId();

  return <div>
    <form className={styles.form} onSubmit={submit} hidden={preview} aria-describedby={noticeId}>
      <p className={styles.caption}>{copy.caption}</p>
      <fieldset disabled={!ready} className={styles.fields}>
        <div className={styles.grid}>
          <FormField label={copy.name.label}><input ref={nameRef} name="name" autoComplete="name" required maxLength={100} placeholder={copy.name.placeholder} /></FormField>
          <FormField label={copy.email.label}><input name="email" type="email" autoComplete="email" required maxLength={200} placeholder={copy.email.placeholder} /></FormField>
          <FormField label={copy.location.label}><input name="location" required maxLength={160} placeholder={copy.location.placeholder} /></FormField>
          <FormField label={copy.area.label}><input name="area" type="number" min={1} max={100000} step="any" placeholder={copy.area.placeholder} /></FormField>
          <FormField label={copy.spaceType.label}><select name="type" defaultValue="apartment">
            {Object.entries(copy.spaceType.options).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select></FormField>
          <FormField label={copy.service}><select name="service" value={service} onChange={(event) => {if (isServiceId(event.target.value)) selectService(event.target.value);}}>
            {services.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select></FormField>
        </div>
        <div className={styles.message}><FormField label={copy.message.label}><textarea name="message" rows={3} maxLength={3000} placeholder={copy.message.placeholder} /></FormField></div>
        <label className={styles.checkbox}><input name="video" type="checkbox" />{copy.video}</label>
        <p className={styles.notice} id={noticeId}>{copy.demoNotice}</p>
        <ActionButton className={styles.submit} variant="gold" type="submit" disabled={!ready}>{copy.submit}</ActionButton>
      </fieldset>
      <noscript><p className={styles.notice}>{copy.enableJavaScript}</p></noscript>
    </form>
    {/* Скрытая форма остаётся смонтированной: возврат сохраняет введённые поля только в памяти вкладки. */}
    <div className={styles.preview} ref={previewRef} hidden={!preview} tabIndex={-1}>
      <span className={styles.star} aria-hidden="true">✦</span>
      <p className={styles.caption}>{copy.preview.caption}</p>
      <h3>{copy.preview.title}</h3>
      <p>{copy.preview.description}</p>
      <p className={styles.demoNotice} role="status">{copy.preview.notice}</p>
      <ActionButton variant="text" onClick={() => setPreview(false)}>{copy.preview.back}</ActionButton>
    </div>
  </div>;
}
