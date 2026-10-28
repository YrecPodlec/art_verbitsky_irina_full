'use client';

import {useId, type FormEvent} from 'react';
import type messages from '@/messages/en.json';
import {categoriesByType} from '@/app/[locale]/entities/project/classification';
import type {CatalogFilters} from '@/app/[locale]/entities/project/model/catalogQuery';
import {ActionButton} from '@/app/[locale]/shared/UI/actionLink';
import {useCatalogNavigation} from '../model/useCatalogNavigation';
import styles from './GalleryFilters.module.scss';

type Props = {filters: CatalogFilters; countries: {value: string; label: string}[]; copy: typeof messages.gallery; classification: typeof messages.projectClassification};

// Фильтры хранят коды, подписи получают из messages. Поиск отправляется по Enter/кнопке,
// чтобы не делать запрос к MongoDB на каждую введённую букву.
export function GalleryFilters({filters, countries, copy, classification}: Props) {
  const {pending, update} = useCatalogNavigation(filters);
  const id = useId();
  const categories = filters.type ? categoriesByType[filters.type] : Object.values(categoriesByType).flat();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update({q: String(new FormData(event.currentTarget).get('q') ?? '').trim()});
  }
  return <div className={styles.toolbar} aria-busy={pending}>
    <div className={styles.tabs} role="group" aria-label={copy.filters.type}>
      {(['', 'residential', 'commercial'] as const).map((type) => <button key={type} type="button" disabled={pending} aria-pressed={filters.type === type} onClick={() => update({type, category: ''})}>
        {type ? classification.types[type] : copy.filters.allProjects}
      </button>)}
    </div>
    <div className={styles.controls}>
      <label htmlFor={`${id}-category`}><span>{copy.filters.category}</span><select id={`${id}-category`} value={filters.category} disabled={pending} onChange={(e) => update({category: e.target.value as CatalogFilters['category']})}>
        <option value="">{copy.filters.allCategories}</option>
        {categories.map((category) => <option key={category} value={category}>{classification.categories[category]}</option>)}
      </select></label>
      <label htmlFor={`${id}-country`}><span>{copy.filters.country}</span><select id={`${id}-country`} value={filters.country} disabled={pending} onChange={(e) => update({country: e.target.value})}>
        <option value="">{copy.filters.allCountries}</option>
        {countries.map((country) => <option key={country.value} value={country.value}>{country.label}</option>)}
      </select></label>
      <form onSubmit={submit} className={styles.search} role="search">
        <label htmlFor={`${id}-search`}><span>{copy.filters.searchLabel}</span><input id={`${id}-search`} name="q" type="search" maxLength={100} defaultValue={filters.q} placeholder={copy.filters.searchPlaceholder} /></label>
        <ActionButton type="submit" disabled={pending}>{copy.filters.search}</ActionButton>
      </form>
    </div>
    <p className={styles.status} role="status">{pending ? copy.filters.pending : ''}</p>
  </div>;
}
