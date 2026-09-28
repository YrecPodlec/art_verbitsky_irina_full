import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';

// Сверяем структуру переводов с en.json: новый язык не должен терять ключи.
const directory = path.join(process.cwd(), 'messages');
const files = (await readdir(directory)).filter((file) => file.endsWith('.json'));
const reference = JSON.parse(await readFile(path.join(directory, 'en.json'), 'utf8'));

function flatten(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const name = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === 'object' && !Array.isArray(child)
      ? flatten(child, name)
      : [[name, child]];
  });
}

const expected = new Map(flatten(reference));
let failures = 0;

function placeholders(value) {
  return [...String(value).matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g)]
    .map((match) => match[1])
    .sort()
    .join(',');
}

for (const file of files) {
  const current = new Map(flatten(JSON.parse(await readFile(path.join(directory, file), 'utf8'))));
  for (const [key, value] of expected) {
    if (!current.has(key)) {
      console.error(`${file}: missing ${key}`);
      failures++;
    } else if (typeof current.get(key) !== typeof value || String(current.get(key)).trim() === '') {
      console.error(`${file}: invalid ${key}`);
      failures++;
    } else if (placeholders(current.get(key)) !== placeholders(value)) {
      console.error(`${file}: different placeholders in ${key}`);
      failures++;
    }
  }
  for (const key of current.keys()) {
    if (!expected.has(key)) {
      console.error(`${file}: unexpected ${key}`);
      failures++;
    }
  }
}

if (failures) process.exitCode = 1;
else console.log(`Checked ${files.length} locale files and ${expected.size} message keys.`);
