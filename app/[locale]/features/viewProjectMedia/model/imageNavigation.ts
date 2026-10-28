// Индекс всегда остаётся внутри галереи; переходы работают и для одного изображения.
export function nextImageIndex(current: number, delta: number, length: number): number {
  return length > 0 ? ((current + delta) % length + length) % length : 0;
}
