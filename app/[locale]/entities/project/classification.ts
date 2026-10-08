// Отдельный публичный вход без серверной карточки и getTranslations из index.ts.
// Его можно использовать в будущей клиентской форме и серверном коде сохранения.
export {categoriesByType, isProjectClassification, assertProjectClassification} from './model/projectClassification';
export type {ProjectClassification} from './model/projectClassification';
