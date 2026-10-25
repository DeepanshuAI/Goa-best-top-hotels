import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const root='dist';
if(!existsSync(root)) throw new Error('Build output missing. Run npm run build first.');
const files=[];
const walk=d=>{for(const e of readdirSync(d,{withFileTypes:true})){const p=join(d,e.name);e.isDirectory()?walk(p):files.push(p);}};
walk(root);
const html=files.filter(f=>f.endsWith('.html'));
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
const site=process.env.SITE_URL;
if(site){
  if(!existsSync(join(root,'sitemap-index.xml'))) throw new Error('SITE_URL set but sitemap missing.');
  const origin=new URL(site).origin;
  const map=readFileSync(join(root,'sitemap-index.xml'),'utf8');
  const mapFiles=[...map.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  if(!mapFiles.length||mapFiles.some(url=>new URL(url).origin!==origin)) throw new Error('Sitemap index is missing or has a mismatched origin.');
  const locations=[];
  for(const url of mapFiles){const file=new URL(url).pathname.split('/').pop();if(!file||!existsSync(join(root,file)))throw new Error(`Sitemap file missing for ${url}`);const xml=readFileSync(join(root,file),'utf8');locations.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));}
  if(locations.some(url=>new URL(url).origin!==origin||new URL(url).pathname==='/404/')) throw new Error('Sitemap contains a wrong-origin or non-indexable 404 URL.');
  const expected=paths.filter(path=>path!=='/404.html').map(path=>`${origin}${path==='/index.html'?'/':path.replace(/index\.html$/,'')}`);
  if(expected.some(url=>!locations.includes(url))) throw new Error('Sitemap is missing a canonical indexable route.');
  const robots=readFileSync(join(root,'robots.txt'),'utf8');
  if(!robots.includes('Allow: /')||robots.includes('Disallow: /')||!robots.includes(`${origin}/sitemap-index.xml`)) throw new Error('robots.txt crawl or sitemap directive is incorrect.');
  for(const p of html){const s=readFileSync(p,'utf8');if(p.endsWith('404.html')){if(/rel="canonical"/.test(s)||/property="og:url"/.test(s))throw new Error('404 route must not emit a canonical or Open Graph URL.');continue;}const path=p.slice(root.length).replaceAll('\\','/');const route=path==='/index.html'?'/':path.replace(/index\.html$/,'');const canonical=`${origin}${route}`;if((s.match(/rel="canonical"/g)||[]).length!==1||!s.includes(`rel="canonical" href="${canonical}"`))throw new Error(`Canonical missing or incorrect in ${p}`);if(!s.includes(`property="og:url" content="${canonical}"`))throw new Error(`Open Graph URL missing or incorrect in ${p}`);}
}else{
  for(const p of html){const s=readFileSync(p,'utf8');if(/rel="canonical"/.test(s))throw new Error(`Canonical emitted without configured SITE_URL in ${p}`);}
  const robots=readFileSync(join(root,'robots.txt'),'utf8');
  if(!robots.includes('Allow: /')||robots.includes('Disallow: /')||/Sitemap:/i.test(robots)) throw new Error('Default robots.txt must allow crawling and omit an unconfigured sitemap URL.');
}
console.log(`Validated ${html.length} unique static routes, metadata, H1s, internal links, local images, curated ItemList JSON-LD and all ten profiles.${site?' Sitemap, canonical and robots origins verified.':' SITE_URL not set; production canonical and sitemap intentionally deferred.'}`);
