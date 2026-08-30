/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://algobuddy.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  transform: async (config, path) => ({
    loc: path,
    lastmod: new Date().toISOString(),
  }),
};

module.exports = config;
