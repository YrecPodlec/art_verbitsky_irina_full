// Теперь это MongoDB ObjectId, а не фиксированный список проектов из макета.
export type ProjectId = string;

export type ProjectData = {
  id: ProjectId;
  slug: string;
  image: string;
  imagePosition: {x: number; y: number};
  featured: boolean;
};

// Данные приходят из БД. Здесь только формат для UI, без копии проектов в локальном массиве.
