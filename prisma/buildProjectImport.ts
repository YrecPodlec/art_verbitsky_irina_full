import {parseProjectInput} from '../app/[locale]/entities/project/model/parseProjectInput';

export type CatalogEntry = {
  folder: string; slug: string; contentKey: string; type: string; category: string;
  countryCode?: string; citySlug?: string; coverFile?: string;
};
export type InspectedImage = {
  folder: string; file: string; storageKey: string; url: string; contentKey: string;
  width: number; height: number; mimeType: string; sizeBytes: number; verified: boolean;
};

// Чистая функция: связывает проверенные файлы с проектом, но ничего не записывает.
// Порядок естественный: 1, 2, ... 10. Все текущие файлы просмотрены как визуализации.
export function buildProjectImport(entry: CatalogEntry, files: InspectedImage[]) {
  const images = files.filter((file) => file.folder === entry.folder)
    .sort((a, b) => a.file.localeCompare(b.file, 'en', {numeric: true}));
  if (!images.length) throw new Error('PROJECT_IMAGES_MISSING');
  const coverFile = entry.coverFile ?? images[0].file;
  if (!images.some((file) => file.file === coverFile)) throw new Error('PROJECT_COVER_MISSING');
  const media = images.map((file) => {
    const storageKey = `projects/${entry.folder}/${file.file}`;
    if (!file.verified || file.storageKey !== storageKey || file.url !==
      `https://mstvzrmidf14lpdu.public.blob.vercel-storage.com/${storageKey}`) {
      throw new Error('PROJECT_IMAGE_NOT_VERIFIED');
    }
    const cover = file.file === coverFile;
    return {
      id: `${entry.slug}-${cover ? 'cover' : file.contentKey}`,
      contentKey: cover ? 'cover' : file.contentKey,
      category: 'visualization', url: file.url, storageKey,
      width: file.width, height: file.height, mimeType: file.mimeType, sizeBytes: file.sizeBytes,
    };
  });
  // Используем ту же проверку, что и форма/API. Неизвестные площадь/год не выдумываем.
  return parseProjectInput({
    slug: entry.slug, contentKey: entry.contentKey, type: entry.type, category: entry.category,
    countryCode: entry.countryCode, citySlug: entry.citySlug,
    publicationStatus: 'published', featured: false,
    coverMediaId: `${entry.slug}-cover`, coverPosition: {x: 50, y: 50}, media,
  });
}
