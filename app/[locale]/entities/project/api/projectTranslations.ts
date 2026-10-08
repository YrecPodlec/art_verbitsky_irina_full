import 'server-only';
import en from '@/messages/en.json';
import ru from '@/messages/ru.json';
import {ProjectInputError} from '../model/parseProjectInput';

// Сейчас поддерживаются две локали. При добавлении языка включи его словарь и здесь.
export function assertProjectTranslations(data: {contentKey: string; media: {contentKey: string}[]}) {
  const images = data.media;
  for (const messages of [en, ru]) {
    const project = (messages.projects as Record<string, Record<string, unknown>>)[data.contentKey];
    if (!project || !['name', 'country', 'city', 'summary', 'description', 'story'].every((key) => typeof project[key] === 'string')) {
      throw new ProjectInputError('contentKey');
    }
    if (!(project.name as string).trim()) throw new ProjectInputError('contentKey');
    const media = project.media as Record<string, {alt?: unknown}> | undefined;
    if (images.some((image) => typeof media?.[image.contentKey]?.alt !== 'string' || !(media[image.contentKey].alt as string).trim())) {
      throw new ProjectInputError('contentKey');
    }
  }
}
