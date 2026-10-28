import mockDirections from './directions.mock.json';

export type Direction = {
  id: string;
  contentKey: string;
  href: string;
  image: string;
};

// Локальная «БД» направлений. Порядок объектов = порядок карточек.
// Для новой карточки добавь объект в JSON и одноимённые тексты в messages.home.directions.items.
// Названия/описания не храним в массиве, чтобы не дублировать языки.
export const directions: readonly Direction[] = mockDirections;

