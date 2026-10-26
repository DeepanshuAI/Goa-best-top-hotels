const productionOrigin = 'https://goa-best-hotels.vercel.app';
const configuredSiteUrl = process.env.SITE_URL?.trim();

if (configuredSiteUrl) {
  const parsedSiteUrl = new URL(configuredSiteUrl);
  if (parsedSiteUrl.origin !== productionOrigin || parsedSiteUrl.pathname !== '/' || parsedSiteUrl.search || parsedSiteUrl.hash) {
    throw new Error(`SITE_URL must be the production origin ${productionOrigin}, without a path, query, or hash.`);
  }
}

export const site = productionOrigin;
