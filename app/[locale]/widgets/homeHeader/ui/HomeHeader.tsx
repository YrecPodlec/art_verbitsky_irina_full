import {getTranslations} from 'next-intl/server';
import {HomeHeaderView} from './HomeHeaderView';

// Переводим подписи на сервере. Клиент получает только строки этой шапки.
export async function HomeHeader() {
  const t = await getTranslations('home.header');
  return <HomeHeaderView copy={{brand: t('brand'), caption: t('caption'), brandLabel: t('brandLabel'),
    navigation: t('navigation'), directions: t('directions'), about: t('about'), contact: t('contact'),
    write: t('write'), openMenu: t('openMenu'), closeMenu: t('closeMenu')}} />;
}
