import {getTranslations} from 'next-intl/server';
import type {PageId} from '../../config/navigation';
import {getBreadcrumbs} from './getBreadcrumbs';

// Серверный адаптер добавляет перевод к маршрутам. UI получает уже готовые подписи.
// Этот модуль вызывается из страницы, а не из клиентского компонента.
export async function getLocalizedBreadcrumbs(pageId: PageId) {
  const t = await getTranslations('breadcrumbs');

  return {
    label: t('label'),
    items: getBreadcrumbs(pageId).map(({id, href}) => ({href, label: t(id)})),
  };
}
