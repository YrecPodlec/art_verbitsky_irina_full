export type MediaLayout = 'grid' | 'masonry';

// sizes описывает ширину кадра на странице, а не размеры исходного файла.
// Полноширинному первому кадру обычной сетки нельзя задавать ширину половины колонки:
// иначе браузер выберет слишком маленькую картинку и растянет её.
export function galleryImageSizes(layout: MediaLayout, index: number): string {
  if (layout === 'masonry') return '(max-width: 48rem) calc((100vw - 4rem) / 2), (max-width: 80rem) 32vw, 24vw';
  return index === 0
    ? '(max-width: 48rem) calc(100vw - 3rem), (max-width: 64rem) 65vw, 70vw'
    : '(max-width: 32rem) calc(100vw - 3rem), (max-width: 48rem) 45vw, 35vw';
}
