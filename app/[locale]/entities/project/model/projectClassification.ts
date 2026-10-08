import type {ProjectCategory, ProjectType} from '@/app/generated/prisma/enums';

// Один справочник для выбора категории в форме и проверки перед сохранением.
// Здесь только постоянные коды; отображаемые названия должны быть в messages.
export const categoriesByType = {
  residential: ['house', 'apartment'],
  commercial: ['hotel', 'cafe'],
} as const satisfies Record<ProjectType, readonly ProjectCategory[]>;

// Тип выводится из справочника: residential допускает только house/apartment,
// commercial — только hotel/cafe. Отдельный повторяющийся список не нужен.
export type ProjectClassification = {
  [Type in keyof typeof categoriesByType]: {
    type: Type;
    category: (typeof categoriesByType)[Type][number];
  };
}[keyof typeof categoriesByType];

// Проверяем unknown, потому что данные формы/API могут не соответствовать TS-типам.
// Функция не меняет данные и подходит как для сервера, так и для клиентской формы.
export function isProjectClassification(value: unknown): value is ProjectClassification {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  if (!('type' in value) || !('category' in value)) return false;

  const {type, category} = value;
  if (type !== 'residential' && type !== 'commercial') return false;
  if (typeof category !== 'string') return false;

  const allowedCategories: readonly string[] = categoriesByType[type];
  return allowedCategories.includes(category);
}

// Сервер вызывает эту проверку перед create/update/import.
// При ошибке выполнение остановится до записи; текст для пользователя берём из messages.
export function assertProjectClassification(value: unknown): asserts value is ProjectClassification {
  if (!isProjectClassification(value)) {
    throw new TypeError('INVALID_PROJECT_CLASSIFICATION');
  }
}
