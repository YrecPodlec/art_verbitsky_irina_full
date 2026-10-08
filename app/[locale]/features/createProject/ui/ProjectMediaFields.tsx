import type messages from '@/messages/en.json';
import {FormField} from '@/app/[locale]/shared/UI/formField/FormField';
import {ActionButton} from '@/app/[locale]/shared/UI/actionLink';
import styles from './ProjectCreateForm.module.scss';

type Props = {id: string; index: number; copy: typeof messages.projectAdmin; remove: () => void};

// Переиспользуемая группа одного изображения; сам файл здесь не загружается.
export function ProjectMediaFields({id, index, copy, remove}: Props) {
  const prefix = `media.${id}`;
  return <fieldset className={styles.media}>
    <legend>{copy.image} {index + 1}</legend>
    <div className={styles.grid}>
      <FormField label={copy.mediaFields.contentKey}><input name={`${prefix}.contentKey`} required maxLength={100} /></FormField>
      <FormField label={copy.mediaFields.category}><select name={`${prefix}.category`} defaultValue="visualization">
        {Object.entries(copy.mediaCategories).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select></FormField>
      <FormField label={copy.mediaFields.url}><input name={`${prefix}.url`} required maxLength={2048} placeholder="https://…/projects/…" /></FormField>
      <FormField label={copy.mediaFields.width}><input name={`${prefix}.width`} type="number" required min={1} max={100000} step={1} /></FormField>
      <FormField label={copy.mediaFields.height}><input name={`${prefix}.height`} type="number" required min={1} max={100000} step={1} /></FormField>
    </div>
    <ActionButton variant="text" onClick={remove}>{copy.removeImage}</ActionButton>
  </fieldset>;
}
