// Идентификаторы стабильны между языками: текст не используется как значение формы.
export const packageDefinitions = [
  {id: 'basic', variants: ['basic', 'basicDrawings']},
  {id: 'standard', variants: ['standard', 'standardPlus']},
  {id: 'premium', variants: ['premium', 'premiumPlus']},
] as const;

export const serviceIds = ['undecided', 'basic', 'basicDrawings', 'standard', 'standardPlus', 'premium', 'premiumPlus', 'therapy', 'consultation', 'therapyConsultation', 'showroom'] as const;
export type ServiceId = typeof serviceIds[number];
export type ServiceOption = {id: ServiceId; label: string};
export type ServiceVariant = {id: ServiceId; label: string; items: string[]; difference: string};
export type ServicePackage = {id: string; name: string; tag: string; intro: string; variants: ServiceVariant[]};
export type ServiceCardLabels = {price: string;unit: string;remote: string};

export function isServiceId(value: string): value is ServiceId {
  return serviceIds.some((id) => id === value);
}
