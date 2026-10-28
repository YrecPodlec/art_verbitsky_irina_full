'use client';

import {useEffect, useRef, useState} from 'react';
import {nextImageIndex} from './imageNavigation';

// ref обращается к нативному dialog: браузер сам удерживает фокус и обрабатывает Escape.
// В state — только выбранный кадр, а не копия массива изображений.
export function useImageViewer(length: number) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {document.body.style.overflow = previous;};
  }, [isOpen]);
  function open(index: number) { setActiveIndex(index); dialogRef.current?.showModal(); }
  function close() { dialogRef.current?.close(); }
  function move(delta: number) { setActiveIndex((current) => nextImageIndex(current ?? 0, delta, length)); }
  return {dialogRef, activeIndex, open, close, move, select: setActiveIndex, onClose: () => setActiveIndex(null)};
}
