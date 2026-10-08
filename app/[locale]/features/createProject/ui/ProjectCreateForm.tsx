'use client';

import {useId} from 'react';
import type messages from '@/messages/en.json';
import {categoriesByType} from '@/app/[locale]/entities/project/classification';
import {FormField} from '@/app/[locale]/shared/UI/formField/FormField';
import {ActionButton} from '@/app/[locale]/shared/UI/actionLink';
import {useProjectForm} from '../model/useProjectForm';
import {ProjectMediaFields} from './ProjectMediaFields';
import styles from './ProjectCreateForm.module.scss';

type Props = {copy: typeof messages.projectAdmin; classification: typeof messages.projectClassification};

// Пустая форма: записи не появляются при открытии страницы или добавлении полей картинки.
// Сервер передаёт выбранные тексты из messages; доступ к MongoDB есть только у API.
export function ProjectCreateForm({copy, classification}: Props) {
  const {type, setType, images, pending, result, submit, addImage, removeImage} = useProjectForm();
  const noticeId = useId();
  const error = result?.error && (copy.errors[result.error as keyof typeof copy.errors] ?? copy.errors.UNKNOWN);
  const field = result?.field?.split('.')[0];
  const fieldLabel = field && (copy.fields[field as keyof typeof copy.fields] ?? (field === 'media' ? copy.mediaTitle : ''));

  return <form onSubmit={submit} className={styles.form} aria-describedby={noticeId}>
    <p className={styles.notice} id={noticeId}>{copy.notice}</p>
    <fieldset disabled={pending} className={styles.fields}>
      <FormField label={copy.fields.adminToken}><input name="adminToken" type="password" required minLength={32} maxLength={256} autoComplete="off" /></FormField>
      <p className={styles.notice}>{copy.accessHint}</p>
      <div className={styles.grid}>
        <FormField label={copy.fields.slug}><input name="slug" required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="miami-house" /></FormField>
        <FormField label={copy.fields.contentKey}><input name="contentKey" required maxLength={100} pattern="[a-zA-Z][a-zA-Z0-9_-]*" placeholder="miami" /></FormField>
        <FormField label={copy.fields.type}><select name="type" value={type} onChange={(event) => setType(event.target.value as typeof type)}>
          {Object.entries(classification.types).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select></FormField>
        <FormField label={copy.fields.category}><select key={type} name="category" defaultValue={categoriesByType[type][0]}>
          {categoriesByType[type].map((key) => <option key={key} value={key}>{classification.categories[key]}</option>)}
        </select></FormField>
        <FormField label={copy.fields.countryCode}><input name="countryCode" maxLength={2} pattern="[a-zA-Z]{2}" placeholder="US" /></FormField>
        <FormField label={copy.fields.citySlug}><input name="citySlug" maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="miami" /></FormField>
        <FormField label={copy.fields.areaM2}><input name="areaM2" type="number" min={0.01} max={10000000} step="any" /></FormField>
        <FormField label={copy.fields.year}><input name="year" type="number" min={1000} max={9999} step={1} /></FormField>
        <FormField label={copy.fields.publicationStatus}><select name="publicationStatus" defaultValue="draft">
          <option value="draft">{copy.statuses.draft}</option><option value="published">{copy.statuses.published}</option>
        </select></FormField>
      </div>
      <label className={styles.checkbox}><input name="featured" type="checkbox" />{copy.fields.featured}</label>
      <h2>{copy.mediaTitle}</h2>
      <p className={styles.notice}>{copy.mediaHint}</p>
      {images.map((id, index) => <ProjectMediaFields key={id} id={id} index={index} copy={copy} remove={() => removeImage(id)} />)}
      <ActionButton variant="outline" onClick={addImage} disabled={images.length >= 60}>{copy.addImage}</ActionButton>
      {images.length > 0 && <FormField label={copy.fields.coverMediaId}><select name="coverMediaId" defaultValue="">
        <option value="">{copy.firstImage}</option>
        {images.map((id, index) => <option key={id} value={id}>{copy.image} {index + 1}</option>)}
      </select></FormField>}
      <ActionButton type="submit" variant="gold">{pending ? copy.saving : copy.submit}</ActionButton>
    </fieldset>
    {result?.id && <p role="status" className={styles.notice}>{copy.success} <code>{result.id}</code></p>}
    {error && <p role="alert" className={styles.error}>{error} {fieldLabel}</p>}
  </form>;
}
