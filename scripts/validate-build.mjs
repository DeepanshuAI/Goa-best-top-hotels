import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../site.config.mjs';
const root='dist';
if(!existsSync(root)) throw new Error('Build output missing. Run npm run build first.');
const files=[];
const walk=d=>{for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);e.isDirectory()?walk(p):files.push(p);}};
walk(root);
const html=files.filter(f=>f.endsWith('.html')&&!f.endsWith('googlec5446dfb6f035a7e.html'));
if(html.length!==24) throw new Error(`Expected 24 static HTML routes, found ${html.length}.`);
const paths=html.map(f=>f.slice(root.length).replaceAll('\\','/'));
for(const slug of ['itc-grand-goa','taj-fort-aguada-goa','ahilya-by-the-sea','taj-exotica-goa','alila-diwa-goa','courtyard-by-marriott-goa-colva','w-goa-vagator','calangute-residency','amrapali-house-of-grace','panaji-residency']) if(!paths.some(p=>p.includes(`/hotels/${slug}/`))) throw new Error(`Missing profile: ${slug}`);
const titles=new Map();
for(const p of html){
  const s=readFileSync(p,'utf8');
  const title=s.match(/<title>([^<]+)<\/title>/)?.[1];
  if(!title) throw new Error(`Missing title in ${p}`);
  if(titles.has(title)) throw new Error(`Duplicate title “${title}” in ${p} and ${titles.get(title)}.`);
  titles.set(title,p);
  if(!/<meta name="description" content="[^"]+"/.test(s)) throw new Error(`Missing description in ${p}`);
  const h1=(s.match(/<h1\b/g)||[]).length;
  if(h1!==1) throw new Error(`Expected one H1, found ${h1} in ${p}`);
  if(!/<meta property="og:title" content="[^"]+"/.test(s)||!/<meta property="og:description" content="[^"]+"/.test(s)) throw new Error(`Missing Open Graph title/description in ${p}`);
  if(/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(s)) throw new Error(`Unexpected noindex in ${p}`);
  if(/localhost|example\.com|example\.org/.test(s)) throw new Error(`Placeholder origin found in ${p}`);
  for(const m of s.matchAll(/href="(\/[^"#]*)/g)){
    const path=m[1].split('?')[0];
    const target=path==='/'?join(root,'index.html'):existsSync(join(root,path,'index.html'))?join(root,path,'index.html'):join(root,path);
    if(!existsSync(target)) throw new Error(`Broken internal link ${m[1]} in ${p}`);
  }
  for(const m of s.matchAll(/<img\b[^>]*\bsrc="(\/[^\"]+)"/g)){
    const url=new URL(m[1],'https://local.invalid');
    const target=join(root,decodeURIComponent(url.pathname).replace(/^\//,''));
    if(!existsSync(target)) throw new Error(`Missing local image ${m[1]} in ${p}`);
  }
}
const home=readFileSync(join(root,'index.html'),'utf8');
if((home.match(/data-hotel(?=\s|>)/g)||[]).length!==10) throw new Error('Homepage does not include all ten crawlable hotel rows.');
const jsonLd=home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if(!jsonLd) throw new Error('Homepage ItemList JSON-LD missing.');
const schema=JSON.parse(jsonLd[1]);
if(schema['@type']!=='ItemList'||!schema.name?.toLowerCase().includes('curated')||schema.itemListElement.length!==10) throw new Error('Homepage structured data does not match the curated visible list.');
const origin=new URL(site).origin;
const indexPath=join(root,'sitemap-index.xml');
if(!existsSync(indexPath)) throw new Error('Sitemap index missing from production build.');
const indexXml=readFileSync(indexPath,'utf8');
if(!indexXml.startsWith('<?xml')||!indexXml.includes('<sitemapindex')||!indexXml.includes('</sitemapindex>')) throw new Error('Sitemap index is not well-formed XML.');
const mapFiles=[...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if(!mapFiles.length||new Set(mapFiles).size!==mapFiles.length||mapFiles.some(url=>new URL(url).origin!==origin)) throw new Error('Sitemap index is empty, duplicated, or has a mismatched origin.');
const locations=[];
for(const url of mapFiles){const parsed=new URL(url);const file=parsed.pathname.split('/').pop();if(parsed.search||parsed.hash||!file||!existsSync(join(root,file)))throw new Error(`Sitemap file missing or invalid for ${url}`);const xml=readFileSync(join(root,file),'utf8');if(!xml.startsWith('<?xml')||!xml.includes('<urlset')||!xml.includes('</urlset>'))throw new Error(`Sitemap ${file} is not well-formed XML.`);locations.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));}
if(new Set(locations).size!==locations.length) throw new Error('Sitemap contains duplicate URLs.');
if(locations.some(url=>{const parsed=new URL(url);return parsed.origin!==origin||parsed.search||parsed.hash||parsed.pathname==='/404.html'||parsed.pathname==='/404/';})) throw new Error('Sitemap contains a wrong-origin, parameterized, or non-indexable URL.');
const expected=paths.filter(path=>path!=='/404.html').map(path=>`${origin}${path==='/index.html'?'/':path.replace(/index\.html$/,'')}`);
if(expected.length!==locations.length||expected.some(url=>!locations.includes(url))) throw new Error('Sitemap URLs do not exactly match the canonical indexable static routes.');
const robots=readFileSync(join(root,'robots.txt'),'utf8').trim();
if(robots!==`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap-index.xml`) throw new Error('robots.txt crawl rules or sitemap declaration are incorrect.');
for(const p of html){const s=readFileSync(p,'utf8');if(p.endsWith('404.html')){if(/rel="canonical"/.test(s)||/property="og:url"/.test(s))throw new Error('404 route must not emit a canonical or Open Graph URL.');continue;}const path=p.slice(root.length).replaceAll('\\','/');const route=path==='/index.html'?'/':path.replace(/index\.html$/,'');const canonical=`${origin}${route}`;if((s.match(/rel="canonical"/g)||[]).length!==1||!s.includes(`rel="canonical" href="${canonical}"`))throw new Error(`Canonical missing or incorrect in ${p}`);if(!s.includes(`property="og:url" content="${canonical}"`))throw new Error(`Open Graph URL missing or incorrect in ${p}`);if(!s.includes('<link rel="sitemap" href="/sitemap-index.xml"'))throw new Error(`Sitemap head link missing in ${p}`);}
console.log(`Validated ${html.length} unique static routes, metadata, H1s, internal links, local images, curated ItemList JSON-LD, sitemap XML and canonical origins.`);
