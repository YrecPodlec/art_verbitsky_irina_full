import {getTranslations} from 'next-intl/server';
import {packageDefinitions, serviceIds, type ServiceOption, type ServicePackage} from './services';

// Единственный адаптер словаря: пакеты и поле «Услуга» получают названия из общих ключей.
export async function getServices(): Promise<{packages: ServicePackage[]; options: ServiceOption[]}> {
  const t = await getTranslations('services');
  return {
    packages: packageDefinitions.map(({id, variants}) => ({
      id,
      name: t(`options.${id}`),
      tag: t(`packages.${id}.tag`),
      intro: t(`packages.${id}.intro`),
      variants: variants.map((variant, index) => ({
        id: variant,
        label: index === 0 ? t(`options.${variant}`) : t(`packages.${id}.extraLabel`),
        items: t.raw(`variants.${variant}.items`) as string[],
        difference: t(`variants.${variant}.difference`),
      })),
    })),
    options: serviceIds.map((id) => ({id, label: t(`options.${id}`)})),
  };
}
