'use client';

import {useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {ActionButton} from '../actionLink';

// Повторно запрашиваем серверную страницу: ссылка на тот же URL могла бы взять старый RSC-кэш.
export function RefreshButton({label}: {label: string}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <ActionButton variant="outline" disabled={pending} aria-busy={pending} onClick={() => startTransition(() => router.refresh())}>{label}</ActionButton>;
}
