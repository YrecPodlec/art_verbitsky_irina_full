// Ограничиваем JSON до чтения целиком: картинки должны быть URL, не base64-файлы.
export async function readJson(request: Request, maxBytes = 128 * 1024): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new Error('UNSUPPORTED_MEDIA_TYPE');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new Error('INVALID_JSON');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error('PAYLOAD_TOO_LARGE');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(body)); }
  catch { throw new Error('INVALID_JSON'); }
}
