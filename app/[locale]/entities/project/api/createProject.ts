import 'server-only';
import {prisma} from '@/app/[locale]/shared/lib/db/prisma';
import {parseProjectInput} from '../model/parseProjectInput';
import {assertProjectTranslations} from './projectTranslations';

// Единственное место записи новой записи. Тексты из messages в документ не копируем.
export async function createProject(input: unknown) {
  const data = parseProjectInput(input);
  // Черновик можно завести до подготовки JSON; опубликованному проекту нужны переводы.
  if (data.publicationStatus === 'published') assertProjectTranslations(data);
  return prisma.project.create({data, select: {id: true, slug: true, contentKey: true, publicationStatus: true}});
}
