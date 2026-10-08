'use client';

import {useState, type FormEvent} from 'react';
import type {ProjectType} from '@/app/generated/prisma/enums';

type Result = {error?: string; field?: string; id?: string};

// Здесь только состояние и запрос. JSX и переводы находятся в UI-компоненте.
export function useProjectForm() {
  const [type, setType] = useState<ProjectType>('residential');
  const [images, setImages] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? '').trim();
    const optionalNumber = (name: string) => value(name) === '' ? undefined : Number(value(name));
    // Ключ доступа идёт в HTTP-заголовок, не в объект проекта или адрес страницы.
    const token = value('adminToken');
    const data = {
      slug: value('slug'), contentKey: value('contentKey'), type: value('type'), category: value('category'),
      publicationStatus: value('publicationStatus'), featured: form.has('featured'),
      countryCode: value('countryCode').toUpperCase() || undefined, citySlug: value('citySlug') || undefined,
      areaM2: optionalNumber('areaM2'), year: optionalNumber('year'), coverMediaId: value('coverMediaId') || undefined,
      media: images.map((id) => ({
        id, contentKey: value(`media.${id}.contentKey`), category: value(`media.${id}.category`),
        url: value(`media.${id}.url`), width: Number(value(`media.${id}.width`)), height: Number(value(`media.${id}.height`)),
      })),
    };
    setPending(true);
    setResult(null);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify(data), signal: AbortSignal.timeout(30000),
      });
      const body = await response.json() as Result;
      setResult(response.ok ? {id: body.id} : {error: body.error ?? 'UNKNOWN', field: body.field});
    } catch {
      // При обрыве ответ мог потеряться уже после записи: не повторяем POST автоматически.
      setResult({error: 'NETWORK_ERROR'});
    } finally { setPending(false); }
  }

  return {type, setType, images, pending, result, submit,
    addImage: () => setImages((current) => [...current, `image-${crypto.randomUUID()}`]),
    removeImage: (id: string) => setImages((current) => current.filter((image) => image !== id)),
  };
}
