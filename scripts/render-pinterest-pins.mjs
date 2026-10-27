import { readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const folder = fileURLToPath(new URL('../public/pins/', import.meta.url));
const sources = (await readdir(folder)).filter((file) => file.endsWith('.svg'));

for (const source of sources) {
  const input = join(folder, source);
  const output = join(folder, `${parse(source).name}.png`);
  await sharp(input).png({ compressionLevel: 9 }).toFile(output);
  process.stdout.write(`Rendered ${output}\n`);
}
