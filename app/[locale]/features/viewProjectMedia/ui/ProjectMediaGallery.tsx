'use client';

import Image from 'next/image';
import {useId} from 'react';
import type messages from '@/messages/en.json';
import type {LocalizedProjectMedia} from '@/app/[locale]/entities/project';
import {IconButton} from '@/app/[locale]/shared/UI/iconButton/IconButton';
import {useImageViewer} from '../model/useImageViewer';
import {galleryImageSizes, type MediaLayout} from '../model/galleryPresentation';
import styles from './ProjectMediaGallery.module.scss';

type Props = {images: LocalizedProjectMedia[]; copy: typeof messages.projectCase.viewer; title: string; layout?: MediaLayout};

// Одна feature подходит для визуализаций, чертежей, концепций и фото: категория отбирается сервером.
// Изображения сетки загружаются лениво, увеличенная версия — только после открытия.
export function ProjectMediaGallery({images, copy, title, layout = 'grid'}: Props) {
  const {dialogRef, activeIndex, open, close, move, select, onClose} = useImageViewer(images.length);
  const id = useId();
  const selected = activeIndex === null ? null : images[activeIndex];
  return <>
    {/* Колонки masonry укладывает CSS: не нужны ResizeObserver, измерения и лишние перерендеры. */}
    <div className={layout === 'masonry' ? styles.masonry : styles.grid} data-layout={layout} role="group" aria-label={title}>
      {images.map((image, index) => <figure className={styles.figure} key={image.id}>
        <button type="button" className={styles.open} onClick={() => open(index)} aria-label={`${copy.open}: ${image.alt}`} aria-haspopup="dialog">
          <Image src={image.url} alt={image.alt} width={image.width} height={image.height} sizes={galleryImageSizes(layout, index)} quality={90} className={styles.image} />
          <span className={styles.overlay} aria-hidden="true">
            <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.imageTitle}>{image.caption || image.alt}</span>
            <span className={styles.expand}>↗</span>
          </span>
        </button>
        {image.caption && <figcaption>{image.caption}</figcaption>}
      </figure>)}
    </div>
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={id} onClose={onClose} onClick={(e) => {if (e.target === e.currentTarget) close();}} onKeyDown={(e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1);}
    }}>
      <div className={styles.viewer}>
        <header className={styles.viewerHeader}>
          <h2 id={id}>{title}</h2>
          {selected && <a className={styles.original} href={selected.url} target="_blank" rel="noopener noreferrer">{copy.original}<span aria-hidden="true">↗</span></a>}
          <IconButton label={copy.close} onClick={close}>×</IconButton>
        </header>
        {selected && <>
          <div className={styles.stage}>
            {images.length > 1 && <IconButton className={styles.previous} label={copy.previous} onClick={() => move(-1)}>←</IconButton>}
            {/* В просмотрщике отдаём оригинал из Blob, без уменьшения и повторного кодирования Next. */}
            <Image key={selected.id} src={selected.url} alt={selected.alt} fill unoptimized loading="eager" className={styles.fullImage} />
            {images.length > 1 && <IconButton className={styles.next} label={copy.next} onClick={() => move(1)}>→</IconButton>}
          </div>
          <p className={styles.caption} aria-live="polite">{(activeIndex ?? 0) + 1} / {images.length} · {selected.caption || selected.alt}</p>
          {images.length > 1 && <div className={styles.thumbs} role="group" aria-label={copy.thumbnails}>
            {images.map((image, index) => <button key={image.id} type="button" aria-label={`${copy.select} ${index + 1}`} aria-pressed={index === activeIndex} onClick={() => select(index)}><Image src={image.url} alt="" width={96} height={64} sizes="96px" /></button>)}
          </div>}
        </>}
      </div>
    </dialog>
  </>;
}
