export type InteriorService = {
  id: 'essential' | 'standard' | 'premium';
  variants: readonly ['base', 'plus'];
};

// Здесь только устойчивые идентификаторы и порядок карточек; весь видимый текст хранится в messages.
export const interiorServices: readonly InteriorService[] = [
  {id: 'essential', variants: ['base', 'plus']},
  {id: 'standard', variants: ['base', 'plus']},
  {id: 'premium', variants: ['base', 'plus']},
];
