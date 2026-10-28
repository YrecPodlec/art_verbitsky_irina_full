'use client';

import {useTransition} from 'react';
import {useRouter} from '@/i18n/navigation';
import {catalogHref, type CatalogFilters} from '@/app/[locale]/entities/project/model/catalogQuery';

// В клиенте только навигация. Новую серверную выдачу Next получает без перезагрузки документа.
export function useCatalogNavigation(filters: CatalogFilters) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function update(patch: Partial<CatalogFilters>) {
    const next = {...filters, page: 1, ...patch};
    startTransition(() => router.push(catalogHref(next), {scroll: false}));
  }
  return {pending, update};
}
