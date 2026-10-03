'use client';

import {useEffect, useRef, useSyncExternalStore, type FormEvent} from 'react';
import {useInquiry} from './InquiryProvider';

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

// Здесь поведение формы: состояние, фокус и демо-отправка. JSX остаётся в ui/ContactForm.
export function useContactForm() {
  const inquiry = useInquiry();
  const nameRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const wasPreview = useRef(false);
  // До подключения обработчика форма отключена: личные данные не попадут в URL при обычном HTML-submit.
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);

  useEffect(() => {
    if (inquiry.preview) previewRef.current?.focus();
    else if (wasPreview.current) nameRef.current?.focus();
    wasPreview.current = inquiry.preview;
  }, [inquiry.preview]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (event.currentTarget.reportValidity()) inquiry.setPreview(true);
    // API и сохранение не подключены. Это только демонстрация подтверждения из макета.
  }

  return {...inquiry, ready, nameRef, previewRef, submit};
}
