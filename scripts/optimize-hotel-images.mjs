import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
const entries = [
  ['itc-grand-goa','ITC GRAND GOA RESORT AND SPA.webp'],
  ['taj-fort-aguada','Taj Fort Aguada Resort & Spa.webp'],
  ['ahilya-by-the-sea','Ahilya by the Sea.jpg'],
  ['taj-exotica','Taj Exotica Resort & Spa, Goa.webp'],
  ['alila-diwa-goa','Alila Diwa Goa.webp'],
  ['courtyard-colva','Courtyard by Marriott Goa Colva.webp'],
  ['w-goa','W Goa.webp'],
  ['calangute-residency','Calangute Residency.webp'],
  ['panaji-residency','Panaji Residency.webp'],
  ['amrapali-house-of-grace','Amrapali • House of Grace.webp'],
];
const outDir = join('public','hotel-images');
await mkdir(outDir,{recursive:true});
for (const [slug,input] of entries) {
  const source = join('public',input);
  const thumb = join(outDir,`${slug}-thumb.webp`);
  const profile = join(outDir,`${slug}.webp`);
  await sharp(source).rotate().resize({width:520,height:360,fit:'inside',withoutEnlargement:true}).webp({quality:72,effort:5}).toFile(thumb);
  await sharp(source).rotate().resize({width:1200,height:900,fit:'inside',withoutEnlargement:true}).webp({quality:78,effort:5}).toFile(profile);
  const [a,b] = await Promise.all([stat(thumb),stat(profile)]);
  console.log(`${slug}: thumbnail ${a.size} bytes, profile ${b.size} bytes`);
}
