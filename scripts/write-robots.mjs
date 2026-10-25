import { readFileSync, writeFileSync } from 'node:fs';
const base='dist/robots.txt';const current=readFileSync(base,'utf8').replace(/\n?Sitemap:.*\n?/g,'').trimEnd();const origin=process.env.SITE_URL;
if(origin){const url=new URL(origin);if(url.protocol!=='https:'||url.pathname!=='/'||url.search||url.hash)throw new Error('SITE_URL must be an HTTPS origin without a path.');writeFileSync(base,`${current}\nSitemap: ${url.origin}/sitemap-index.xml\n`);}
