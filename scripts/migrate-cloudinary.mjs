// Preserve the exact media renditions used by the site before removing the CDN.
// Run once against the old site, or again using the generated provenance manifest.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const destination = path.join(root, 'assets/media');
const manifestPath = path.join(destination, 'manifest.json');
await fs.mkdir(destination, { recursive: true });
let entries;
try {
  entries = JSON.parse(await fs.readFile(manifestPath, 'utf8')).files;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const context = { window: {}, document: { addEventListener() {} } };
  vm.runInNewContext(await fs.readFile(path.join(root, 'js/animals.js'), 'utf8'), context);
  entries = context.window.EstimacaoAnimals.ANIMALS.flatMap(animal => [
    { file: `${animal.id}.${animal.type === 'video' ? 'mp4' : 'jpg'}`, source: animal.src },
    { file: `${animal.id}-thumb.jpg`, source: animal.thumb },
  ]);
  const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  const heroUrls = [...new Set(html.match(/https:\/\/res\.cloudinary\.com\/[^"\s]+/g))];
  entries.push(...heroUrls.map(source => ({
    file: source.endsWith('.mp4') ? 'hero-dog.mp4' : 'hero-dog-poster.jpg', source,
  })));
}

async function download(entry) {
  if (!entry.source.startsWith('https://res.cloudinary.com/dc48hzb6b/')) throw new Error('Unexpected source');
  if (!/^[a-z0-9-]+\.(jpg|mp4)$/.test(entry.file)) throw new Error('Unsafe destination');
  const response = await fetch(entry.source, {
    headers: { Accept: entry.file.endsWith('.jpg') ? 'image/jpeg' : 'video/mp4' },
    signal: AbortSignal.timeout(180000),
  });
  if (!response.ok) throw new Error(`${entry.file}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const valid = entry.file.endsWith('.jpg')
    ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : bytes.toString('ascii', 4, 8) === 'ftyp';
  if (!valid || bytes.length < 100) throw new Error(`${entry.file}: invalid media`);
  if (bytes.length >= 100 * 1024 * 1024) throw new Error(`${entry.file}: exceeds GitHub file limit`);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  // Never overwrite a different existing local file.
  try {
    const existing = await fs.readFile(path.join(destination, entry.file));
    if (createHash('sha256').update(existing).digest('hex') !== sha256) throw new Error(`${entry.file}: existing file differs`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await fs.writeFile(path.join(destination, entry.file), bytes, { flag: 'wx' });
  }
  console.log(`${entry.file}: ${(bytes.length / 1024 / 1024).toFixed(2)} MiB`);
  return { file: entry.file, source: entry.source, bytes: bytes.length, sha256, contentType: response.headers.get('content-type') };
}

const files = [];
for (let i = 0; i < entries.length; i += 4) files.push(...await Promise.all(entries.slice(i, i + 4).map(download)));
await fs.writeFile(manifestPath, JSON.stringify({ migratedAt: new Date().toISOString(), files }, null, 2) + '\n');
console.log(`Preserved ${files.length} files, ${(files.reduce((sum, file) => sum + file.bytes, 0) / 1024 / 1024).toFixed(2)} MiB total.`);
