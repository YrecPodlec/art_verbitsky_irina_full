import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const directory = fileURLToPath(new URL('../messages/', import.meta.url));

// Сравниваем ключи, не значения: перевод может отличаться, структура словарей — нет.
function collectKeys(value, prefix = '') {
  if (typeof value === 'string') return [prefix];
  // В services есть массивы строк: Object.entries также проверит их индексы и длину.
  if (!value || typeof value !== 'object') {
    throw new Error(`Ожидался текст или объект переводов: ${prefix}`);
  }
  return Object.entries(value).flatMap(([key, nested]) =>
    collectKeys(nested, prefix ? `${prefix}.${key}` : key),
  );
}

try {
  const files = (await readdir(directory)).filter((file) => file.endsWith('.json')).sort();
  if (files.length === 0) throw new Error('Нет JSON-словарей');
  const dictionaries = await Promise.all(files.map(async (file) => ({
    file,
    keys: new Set(collectKeys(JSON.parse(await readFile(path.join(directory, file), 'utf8')))),
  })));
  const reference = dictionaries[0];
  let mismatches = 0;
  for (const dictionary of dictionaries.slice(1)) {
    const missing = [...reference.keys].filter((key) => !dictionary.keys.has(key));
    const extra = [...dictionary.keys].filter((key) => !reference.keys.has(key));
    if (missing.length || extra.length) {
      mismatches++;
      console.error(`${dictionary.file}: отсутствуют [${missing.join(', ')}], лишние [${extra.join(', ')}] относительно ${reference.file}`);
    }
  }
  if (mismatches) process.exitCode = 1;
  else console.log(`Словари согласованы: ${files.join(', ')}; ${reference.keys.size} текстовых ключей.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
