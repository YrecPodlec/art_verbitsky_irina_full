import {categoriesByType} from '../app/[locale]/entities/project/model/projectClassification';

// MongoDB проверит эти сочетания даже при записи напрямую через Compass.
// Список берём из того же справочника, что и проверка приложения.
export const projectValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['type', 'category'],
    oneOf: Object.entries(categoriesByType).map(([type, categories]) => ({
      properties: {
        type: {enum: [type]},
        category: {enum: [...categories]},
      },
    })),
  },
};
