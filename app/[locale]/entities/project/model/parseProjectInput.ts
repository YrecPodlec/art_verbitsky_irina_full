import type {Prisma} from '@/app/generated/prisma/client';
import {isProjectClassification} from './projectClassification';

export class ProjectInputError extends Error {
  field: string;
  constructor(field: string) {
    super('INVALID_PROJECT_INPUT');
    this.field = field;
  }
}

function object(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ProjectInputError(field);
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string, max = 100): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new ProjectInputError(field);
  return value.trim();
}

function key(value: unknown, field: string) {
  const result = text(value, field);
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(result)) throw new ProjectInputError(field);
  return result;
}

function optionalText(value: unknown, field: string, max = 100) {
  return value === undefined || value === null || value === '' ? undefined : text(value, field, max);
}

function number(value: unknown, field: string, min: number, max: number, integer = false): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
    throw new ProjectInputError(field);
  }
  return value;
}

// Проверка не подключается к БД. Собираем разрешённые поля явно, не записываем весь JSON запроса.
export function parseProjectInput(value: unknown) {
  const input = object(value, 'project');
  const slug = text(input.slug, 'slug');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new ProjectInputError('slug');
  const contentKey = key(input.contentKey, 'contentKey');
  const classification = {type: input.type, category: input.category};
  if (!isProjectClassification(classification)) throw new ProjectInputError('category');
  const publicationStatus = input.publicationStatus ?? 'draft';
  if (publicationStatus !== 'draft' && publicationStatus !== 'published') throw new ProjectInputError('publicationStatus');
  const featured = input.featured ?? false;
  if (typeof featured !== 'boolean') throw new ProjectInputError('featured');
  const countryCode = optionalText(input.countryCode, 'countryCode', 2);
  if (countryCode && !/^[A-Z]{2}$/.test(countryCode)) throw new ProjectInputError('countryCode');
  const citySlug = optionalText(input.citySlug, 'citySlug');
  if (citySlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(citySlug)) throw new ProjectInputError('citySlug');
  const areaM2 = input.areaM2 == null ? undefined : number(input.areaM2, 'areaM2', 0.01, 10000000);
  const year = input.year == null ? undefined : number(input.year, 'year', 1000, 9999, true);
  const sourceMedia = input.media ?? [];
  if (!Array.isArray(sourceMedia) || sourceMedia.length > 60) throw new ProjectInputError('media');

  const media = sourceMedia.map((value, index) => {
    const field = `media.${index}`;
    const image = object(value, field);
    const id = text(image.id, `${field}.id`);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(id)) throw new ProjectInputError(`${field}.id`);
    const mediaKey = key(image.contentKey, `${field}.contentKey`);
    const category = image.category;
    if (category !== 'visualization' && category !== 'drawing' && category !== 'concept' && category !== 'photo') {
      throw new ProjectInputError(`${field}.category`);
    }
    const url = text(image.url, `${field}.url`, 2048);
    // Сервер не скачивает произвольные URL. Разрешаем только текущий Blob и public/projects.
    const local = /^\/projects\/[a-zA-Z0-9/_-]+\.(webp|png|jpe?g|avif)$/.test(url);
    if (!local) {
      let parsed: URL;
      try { parsed = new URL(url); } catch { throw new ProjectInputError(`${field}.url`); }
      if (parsed.protocol !== 'https:' || parsed.hostname !== 'mstvzrmidf14lpdu.public.blob.vercel-storage.com'
        || parsed.port || parsed.username || parsed.password || parsed.search || parsed.hash || !parsed.pathname.startsWith('/projects/')) {
        throw new ProjectInputError(`${field}.url`);
      }
    }
    return {
      id, contentKey: mediaKey, category, url,
      width: number(image.width, `${field}.width`, 1, 100000, true),
      height: number(image.height, `${field}.height`, 1, 100000, true),
      storageKey: optionalText(image.storageKey, `${field}.storageKey`, 500),
      mimeType: optionalText(image.mimeType, `${field}.mimeType`),
      sizeBytes: image.sizeBytes == null ? undefined : number(image.sizeBytes, `${field}.sizeBytes`, 1, 2147483647, true),
      room: optionalText(image.room, `${field}.room`),
    } satisfies Prisma.ProjectMediaCreateInput;
  });
  if (new Set(media.map((image) => image.id)).size !== media.length || new Set(media.map((image) => image.contentKey)).size !== media.length) {
    throw new ProjectInputError('media');
  }
  const coverMediaId = optionalText(input.coverMediaId, 'coverMediaId') ?? media[0]?.id;
  if (coverMediaId && !media.some((image) => image.id === coverMediaId)) throw new ProjectInputError('coverMediaId');
  if (publicationStatus === 'published' && media.length === 0) throw new ProjectInputError('media');
  const position = input.coverPosition == null ? undefined : object(input.coverPosition, 'coverPosition');
  const coverPosition = position ? {
    x: number(position.x, 'coverPosition', 0, 100), y: number(position.y, 'coverPosition', 0, 100),
  } : undefined;

  return {
    slug, contentKey, ...classification, publicationStatus, featured,
    countryCode, citySlug, areaM2, year, media, coverMediaId, coverPosition,
    publishedAt: publicationStatus === 'published' ? new Date() : undefined,
  } satisfies Prisma.ProjectCreateInput;
}
