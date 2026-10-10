import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'assets/media/manifest.json'), 'utf8'));
const base = process.argv[2];
const read = async file => {
  if (!base) return fs.readFile(path.join(root, file));
  const response = await fetch(new URL(file, base), { signal: AbortSignal.timeout(180000) });
  assert.equal(response.status, 200, `${file}: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
};
const sourceFiles = ['index.html', ...await fs.readdir(path.join(root, 'js')).then(files => files.filter(f => f.endsWith('.js')).map(f => `js/${f}`)), 'css/style.css'];
const sources = new Map();
for (const file of sourceFiles) {
  const text = (await read(file)).toString('utf8');
  assert(!/cloudinary/i.test(text), `${file}: remaining CDN dependency`);
  sources.set(file, text);
}
const context = { window: {}, document: { addEventListener() {} } };
vm.runInNewContext(sources.get('js/animals.js'), context);
const references = context.window.EstimacaoAnimals.ANIMALS.flatMap(a => [a.src, a.thumb]);
references.push(...[...sources.get('index.html').matchAll(/(?:src|poster)="(assets\/media\/[^"?]+)"/g)].map(match => match[1]));
const expected = new Set(manifest.files.map(file => `assets/media/${file.file}`));
assert.equal(expected.size, 16);
assert.equal(new Set(references).size, expected.size, 'Every preserved file must be referenced');
for (const ref of references) assert(expected.has(ref), `Unexpected media: ${ref}`);
for (let i = 0; i < manifest.files.length; i += 4) {
  await Promise.all(manifest.files.slice(i, i + 4).map(async file => {
    const bytes = await read(`assets/media/${file.file}`);
    assert.equal(bytes.length, file.bytes, `${file.file}: size mismatch`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, `${file.file}: hash mismatch`);
    console.log(`OK ${file.file}`);
  }));
}
console.log(`PASS: ${expected.size} files preserved and linked; no Cloudinary in runtime sources (${base || 'local'}).`);
